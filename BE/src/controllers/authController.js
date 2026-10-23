const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const SECRET_KEY = "ITS_SURVEY_SECRET_KEY_2026";

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Vá BUG-01
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập tài khoản và mật khẩu" });
  }

  const user = userModel.findUser(username, password);
  if (user) {
    const access_token = jwt.sign(
      { username: user.username, role: "Surveyor" },
      SECRET_KEY,
      { expiresIn: "2h" },
    );
    res.json({ access_token, token_type: "Bearer" });
  } else {
    res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
  }
};
