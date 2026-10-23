const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./src/routes/authRoutes");
const surveyRoutes = require("./src/routes/surveyRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

// Phục vụ các file tĩnh của Frontend từ thư mục FE
app.use(express.static(path.join(__dirname, "../FE")));

// Đăng ký API Routes
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);

// Bắt mọi route khác trỏ về index.html để FE tự xử lý
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../FE/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Hệ thống ITS đang chạy tại: http://localhost:${PORT}`);
});
