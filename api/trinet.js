const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  const { endpoint } = req.query;
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.TRINET_CLIENT_ID);
    params.append("client_secret", process.env.TRINET_CLIENT_SECRET);

    const authRes = await fetch("https://api.trinet.com/oauth/accesstoken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });
    const authText = await authRes.text();
    if (!authRes.ok) return res.status(200).json({ debug: "auth_failed", status: authRes.status, response: authText });
    const token = JSON.parse(authText).access_token;
    const apiRes = await fetch(`https://api.trinet.com/v1/company/${process.env.TRINET_COMPANY_ID}/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.status(200).json(await apiRes.json());
  } catch (err) {
    return res.status(200).json({ debug: "exception", error: err.message });
  }
};

module.exports = handler;
