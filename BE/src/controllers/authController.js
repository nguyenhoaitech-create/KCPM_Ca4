const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const SECRET_KEY = "ITS_SURVEY_SECRET_KEY_2026";

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập tài khoản và mật khẩu" });
  }

  const user = userModel.findUser(username);

  if (user && user.password === password) {
    const access_token = jwt.sign(
      { username: user.username, role: user.role || "Surveyor" },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    return res.json({ access_token, token_type: "Bearer" });
  } 
  
  return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
};