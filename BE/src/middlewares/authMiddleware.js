const jwt = require("jsonwebtoken");
const SECRET_KEY = "ITS_SURVEY_SECRET_KEY_2026";

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Thiếu token xác thực" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ error: "Token không hợp lệ hoặc đã hết hạn" });
    req.user = user;
    next();
  });
};
