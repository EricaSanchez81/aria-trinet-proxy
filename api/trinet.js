const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json({
    client_id_exists: !!process.env.TRINET_CLIENT_ID,
    client_id_length: process.env.TRINET_CLIENT_ID ? process.env.TRINET_CLIENT_ID.length : 0,
    secret_exists: !!process.env.TRINET_CLIENT_SECRET,
    secret_length: process.env.TRINET_CLIENT_SECRET ? process.env.TRINET_CLIENT_SECRET.length : 0,
    company_exists: !!process.env.TRINET_COMPANY_ID,
    company_length: process.env.TRINET_COMPANY_ID ? process.env.TRINET_COMPANY_ID.length : 0,
  });
};

module.exports = handler;
