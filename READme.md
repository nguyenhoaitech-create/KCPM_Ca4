# 🚦 ITS Survey Application v5.0 - Fullstack MVC & QA Ready

## Ứng dụng Khảo sát Hệ thống Giao thông Thông minh

> **Intelligent Transportation System Survey Application**
> Ứng dụng web hiện đại hỗ trợ khảo sát và thu thập dữ liệu về hạ tầng giao thông thông minh, sử dụng GPS, bản đồ tương tác và hệ thống API Backend bảo mật.

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Cập nhật mới nhất (v5.0)](#-cập-nhật-mới-nhất-v50)
- [Tính năng chi tiết](#-tính-năng-chi-tiết)
- [Tối ưu hóa Kiểm thử (QA Ready)](#-tối-ưu-hóa-kiểm-thử-qa-ready)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Yêu cầu hệ thống & Cài đặt](#-yêu-cầu-hệ-thống--cài-đặt)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)

---

## 🎯 Giới thiệu

**ITS Survey Application** là ứng dụng web được phát triển để hỗ trợ công tác khảo sát thực địa về hạ tầng giao thông thông minh. Ứng dụng cung cấp các công cụ mạnh mẽ để:

- 📍 Thu thập tọa độ GPS chính xác của các điểm hạ tầng ITS.
- 🚦 Phân loại và đánh giá tình trạng giao thông.
- 🛣️ Ghi lại hành trình khảo sát.
- 📊 Phân tích dữ liệu thống kê trực quan.
- 📤 Xuất báo cáo và dữ liệu theo nhiều định dạng.
- 🔒 **Bảo mật:** Quản lý phiên làm việc thông qua JSON Web Token (JWT).

---

## 🚀 Cập nhật mới nhất (v5.0)

Dự án đã được tái cấu trúc toàn diện từ ứng dụng tĩnh thành một hệ thống Fullstack chuẩn mực:

- **Kiến trúc MVC:** Phân tách rõ ràng trách nhiệm của Controllers, Models, Routes và Services.
- **Unified Architecture:** Frontend và Backend được gộp chung, chạy trên cùng một port `8080`, giải quyết triệt để lỗi CORS và đơn giản hóa quá trình triển khai (deployment).
- **Sửa lỗi Express 5.x:** Khắc phục lỗi `PathError` bằng cách cập nhật regex điều hướng dự phòng (`app.get(/.*/, ...)`).
- **Tối ưu API:** Bổ sung tính năng phân trang (`page`, `limit`) cho API danh sách điểm khảo sát (BUG-04).
- **Xử lý lỗi tập trung:** Bổ sung `try-catch` và hàm `fetchWithAuth` ở Frontend để tự động đính kèm token vào mọi request (BUG-05).

---

## ✨ Tính năng chi tiết

### 1. 🗺️ Bản đồ tương tác

| Tính năng             | Mô tả                                                                 |
| --------------------- | --------------------------------------------------------------------- |
| **6 lớp bản đồ**      | Carto Light, Carto Dark, OpenStreetMap, Vệ tinh, Địa hình, Watercolor |
| **Tìm kiếm địa điểm** | Tìm kiếm bằng text hoặc giọng nói                                     |
| **Mini Map**          | Bản đồ thu nhỏ góc màn hình                                           |
| **Toàn màn hình**     | Xem bản đồ full screen                                                |

### 2. 📝 Khảo sát điểm ITS & Không gian GIS

- 🚗 **Đánh giá mật độ giao thông:** Xanh (Thấp), Vàng (TB), Cam (Cao), Đỏ (Ùn tắc).
- 🛣️ **Đánh giá tình trạng đường:** Tốt, Trung bình, Kém, Hư hỏng.
- 📏 **Đo khoảng cách:** Đo khoảng cách thực địa đa điểm.
- 🔥 **Bản đồ nhiệt (Heatmap):** Trực quan hóa điểm nghẽn giao thông dựa trên trọng số ùn tắc.
- 📦 **Gom nhóm điểm (Cluster):** Gộp các điểm khảo sát liền kề để giảm tải giao diện.
- 🌡️ **Thời tiết Realtime:** Tích hợp API Open-Meteo dự báo thời tiết tại điểm khảo sát.

### 3. 📊 Thống kê, Báo cáo & Xuất dữ liệu

- **Dashboard Thống kê:** Tổng số điểm, km khảo sát, điểm ùn tắc, biểu đồ tỷ lệ.
- **Ghi hành trình (Tracking):** Theo dõi quãng đường, thời gian, tốc độ trung bình và tốc độ tối đa.
- **Xuất Dữ liệu:** JSON (Backup), CSV (Excel), GeoJSON (QGIS/ArcGIS), KML (Google Earth).

---

## 🧪 Tối ưu hóa Kiểm thử (QA Ready)

- **Data-TestID Integration:** 100% các nút bấm, input form, tab điều hướng, biểu đồ và các thẻ hiển thị dữ liệu động đều được gán thuộc tính `data-testid` (VD: `data-testid="input-point-name"`, `data-testid="btn-submit-survey"`).
- **Tránh Xung Đột CSS/JS:** Việc sử dụng `data-testid` giúp các kịch bản Automation Test (Cypress/Playwright/Selenium) không bị gãy (flaky tests) khi UI/UX thay đổi cấu trúc `class` hoặc `id`.
- **Trạng Thái Thông Báo Rõ Ràng:** Các cảnh báo (Toasts, SweetAlert) được tách bạch, giúp script kiểm thử dễ dàng bắt (catch) và xác minh (verify) kết quả hành động của người dùng.

---

## 📁 Cấu trúc dự án

Dự án hiện áp dụng mô hình phân tách thư mục phẳng (Flattened Structure) và kiến trúc MVC cho Backend:

```text
DA_ITS/
├── BE/                           # Backend API (Node.js/Express)
│   ├── controllers/              # Chứa logic xử lý của API (authController.js, surveyController.js)
│   ├── middlewares/              # Lọc request, xác thực token (authMiddleware.js)
│   ├── models/                   # Tương tác Database/Dữ liệu (userModel.js, surveyModel.js)
│   ├── routes/                   # Định tuyến các Endpoints (authRoutes.js, surveyRoutes.js)
│   ├── package.json              # Khai báo thư viện Backend
│   └── server.js                 # Entry point, khởi chạy Express, cấu hình CORS và phục vụ thư mục FE
├── FE/                           # Frontend Giao diện (Vanilla JS/HTML/CSS)
│   ├── index.html                # Giao diện chính chứa DOM và data-testid
│   ├── styles.css                # Toàn bộ CSS định dạng, bao gồm màn hình Login
│   ├── api.js                    # Cấu hình Fetch chung và bám JWT Token
│   ├── auth.js                   # Xử lý logic Đăng nhập/Đăng xuất
│   └── app.js                    # Khởi tạo bản đồ Leaflet và logic GIS
└── README.md                     # Tài liệu dự án
## 🛠️ Công nghệ sử dụng

### Lõi Ứng dụng & WebGIS## 📖 Hướng dẫn sử dụng chi tiết

_(Các bước tương tác UI thủ công & kịch bản Test)_

### 1. Thêm điểm khảo sát (Test Scenario: Create Point)

1. Lấy vị trí (Click **📍 Crosshairs** hoặc `Ctrl + L`).
2. Click nút **➕ Thêm điểm khảo sát** (Gắn `data-testid="btn-add-marker-floating"`).
3. Điền Form khảo sát:

- Tên điểm (`data-testid="input-point-name"`)
- Loại hạ tầng (`data-testid="select-point-category"`)
- Mật độ/Tình trạng (`data-testid="select-traffic-flow"`)

4. Click **Lưu điểm khảo sát** (`data-testid="btn-submit-survey"`).
5. Xác minh: Marker xuất hiện trên bản đồ, bộ đếm tăng lên 1 (`data-testid="point-count-display"`).

### 2. Các chức năng chức năng nổi bật

- **Tìm kiếm giọng nói:** Click 🎤 Microphone -> Cấp quyền -> Nói địa điểm.
- **Đo khoảng cách:** Click 📏 Ruler -> Click các điểm trên map -> Xem khoảng cách tại `data-testid="measure-text"`.
- **Ghi hành trình:** Qua Tab Giao thông (`data-testid="tab-btn-traffic"`) -> Bắt đầu ghi -> Di chuyển mô phỏng -> Dừng ghi -> Kiểm tra lịch sử (`data-testid="trip-history-list"`).
- **Chế độ Tối/Sáng:** Phím tắt `D` hoặc click icon mặt trăng (`data-testid="btn-theme-toggle"`).

---

## ⌨️ Phím tắt

| Phím       | Chức năng                  | Phục vụ Kiểm thử      |
| ---------- | -------------------------- | ----------

- **Frontend:** HTML5, CSS3 (CSS Variables), JavaScript (ES6+).
- **Map Engine:** Leaflet.js 1.9.4.
- **Map Plugins:** MarkerCluster, Leaflet Heat, Routing Machine, Geocoder, MiniMap.

### UI/UX & Data Visualization

- **Biểu đồ:** Chart.js + Datalabels Plugin.
- **Giao diện:** SweetAlert2 (Modals), Notyf (Toasts), Tippy.js (Tooltips), Font Awesome 6.
- **Hiệu ứng:** GSAP, AOS, Animate.css, Lottie-player.

### Utilities & Testing

- **Xử lý tiện ích:** Day.js (Thời gian), Lodash, FileSaver.js, JSZip, html2canvas, jsPDF.
- **QA/Testing Mappings:** Hệ thống `data-testid` selector native, sẵn sàng tích hợp Automation Frameworks.

## 💾 Lưu trữ dữ liệu

Dữ liệu mô phỏng việc gọi API bằng cách lưu tạm trong **LocalStorage** của trình duyệt:

- `its-survey-points`: Danh sách điểm khảo sát (Array of Objects).
- `its-trip-history`: Lịch sử hành trình.
- `its-dark-mode`: Trạng thái Theme (Boolean).

_QA Note: Trong quá trình viết Automation Test (Cypress/Selenium), cần dùng lệnh `localStorage.clear()` ở hook `beforeEach` để đảm bảo test runner được làm sạch (clean state)._

---

## 📄 License

MIT License © 2026 - ITS Survey Team.
```
