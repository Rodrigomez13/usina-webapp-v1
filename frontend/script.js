async function fetchDashboard() {
  const res = await fetch("/api/proxy.js?action=dashboard");
  const data = await res.json();
  document.getElementById("leadsBox").textContent = "Leads: " + data.leads;
  document.getElementById("loadsBox").textContent = "Loads: " + data.loads;
  document.getElementById("conversionBox").textContent = "Conversion: " + data.conversion.toFixed(2) + "%";
  document.getElementById("priceLeadBox").textContent = "$ Lead: $" + parseFloat(data.costLead).toFixed(2);
  document.getElementById("priceLoadBox").textContent = "$ Load: $" + parseFloat(data.costLoad).toFixed(2);
  document.getElementById("priceLoadImpBox").textContent = "$ Load+Imp: $" + parseFloat(data.costLoadImp).toFixed(2);

  let tabla = "<table class='w-full text-sm text-left'><thead><tr><th></th>";
  const franquicias = data.derivaciones[0].slice(1);
  franquicias.forEach(f => tabla += "<th>" + f + "</th>");
  tabla += "<th>Total</th></tr></thead><tbody>";

  for (let i = 1; i < data.derivaciones.length; i++) {
    let row = data.derivaciones[i];
    tabla += "<tr><td>" + row[0] + "</td>";
    let total = 0;
    for (let j = 1; j < row.length; j++) {
      total += Number(row[j]);
      tabla += "<td>" + row[j] + "</td>";
    }
    tabla += "<td>" + total + "</td></tr>";
  }
  tabla += "</tbody></table>";
  document.getElementById("tablaDerivaciones").innerHTML = tabla;
}

async function fetchServer4() {
  const res = await fetch("/api/proxy.js?action=server4");
  const data = await res.json();
  const cont = document.getElementById("server4");
  cont.innerHTML = "";
  data.forEach(ad => {
    cont.innerHTML += `<div class="bg-gray-800 p-2 rounded">
      <p><strong>${ad.emoji}</strong> (${ad.estado})</p>
      <p>Leads: ${ad.leads} | Loads: ${ad.loads} | Spent: $${ad.spent}</p>
    </div>`;
  });
}

document.getElementById("refreshBtn").addEventListener("click", () => {
  fetchServer4();
  fetchDashboard();
});

document.getElementById("agregarBtn").addEventListener("click", async () => {
  const res = await fetch("/api/proxy.js?action=availableCampaigns");
  const data = await res.json();
  const lista = document.getElementById("listaCampanias");
  lista.innerHTML = "";
  data.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "w-full text-left p-2 bg-blue-600 rounded";
    btn.textContent = `${c.emoji} - $${parseFloat(c.loadCost).toFixed(2)}`;
    btn.onclick = async () => {
      await fetch("/api/proxy.js?action=addCampaign&id=" + c.id);
      cerrarModal();
      fetchServer4();
    };
    lista.appendChild(btn);
  });
  document.getElementById("modal").classList.remove("hidden");
});

function cerrarModal() {
  document.getElementById("modal").classList.add("hidden");
}

function openModalApagar() {
  fetch("/api/proxy.js?action=server4")
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("listaCampañasApagar");
      lista.innerHTML = "";
      data.forEach(ad => {
        const btn = document.createElement("button");
        btn.className = "w-full bg-red-600 p-2 rounded";
        btn.textContent = `${ad.emoji} (${ad.estado})`;
        btn.onclick = async () => {
          await fetch("/api/proxy.js?action=turnOffAd&id=" + ad.id);
          cerrarModalApagar();
          fetchServer4();
        };
        lista.appendChild(btn);
      });
      document.getElementById("modalApagar").classList.remove("hidden");
    });
}

function cerrarModalApagar() {
  document.getElementById("modalApagar").classList.add("hidden");
}

fetchDashboard();
fetchServer4();
