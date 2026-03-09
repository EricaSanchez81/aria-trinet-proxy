module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { endpoint } = req.query;

  try {
    const authUrl = `https://api.trinet.com/oauth/accesstoken?grant_type=client_credentials&client_id=${process.env.TRINET_CLIENT_ID}&client_secret=${process.env.TRINET_CLIENT_SECRET}`;
    const authRes = await fetch(authUrl, { method: "POST" });
    const authText = await authRes.text();

    if (!authRes.ok) {
      return res.status(200).json({ debug: "auth_failed", auth_status: authRes.status, auth_response: authText });
    }

    const authData = JSON.parse(authText);
    const token = authData.access_token;

    const apiRes = await fetch(
      `https://api.trinet.com/v1/company/${process.env.TRINET_COMPANY_ID}/${endpoint}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await apiRes.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(200).json({ debug: "exception", error: err.message });
  }
}
