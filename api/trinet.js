module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  var clientId = process.env.TRINET_CLIENT_ID;
  var clientSecret = process.env.TRINET_CLIENT_SECRET;
  var companyId = process.env.TRINET_COMPANY_ID;
  if (!clientId) {
    return res.status(200).json({ debug: "missing_env", client_id: "MISSING", client_secret: clientSecret ? "EXISTS" : "MISSING", company_id: companyId || "MISSING" });
  }
  var endpoint = req.query.endpoint;
  try {
    var authUrl = "https://api.trinet.com/oauth/accesstoken?grant_type=client_credentials&client_id=" + clientId + "&client_secret=" + clientSecret;
    var authRes = await fetch(authUrl, { method: "POST" });
    var authText = await authRes.text();
    if (!authRes.ok) {
      return res.status(200).json({ debug: "auth_failed", auth_status: authRes.status, auth_response: authText });
    }
    var token = JSON.parse(authText).access_token;
    var apiRes = await fetch("https://api.trinet.com/v1/company/" + companyId + "/" + endpoint, { headers: { Authorization: "Bearer " + token } });
    var data = await apiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ debug: "exception", error: err.message });
  }
};
```

5. Scroll down and click **"Commit changes"** → confirm

---

Then **redeploy in Vercel**, wait for green ✅, and test:
```
https://aria-trinet-proxy.vercel.app/api/trinet?endpoint=employees
