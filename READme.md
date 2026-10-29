# 🚦 ITS Survey Application v5.3 - Fullstack MVC & QA Ready

## Ứng dụng Khảo sát Hệ thống Giao thông Thông minh

> **Intelligent Transportation System Survey Application**  
> Ứng dụng web hiện đại hỗ trợ khảo sát và thu thập dữ liệu về hạ tầng giao thông thông minh, sử dụng GPS, bản đồ tương tác và hệ thống API Backend bảo mật.

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Cập nhật mới nhất (v5.3)](#-cập-nhật-mới-nhất-v53)
- [Tính năng chi tiết](#-tính-năng-chi-tiết)
- [Tối ưu hóa Kiểm thử (QA Ready)](#-tối-ưu-hóa-kiểm-thử-qa-ready)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Yêu cầu hệ thống & Cài đặt](#-yêu-cầu-hệ-thống--cài-đặt)
- [Hướng dẫn sử dụng & Phím tắt](#-hướng-dẫn-sử-dụng--phím-tắt)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Lưu trữ dữ liệu](#-lưu-trữ-dữ-liệu)
- [License](#-license)

---

## 🎯 Giới thiệu

**ITS Survey Application** là ứng dụng web được phát triển để hỗ trợ công tác khảo sát thực địa về hạ tầng giao thông thông minh. Ứng dụng cung cấp các công cụ mạnh mẽ để:

- 📍 Thu thập tọa độ GPS chính xác của các điểm hạ tầng ITS.
- 🚦 Phân loại và đánh giá tình trạng giao thông, làn đường, chất lượng mặt đường.
- 🛣️ Ghi lại hành trình khảo sát thực địa kèm tốc độ và cự ly di chuyển.
- 📊 Phân tích dữ liệu thống kê trực quan bằng biểu đồ phân phối và mật độ.
- 📤 Xuất báo cáo và dữ liệu theo nhiều định dạng chuẩn GIS và văn phòng.
- 🔒 **Bảo mật:** Quản lý phiên làm việc thông qua JSON Web Token (JWT).

---

## 🚀 Cập nhật mới nhất (v5.3)

Phiên bản **v5.3** tập trung vào nâng cao tính an toàn bảo mật, tối ưu hóa giao tiếp dịch vụ bản đồ ngoại vi, chuẩn hóa API RESTful và sửa lỗi tương thích hệ thống:

### 1. 🛡️ Vá lỗi Bảo mật XSS (BUG-SRH-02)

- **Vấn đề trước đây:** Tên địa điểm trả về từ Nominatim API (`results[0].name`) và chuỗi nhận dạng giọng nói (`transcript`) được đưa trực tiếp vào DOM qua Leaflet Popup (`setContent`) và Notyf Toasts (`innerHTML`) mà không qua bộ lọc, tiềm ẩn nguy cơ tấn công Cross-Site Scripting (XSS).
- **Giải pháp:** Bổ sung hàm tiện ích `escapeHtml()` để làm sạch và mã hóa các ký tự đặc biệt (`&`, `<`, `>`, `"`, `'`) trước khi hiển thị ra giao diện người dùng.

### 2. ⚡ Tối ưu Tìm kiếm Geocoder (BUG-SRH-01 / ISS-FE-22)

- **Vấn đề trước đây:** Khi người dùng nhập từ khóa và nhấn `Enter` nhanh (dưới 500ms), cả sự kiện phím `Enter` và hàng đợi `setTimeout` (debounce) đều đồng thời gửi yêu cầu tìm kiếm, dẫn tới việc gửi 2 request trong vòng chưa đầy 1 giây, vi phạm chính sách giới hạn 1 request/giây của dịch vụ Nominatim (FR-SRH-04).
- **Giải pháp:** Bổ sung lệnh `clearTimeout(searchTimeout)` ngay khi bắt được sự kiện `Enter`, hủy ngay request đang chờ trong debounce.

### 3. 🧩 Chuẩn hóa API Xóa Khảo sát (Backend Fix)

- **Xử lý mã trạng thái 404:** Khắc phục lỗi `DELETE /api/surveys/:id` luôn trả về HTTP 200 kể cả khi ID khảo sát không tồn tại.
- **Model Boolean Response:** Cập nhật hàm `delete()` trong `surveyModel.js` để so sánh độ dài danh sách trước và sau khi lọc, trả về `true` (nếu xóa thành công) hoặc `false` (nếu không tìm thấy bản ghi). Controller dựa vào kết quả này để phản hồi mã lỗi `404 Not Found` chính xác.

### 4. 🌐 Tương thích Express 5.x & Điều hướng Static Files

- **Sửa lỗi PathError:** Cập nhật cú pháp catch-all route tương thích với router của Express 5.x (`app.get('/{*path}', ...)` thay cho `*`).
- **Phục vụ Frontend đồng bộ:** Cấu hình `express.static` phục vụ thư mục `FE` kèm tùy chọn `{ index: "index.html" }`, đảm bảo hệ thống Fullstack hoạt động trơn tru trên cổng `8080` mà không gặp lỗi "Cannot GET /".

---

## ✨ Tính năng chi tiết

### 1. 🗺️ Bản đồ tương tác đa lớp (WebGIS)

| Lớp bản đồ / Công cụ     | Mô tả                                                                 |
| ------------------------ | --------------------------------------------------------------------- |
| **Đa lớp nền**           | OpenStreetMap, Esri World Street, Esri Dark Canvas, Vệ tinh, Địa hình |
| **Tìm kiếm Geocoder**    | Tự động tìm kiếm địa điểm thông minh qua OpenStreetMap Nominatim      |
| **Tìm kiếm giọng nói**   | Tích hợp Web Speech API (nhận diện giọng nói tiếng Việt)              |
| **Mini Map**             | Bản đồ định vị thu nhỏ ở góc màn hình                                 |
| **Tọa độ Realtime**      | Hiển thị vĩ độ, kinh độ và độ zoom theo vị trí trỏ chuột              |
| **Chế độ Toàn màn hình** | Trải nghiệm khảo sát full-screen                                      |

### 2. 📝 Khảo sát điểm ITS & Không gian GIS

- 🚗 **Đánh giá mật độ giao thông:** Thấp (Xanh), Trung bình (Vàng), Cao (Cam), Ùn tắc (Đỏ).
- 🛣️ **Đánh giá tình trạng đường:** Tốt, Khá, Trung bình, Kém, Hư hỏng.
- 📏 **Đo khoảng cách thực địa:** Công cụ thước đo đa điểm tính toán cự ly trắc địa chính xác (thuật toán Haversine).
- 🔥 **Bản đồ nhiệt (Heatmap):** Trực quan hóa các điểm nóng giao thông dựa trên trọng số mật độ thực tế.
- 📦 **Gom cụm điểm khảo sát (Marker Cluster):** Nhóm tự động các điểm lân cận để tối ưu hóa hiệu năng render.
- 🌦️ **Thời tiết thời gian thực:** Kết nối Open-Meteo API để cập nhật nhiệt độ và trạng thái thời tiết tại tọa độ GPS khảo sát.

### 3. 📊 Thống kê, Báo cáo & Xuất dữ liệu

- **Dashboard Thống kê:** Phân tích trực quan thông qua biểu đồ tròn (Phân loại hạ tầng) và biểu đồ cột (Mật độ giao thông) sử dụng Chart.js.
- **Ghi hành trình (GPS Tracking):** Ghi lại lộ trình di chuyển, đo đạc cự ly, thời gian khảo sát, tốc độ trung bình và tốc độ tối đa.
- **Xuất dữ liệu đa chuẩn:**
  - 📄 **JSON:** Sao lưu toàn bộ dữ liệu khảo sát và lịch sử hành trình.
  - 📊 **CSV:** Định dạng bảng tính tương thích Microsoft Excel / Google Sheets.
  - 🌍 **GeoJSON:** Dữ liệu không gian chuẩn mở cho phần mềm GIS (QGIS, ArcGIS).
  - 🌐 **KML:** Định dạng hiển thị không gian 3D trên Google Earth.
  - 🖨️ **Báo cáo in ấn:** Hỗ trợ xem trước và in báo cáo khảo sát tổng hợp.

---

## 🧪 Tối ưu hóa Kiểm thử (QA Ready)

- **Định danh TestID toàn diện:** 100% các nút thao tác, input form, bộ lọc, tab chức năng và các phần tử động đều được định danh bằng thuộc tính `data-testid` (Ví dụ: `data-testid="survey-item-1"`, `data-testid="btn-view-1"`, `data-testid="trip-item-..."`).
- **Kháng Flaky Tests:** Giúp các kịch bản kiểm thử tự động hóa (CodeceptJS, Playwright, Cypress, Selenium) hoạt động ổn định, không bị gãy khi thay đổi cấu trúc CSS classes.
- **Phản hồi rõ ràng:** Tách biệt rõ trạng thái thành công/lỗi qua SweetAlert2 và Notyf giúp assertions trong test script bắt kết quả chính xác.

---

## 📁 Cấu trúc dự án

Dự án áp dụng mô hình phân tách thư mục phẳng và kiến trúc MVC cho Backend:

```text
DA_ITS/
├── BE/                           # Backend API (Node.js / Express 5.x)
│   ├── src/
│   │   ├── controllers/          # Logic xử lý API (authController.js, surveyController.js)
│   │   ├── middlewares/          # Xác thực JWT (authMiddleware.js)
│   │   ├── models/               # Quản lý nguồn dữ liệu (userModel.js, surveyModel.js)
│   │   └── routes/               # Định tuyến Endpoints (authRoutes.js, surveyRoutes.js)
│   ├── package.json              # Khai báo dependency Backend
│   └── server.js                 # Entry point: Server Express, phục vụ static FE và API
├── FE/                           # Frontend Giao diện (HTML5 / CSS3 / Vanilla JS)
│   ├── index.html                # Giao diện chính chứa DOM & data-testid
│   ├── styles.css                # Toàn bộ CSS định dạng giao diện & theme
│   ├── api.js                    # Module gọi API bám kèm JWT Token
│   ├── auth.js                   # Xử lý logic Đăng nhập/Đăng xuất & kiểm tra phiên
│   └── app.js                    # Khởi tạo bản đồ Leaflet, GIS và xử lý sự kiện
├── tests/                        # Kịch bản kiểm thử tự động (Automation Test)
├── codecept.conf.js              # Cấu hình kiểm thử CodeceptJS
├── package.json                  # Cấu hình dự án & công cụ kiểm thử gốc
└── README.md                     # Tài liệu hướng dẫn dự án
```

---

## ⚙️ Yêu cầu hệ thống & Cài đặt

### Yêu cầu

- **Node.js:** Phiên bản `>= 18.x` (Đã kiểm thử hoạt động tốt trên Node.js v24.x).
- **NPM:** Phiên bản `>= 9.x`.
- Trình duyệt hiện đại hỗ trợ Geolocation và Web Speech API (Google Chrome, Microsoft Edge).

### Hướng dẫn cài đặt & Khởi chạy

1. **Cài đặt thư viện Backend:**

   ```bash
   cd BE
   npm install
   ```

2. **Khởi chạy hệ thống:**

   ```bash
   node server.js
   ```

3. **Truy cập ứng dụng:**
   Mở trình duyệt và truy cập: [http://localhost:8080](http://localhost:8080)

4. **Tài khoản đăng nhập mặc định:**
   - **Tài khoản:** `admin`
   - **Mật khẩu:** `password123`

---

## 📖 Hướng dẫn sử dụng & Phím tắt

### Quy trình khảo sát nhanh:

1. Đăng nhập bằng tài khoản được cấp quyền.
2. Nhấn nút **📍 Lấy vị trí** (hoặc nhấn `Ctrl + L`) để GPS xác định tọa độ hiện tại.
3. Nhấn **➕ Thêm điểm khảo sát**, điền các thông tin hạ tầng, số làn, mật độ, tình trạng đường và ghi chú.
4. Nhấn **Lưu điểm khảo sát** để lưu lên máy chủ và hiển thị marker trên bản đồ.

### ⌨️ Bảng phím tắt tiện ích:

| Phím tắt               | Chức năng                                  | Phục vụ Kiểm thử / Thao tác nhanh   |
| :--------------------- | :----------------------------------------- | :---------------------------------- |
| `Ctrl + S` / `Cmd + S` | Lưu trữ dữ liệu thủ công                   | Kiểm tra lưu trữ LocalStorage       |
| `Ctrl + E` / `Cmd + E` | Mở nhanh cửa sổ Xuất báo cáo               | Test popup modal báo cáo            |
| `Ctrl + L` / `Cmd + L` | Lấy tọa độ GPS hiện tại                    | Kích hoạt Geolocation watcher       |
| `D`                    | Bật / tắt giao diện Sáng - Tối (Dark Mode) | Kiểm tra chuyển đổi theme giao diện |
| `Escape`               | Đóng nhanh modal đang mở                   | Đóng cửa sổ báo cáo                 |

---

## 🛠️ Công nghệ sử dụng

### Lõi Ứng dụng & WebGIS

- **Frontend Core:** HTML5, CSS3 (CSS Variables, Flexbox, Grid), JavaScript (Vanilla ES6+).
- **Backend Core:** Node.js, Express.js 5.x, CORS.
- **Bảo mật:** JSON Web Token (JWT) cho Stateless Authentication.
- **Bản đồ (Map Engine):** Leaflet.js v1.9.4.
- **Map Plugins:** Leaflet.heat, Leaflet.markercluster, Leaflet-Control-Geocoder, Leaflet-Routing-Machine, Leaflet-MiniMap.

### UI/UX & Trực quan hóa

- **Biểu đồ:** Chart.js.
- **Thông báo & Hộp thoại:** SweetAlert2, Notyf Toasts, Tippy.js Tooltips.
- **Biểu tượng:** Font Awesome 6.
- **Hiệu ứng chuyển động:** GSAP, Animate On Scroll (AOS).
- **Thời gian & Dự báo:** Day.js, Open-Meteo Weather API.

### Tự động hóa & Kiểm thử (QA Ready)

- **Selector chuẩn:** Hệ thống `data-testid` phủ khắp các luồng nghiệp vụ chính.
- **Framework kiểm thử:** Sẵn sàng tích hợp và chạy tự động với CodeceptJS, Playwright, Selenium WebDriver.

---

## 💾 Lưu trữ dữ liệu

1. **Backend Storage:**
   - Danh sách điểm khảo sát và tài khoản được xử lý tập trung tại các model phía máy chủ (`surveyModel.js`, `userModel.js`).
2. **Frontend Storage:**
   - `its_token`: Lưu trữ JWT token xác thực phiên người dùng.
   - `its-trip-history`: Lưu trữ lịch sử các hành trình di chuyển thực địa.
   - `its-dark-mode`: Lưu trữ tùy chọn giao diện người dùng.

---

## 📄 License

Dự án được phân phối dưới giấy phép **MIT License** © 2026 - ITS Survey Development Team.
