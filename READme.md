# 🚦 ITS Survey Application v5.0 - QA/Test Ready Edition

## Ứng dụng Khảo sát Hệ thống Giao thông Thông minh

> **Intelligent Transportation System Survey Application**
> Ứng dụng web hiện đại hỗ trợ khảo sát và thu thập dữ liệu về hạ tầng giao thông thông minh, sử dụng GPS và bản đồ tương tác.
> 🎯 **Phiên bản Đặc biệt (QA/Test Ready):** Đã được tái cấu trúc DOM, bổ sung toàn diện hệ thống định danh `data-testid` phục vụ trực tiếp cho môn học Kiểm thử phần mềm và triển khai Automation Test (Selenium, Cypress, Playwright).

---

## 📋 Mục lục

- [Giới thiệu](https://www.google.com/search?q=%23-gi%E1%BB%9Bi-thi%E1%BB%87u)
- [Tính năng chi tiết](https://www.google.com/search?q=%23-t%C3%ADnh-n%C4%83ng-chi-ti%E1%BA%BFt)
- [Tối ưu hóa Kiểm thử (QA Ready)](https://www.google.com/search?q=%23-t%E1%BB%91i-%C6%B0u-h%C3%B3a-ki%E1%BB%83m-th%E1%BB%AD-qa-ready)
- [Yêu cầu hệ thống](https://www.google.com/search?q=%23-y%C3%AAu-c%E1%BA%A7u-h%E1%BB%87-th%E1%BB%91ng)
- [Cài đặt & Chạy](https://www.google.com/search?q=%23-c%C3%A0i-%C4%91%E1%BA%B7t--ch%E1%BA%A1y)
- [Hướng dẫn sử dụng chi tiết](https://www.google.com/search?q=%23-h%C6%B0%E1%BB%9Bng-d%E1%BA%ABn-s%E1%BB%AD-d%E1%BB%A5ng-chi-ti%E1%BA%BFt)
- [Công nghệ sử dụng](https://www.google.com/search?q=%23-c%C3%B4ng-ngh%E1%BB%87-s%E1%BB%AD-d%E1%BB%A5ng)
- [Cấu trúc dự án](https://www.google.com/search?q=%23-c%E1%BA%A5u-tr%C3%BAc-d%E1%BB%B1-%C3%A1n)

---

## 🎯 Giới thiệu

**ITS Survey Application** là ứng dụng web được phát triển để hỗ trợ công tác khảo sát thực địa về hạ tầng giao thông thông minh. Ứng dụng cung cấp các công cụ mạnh mẽ để:

- 📍 Thu thập tọa độ GPS chính xác của các điểm hạ tầng ITS
- 🚦 Phân loại và đánh giá tình trạng giao thông
- 🛣️ Ghi lại hành trình khảo sát
- 📊 Phân tích dữ liệu thống kê trực quan
- 📤 Xuất báo cáo và dữ liệu theo nhiều định dạng
- 🧪 **Kiểm thử tự động:** Cung cấp bộ khung giao diện hoàn hảo để sinh viên/QA thực hành viết kịch bản kiểm thử (Test Cases, Automation Scripts).

---

## 🧪 Tối ưu hóa Kiểm thử (QA Ready)

Phiên bản này được thiết kế theo tiêu chuẩn của kỹ sư Kiểm thử phần mềm (Software Testing Standard):

- **Data-TestID Integration:** 100% các nút bấm, input form, tab điều hướng, biểu đồ và các thẻ hiển thị dữ liệu động đều được gán thuộc tính `data-testid` (VD: `data-testid="input-point-name"`, `data-testid="btn-submit-survey"`).
- **Tránh Xung Đột CSS/JS:** Việc sử dụng `data-testid` giúp các kịch bản Automation Test (Cypress/Playwright/Selenium) không bị gãy (flaky tests) khi UI/UX thay đổi cấu trúc `class` hoặc `id`.
- **Trạng Thái Thông Báo Rõ Ràng:** Các cảnh báo (Toasts, SweetAlert) được tách bạch, giúp script kiểm thử dễ dàng bắt (catch) và xác minh (verify) kết quả hành động của người dùng.

---

## ✨ Tính năng chi tiết

### 1. 🗺️ Bản đồ tương tác

| Tính năng             | Mô tả                                                                 |
| --------------------- | --------------------------------------------------------------------- |
| **6 lớp bản đồ**      | Carto Light, Carto Dark, OpenStreetMap, Vệ tinh, Địa hình, Watercolor |
| **Tìm kiếm địa điểm** | Tìm kiếm bằng text hoặc giọng nói                                     |
| **Mini Map**          | Bản đồ thu nhỏ góc màn hình                                           |
| **Toàn màn hình**     | Xem bản đồ full screen                                                |

### 2. 📍 Định vị GPS

| Tính năng                 | Mô tả                          |
| ------------------------- | ------------------------------ |
| **GPS độ chính xác cao**  | Sử dụng High Accuracy Mode     |
| **Theo dõi liên tục**     | Watch Position realtime        |
| **Hiển thị độ chính xác** | Vòng tròn bán kính theo meters |
| **Tốc độ di chuyển**      | Hiển thị km/h                  |

### 3. 📝 Khảo sát điểm ITS

| Loại điểm                 | Icon  | Mô tả                          |
| ------------------------- | ----- | ------------------------------ |
| Nút giao thông            | 🚗    | Ngã ba, ngã tư, vòng xuyến     |
| Đèn tín hiệu              | 🚦    | Đèn giao thông, đèn đi bộ      |
| Camera giám sát           | 📹    | Camera CCTV, camera phạt nguội |
| Cảm biến                  | 📡    | Cảm biến đếm xe, đo tốc độ     |
| Biển báo điện tử (VMS)    | 🖥️    | Variable Message Sign          |
| Trạm xe buýt / Bãi đỗ xe  | 🚌 🅿️ | Điểm dừng, bãi đỗ công cộng    |
| Điểm ùn tắc / Tai nạn     | ⚠️ 🔴 | Vị trí hay kẹt xe, tai nạn     |
| Công trình / Trạm thu phí | 🚧 💰 | Đang thi công, trạm BOT/ETC    |

### 4. Các công cụ GIS & Không gian

- 🚗 **Đánh giá mật độ giao thông:** Xanh (Thấp), Vàng (TB), Cam (Cao), Đỏ (Ùn tắc).
- 🛣️ **Đánh giá tình trạng đường:** Tốt, Trung bình, Kém, Hư hỏng.
- 📏 **Đo khoảng cách:** Đo khoảng cách thực địa đa điểm.
- 🔥 **Bản đồ nhiệt (Heatmap):** Trực quan hóa điểm nghẽn giao thông dựa trên trọng số ùn tắc.
- 📦 **Gom nhóm điểm (Cluster):** Gộp các điểm khảo sát liền kề để giảm tải giao diện.
- 🛤️ **Vẽ tuyến đường (Routing):** Chỉ đường và tính toán thời gian di chuyển.
- 🌡️ **Thời tiết Realtime:** Tích hợp API dự báo thời tiết tại điểm khảo sát.

### 5. 📊 Thống kê, Báo cáo & Xuất dữ liệu

- **Dashboard Thống kê:** Tổng số điểm, km khảo sát, điểm ùn tắc, biểu đồ tỷ lệ.
- **Ghi hành trình (Tracking):** Theo dõi quãng đường, thời gian, tốc độ trung bình và tốc độ tối đa.
- **Xuất Dữ liệu:** JSON (Backup), CSV (Excel), GeoJSON (QGIS/ArcGIS), KML (Google Earth).
- **Xuất Báo cáo:** Tạo báo cáo tổng hợp để in (Print/PDF).

---

## 💻 Yêu cầu hệ thống

| Yêu cầu             | Chi tiết                                            |
| ------------------- | --------------------------------------------------- |
| **Trình duyệt**     | Chrome 80+, Firefox 75+, Edge 80+, Safari 13+       |
| **Môi trường Test** | Tương thích Selenium WebDriver, Cypress, Playwright |
| **Internet**        | Cần kết nối để tải bản đồ & Thư viện CDN            |
| **GPS/Quyền**       | Cho phép truy cập vị trí, microphone (voice search) |

---

## 🚀 Cài đặt & Chạy

### Cách 1: VS Code Live Server (Khuyến nghị cho QA/Dev)

1. Cài extension **Live Server** trong VS Code.
2. Click chuột phải vào `index.html`.
3. Chọn **Open with Live Server** (Mặc định: `[http://127.0.0.1:5500](http://127.0.0.1:5500)`).

### Cách 2: Node.js (http-server)

```bash
# Cài đặt http-server (chạy 1 lần)
npm install -g http-server

# Chạy server trong thư mục dự án
http-server -p 8080

```

### Cách 3: Python

```bash
# Chạy server nội bộ của Python
python -m http.server 8080

```

---

## 📖 Hướng dẫn sử dụng chi tiết

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
| ---------- | -------------------------- | --------------------- |
| `Ctrl + L` | Lấy vị trí GPS             | Test Geolocation API  |
| `Ctrl + S` | Lưu dữ liệu (LocalStorage) | Test Data Persistence |
| `Ctrl + E` | Xuất/In báo cáo            | Test Export Module    |
| `D`        | Bật/tắt Dark Mode          | Test UI Theme Toggle  |
| `Esc`      | Đóng modal/popup           | Test Modal Dismissal  |

---

## 🛠️ Công nghệ sử dụng

### Lõi Ứng dụng & WebGIS

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

---

## 📁 Cấu trúc dự án

```
gps-survey-app/
├── index.html      # Trang chính (DOM tích hợp data-testid)
├── styles.css      # CSS styling (Responsive & Themes)
├── app.js          # Khởi tạo bản đồ, xử lý logic & DOM manipulation
└── README.md       # Tài liệu dự án (Test-Ready Specs)

```

---

## 💾 Lưu trữ dữ liệu

Dữ liệu mô phỏng việc gọi API bằng cách lưu tạm trong **LocalStorage** của trình duyệt:

- `its-survey-points`: Danh sách điểm khảo sát (Array of Objects).
- `its-trip-history`: Lịch sử hành trình.
- `its-dark-mode`: Trạng thái Theme (Boolean).

_QA Note: Trong quá trình viết Automation Test (Cypress/Selenium), cần dùng lệnh `localStorage.clear()` ở hook `beforeEach` để đảm bảo test runner được làm sạch (clean state)._

---

## 📄 License

MIT License © 2026 - ITS Survey Team.
