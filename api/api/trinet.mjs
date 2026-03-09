export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const clientId = process.env.TRINET_CLIENT_ID;
  const clientSecret = process.env.TRINET_CLIENT_SECRET;
  const companyId = process.env.TRINET_COMPANY_ID;
  const { endpoint } = req.query;
  try {
    const authRes = await fetch(`https://api.trinet.com/oauth/accesstoken?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`, { method: "POST" });
    const authText = await authRes.text();
    if (!authRes.ok) return res.status(200).json({ debug: "auth_failed", status: authRes.status, response: authText });
    const token = JSON.parse(authText).access_token;
    const apiRes = await fetch(`https://api.trinet.com/v1/company/${companyId}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ debug: "exception", error: err.message });
  }
}
