export default function verifyServiceToken(req, res, next) {
  const token = req.headers["x-service-token"];

  if (!token || token !== process.env.SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized service request" });
  }

  next();
}
