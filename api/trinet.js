module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const clientId = process.env.TRINET_CLIENT_ID;
  const clientSecret = process.env.TRINET_CLIENT_SECRET;
  const companyId = process.env.TRINET_COMPANY_ID;

  // Debug: show what Vercel sees
  if (!clientId) {
    return res.status(200).json({
      debug: "missing_env",
      client_id: clientId || "MISSING",
      client_secret: clientSecret ? "EXISTS" : "MISSING",
      company_id: companyId || "MISSING",
    });
  }

  const { endpoint } = req.query;

  try {
    const authUrl = `https://api.trinet.com/oauth/accesstoken?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
    const authRes = await fetch(authUrl, { method: "POST" });
    const authText = await authRes.text();

    if (!authRes.ok) {
      return res.status(200).json({ debug: "auth_failed", auth_status: authRes.status, auth_response: authText });
    }

    const authData = JSON.parse(authText);
    const token = authData.access_token;

    const apiRes = await fetch(
      `https://api.trinet.com/v1/company/${companyId}/${endpoint}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await apiRes.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(200).json({ debug: "exception", error: err.message });
  }
}
```

3. Commit changes

---

Then **redeploy in Vercel**, wait for green ✅, and paste this in your browser:
```
https://aria-trinet-proxy.vercel.app/api/trinet?endpoint=employees
