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
<<<<<<< Updated upstream
app.use(express.static(path.join(__dirname, "../FE")));
=======
app.use(express.static(path.join(__dirname, "../FE"), { index: "index.html" }));
>>>>>>> Stashed changes

// Đăng ký API Routes
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);

// Bắt mọi route khác trỏ về index.html để FE tự xử lý
<<<<<<< Updated upstream
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../FE/index.html"));
=======
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../FE/index.html"));
>>>>>>> Stashed changes
});

app.listen(PORT, () => {
  console.log(`🚀 Hệ thống ITS đang chạy tại: http://localhost:${PORT}`);
});
setInterval(() => {}, 1000000);
