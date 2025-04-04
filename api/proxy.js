export default async function handler(req, res) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbzKwlkbBjaXyeSoVhJWs7hsjAiBIEQIIzpa8p_Y95ZgtMj7O0hfay-u83i9O9NKTK4_TA/exec";
  const query = req.url.split("?")[1];
  const url = `${scriptURL}?${query}`;

  try {
    const response = await fetch(url);
    const data = await response.text();
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
