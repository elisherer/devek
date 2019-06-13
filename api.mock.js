module.exports = async (req, res, next) => {
  let call = `${req.method} ${req.originalUrl}`;

  switch (call) {
    case 'GET /api/ip': {
      const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ip_address}));
      break;
    }
    default:
      return await next();
  }
};