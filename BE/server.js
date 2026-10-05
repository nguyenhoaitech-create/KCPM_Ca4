const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;
const SECRET_KEY = "ITS_SURVEY_SECRET_KEY_2026";

// ================= CƠ SỞ DỮ LIỆU TẠM (IN-MEMORY) =================
let users = [];
let surveys = [
  {
    id: 1,
    title: "Ngã tư Hàng Xanh",
    lat: 10.8016,
    lng: 106.7112,
    intensity_score: 8.5,
    category: "Giao thông",
  },
  {
    id: 2,
    title: "Bến xe Miền Đông",
    lat: 10.8116,
    lng: 106.7162,
    intensity_score: 9.0,
    category: "Nhà ga/Bến xe",
  },
];

// Middleware kiểm tra Token
const authenticateToken = (req, res, next) => {
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

// ================= 1. NHÓM XÁC THỰC (AUTH) =================
app.post("/api/auth/register", (req, res) => {
  const { username, password, email, full_name } = req.body;
  users.push({ id: Date.now(), username, password, email, full_name });
  res.status(201).json({ message: "Đăng ký thành công" });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  // Bỏ qua check pass DB để test nhanh
  if (username && password) {
    const access_token = jwt.sign({ username }, SECRET_KEY, {
      expiresIn: "2h",
    });
    res.json({ access_token, token_type: "Bearer" });
  } else {
    res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
  }
});

app.get("/api/user/profile", authenticateToken, (req, res) => {
  res.json({ username: req.user.username, role: "Surveyor" });
});

// ================= 2. NHÓM KHẢO SÁT GPS (SURVEYS) =================
app.get("/api/surveys", authenticateToken, (req, res) => {
  res.json({ page: 1, limit: 10, total: surveys.length, data: surveys });
});

app.get("/api/surveys/:id", authenticateToken, (req, res) => {
  const survey = surveys.find((s) => s.id == req.params.id);
  if (!survey) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(survey);
});

app.post("/api/surveys", authenticateToken, (req, res) => {
  const newSurvey = { id: Date.now(), ...req.body };
  surveys.push(newSurvey);
  res.status(201).json(newSurvey);
});

app.put("/api/surveys/:id", authenticateToken, (req, res) => {
  let index = surveys.findIndex((s) => s.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
  surveys[index] = { ...surveys[index], ...req.body };
  res.json(surveys[index]);
});

app.delete("/api/surveys/:id", authenticateToken, (req, res) => {
  surveys = surveys.filter((s) => s.id != req.params.id);
  res.json({ message: "Đã xóa thành công" });
});

// ================= 3. NHÓM BẢN ĐỒ (MAP/GIS) =================
app.get("/api/map/heatmap", authenticateToken, (req, res) => {
  // Trả về dữ liệu heatmap lấy từ mảng surveys
  const heatmapData = surveys.map((s) => ({
    lat: s.lat,
    lng: s.lng,
    weight: (s.intensity_score || 5) / 10,
  }));
  res.json(heatmapData);
});

// ================= 4. NHÓM BÁO CÁO =================
app.get("/api/reports/summary", authenticateToken, (req, res) => {
  res.json({ total_points: surveys.length, active_users: users.length + 1 });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend ITS Survey đang chạy tại: http://localhost:${PORT}`);
});
