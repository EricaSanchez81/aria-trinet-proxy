export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { endpoint } = req.query;

  try {
    // Get TriNet access token
    const authRes = await fetch("https://api.trinet.com/oauth/accesstoken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.TRINET_CLIENT_ID,
        client_secret: process.env.TRINET_CLIENT_SECRET,
      }),
    });
    const authData = await authRes.json();
    const token = authData.access_token;

    // Call TriNet API
    const apiRes = await fetch(
      `https://api.trinet.com/v1/company/${process.env.TRINET_COMPANY_ID}/${endpoint}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
