// ==========================================
// ITS Survey Application - Intelligent Transportation System
// Version: 5.0 - Tích hợp API Backend & Auth
// ==========================================

let map;
let currentLocationMarker;
let currentLocationCircle;
let surveyMarkers = [];
let surveyPoints = [];
let currentPosition = null;
let watchId = null;

let isTracking = false;
let trackingPath = null;
let trackingPoints = [];
let trackingStartTime = null;
let trackingTimer = null;
let maxSpeed = 0;
let tripHistory = [];

let isMeasuring = false;
let measurePoints = [];
let measureLine = null;
let measureMarkers = [];

let categoryChart = null;
let trafficChart = null;

let markerClusterGroup = null;
let heatmapLayer = null;
let routingControl = null;
let miniMap = null;
let notyf = null;
let isClusterMode = false;
let isHeatmapMode = false;
let isDarkMode = false;

const categoryConfig = {
  intersection: { icon: "fa-road", color: "#607d8b", label: "Nút giao thông" },
  "traffic-light": {
    icon: "fa-traffic-light",
    color: "#4caf50",
    label: "Đèn tín hiệu",
  },
  camera: { icon: "fa-video", color: "#2196f3", label: "Camera giám sát" },
  sensor: { icon: "fa-microchip", color: "#9c27b0", label: "Cảm biến" },
  vms: { icon: "fa-desktop", color: "#00bcd4", label: "Biển báo điện tử" },
  "bus-stop": { icon: "fa-bus", color: "#673ab7", label: "Trạm xe buýt" },
  parking: { icon: "fa-parking", color: "#3f51b5", label: "Bãi đỗ xe" },
  station: { icon: "fa-building", color: "#795548", label: "Nhà ga/Bến xe" },
  congestion: { icon: "fa-car-crash", color: "#f44336", label: "Điểm ùn tắc" },
  accident: {
    icon: "fa-exclamation-triangle",
    color: "#ff9800",
    label: "Điểm tai nạn",
  },
  roadwork: { icon: "fa-hard-hat", color: "#ff5722", label: "Công trình" },
  toll: { icon: "fa-money-bill", color: "#8bc34a", label: "Trạm thu phí" },
  fuel: { icon: "fa-gas-pump", color: "#e91e63", label: "Trạm xăng" },
  other: { icon: "fa-map-pin", color: "#9e9e9e", label: "Khác" },
};

const trafficFlowConfig = {
  low: { color: "#4caf50", label: "Thấp" },
  medium: { color: "#ffeb3b", label: "Trung bình" },
  high: { color: "#ff9800", label: "Cao" },
  congested: { color: "#f44336", label: "Ùn tắc" },
};

function initApp() {
  setTimeout(hideLoadingScreen, 500);

  try {
    initLibraries();
  } catch (e) {
    console.warn("Libraries init warning:", e);
  }

  setTimeout(() => {
    try {
      initMap();
      initEventListeners();
      initTabs();
      loadData();
      getCurrentLocation();
      updateCharts();
      initTooltips();
      initAOS();
      initKeyboardShortcuts();
      loadPreferences();

      showWelcomeNotification();
    } catch (e) {
      console.error("App init error:", e);
    }
  }, 100);
}

function initLibraries() {
  if (typeof Notyf !== "undefined") {
    notyf = new Notyf({
      duration: 3000,
      position: { x: "right", y: "top" },
      types: [
        {
          type: "success",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          icon: { className: "fas fa-check-circle", tagName: "i" },
        },
        {
          type: "error",
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          icon: { className: "fas fa-times-circle", tagName: "i" },
        },
        {
          type: "warning",
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          icon: { className: "fas fa-exclamation-triangle", tagName: "i" },
        },
        {
          type: "info",
          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          icon: { className: "fas fa-info-circle", tagName: "i" },
        },
      ],
    });
  }

  if (typeof dayjs !== "undefined") {
    dayjs.locale("vi");
    dayjs.extend(dayjs_plugin_relativeTime);
  }
}

function initTooltips() {
  if (typeof tippy !== "undefined") {
    tippy("[data-tippy-content]", {
      theme: "light-border",
      animation: "scale",
      duration: [200, 150],
      arrow: true,
      placement: "bottom",
    });
  }
}

function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }
}

function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveData();
      showToast("Đã lưu dữ liệu!", "success");
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "e") {
      e.preventDefault();
      generateReport();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "l") {
      e.preventDefault();
      getCurrentLocation();
    }
    if (e.key === "Escape") {
      closeModal();
    }
    if (
      e.key === "d" &&
      !e.ctrlKey &&
      !e.metaKey &&
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "TEXTAREA"
    ) {
      toggleDarkMode();
    }
  });
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen) {
    loadingScreen.style.transition = "opacity 0.5s ease";
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
      loadingScreen.remove();
    }, 500);
  }
}

function showWelcomeNotification() {
  if (notyf)
    notyf.success({
      message: "🚀 ITS Survey sẵn sàng! Nhấn D để đổi theme",
      duration: 4000,
    });
}

function initMap() {
  const defaultLocation = [21.0285, 105.8542];
  map = L.map("map", {
    center: defaultLocation,
    zoom: 15,
    zoomControl: false,
    attributionControl: false,
  });

  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.control
    .attribution({ position: "bottomleft", prefix: false })
    .addAttribution('&copy; <a href="https://openstreetmap.org">OSM</a>')
    .addTo(map);

  const osmLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { maxZoom: 19 },
  ).addTo(map);
  const esriStreet = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 19 },
  );
  const esriDark = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 16 },
  );
  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 19 },
  );
  const topoLayer = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    { maxZoom: 17 },
  );

  const baseMaps = {
    "🗺️ OpenStreetMap": osmLayer,
    "🎨 Esri Street": esriStreet,
    "🌙 Esri Dark": esriDark,
    "🛰️ Vệ tinh": satelliteLayer,
    "⛰️ Địa hình": topoLayer,
  };

  L.control.layers(baseMaps, null, { position: "topright" }).addTo(map);
  L.control
    .scale({ metric: true, imperial: false, position: "bottomleft" })
    .addTo(map);

  markerClusterGroup = L.markerClusterGroup({
    chunkedLoading: true,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    maxClusterRadius: 50,
    iconCreateFunction: function (cluster) {
      const count = cluster.getChildCount();
      let size = count > 50 ? "large" : count > 10 ? "medium" : "small";
      return L.divIcon({
        html: `<div class="cluster-marker cluster-${size}"><span>${count}</span></div>`,
        className: "marker-cluster-custom",
        iconSize: L.point(40, 40),
      });
    },
  });

  initMiniMap(osmLayer);
  if (L.control.fullscreen)
    L.control.fullscreen({ position: "topright" }).addTo(map);
  initGeocoder();
  map.on("click", handleMapClick);
  initMapMouseInteractions();
}

function initMiniMap(baseLayer) {
  if (L.Control.MiniMap) {
    const miniMapLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { maxZoom: 19 },
    );
    miniMap = new L.Control.MiniMap(miniMapLayer, {
      toggleDisplay: true,
      minimized: true,
      position: "bottomright",
      width: 150,
      height: 150,
    }).addTo(map);
  }
}

function initGeocoder() {
  if (L.Control.Geocoder) {
    const geocoder = L.Control.Geocoder.nominatim({
      geocodingQueryParams: { countrycodes: "vn", "accept-language": "vi" },
    });
    const searchInput = document.getElementById("searchInput");
    let searchTimeout;

    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      if (query.length > 2) {
        searchTimeout = setTimeout(() => {
          geocoder.geocode(query, (results) => {
            if (results && results.length > 0) {
              map.setView(results[0].center, 16);
              L.popup()
                .setLatLng(results[0].center)
                .setContent(`<strong>📍 ${results[0].name}</strong>`)
                .openOn(map);
              showToast(`Đã tìm thấy: ${results[0].name}`, "success");
            }
          });
        }, 500);
      }
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          geocoder.geocode(query, (results) => {
            if (results && results.length > 0) {
              map.setView(results[0].center, 16);
              showToast(`Đã tìm thấy: ${results[0].name}`, "success");
            } else {
              showToast("Không tìm thấy địa điểm", "warning");
            }
          });
        }
      }
    });
  }
}

function initMapMouseInteractions() {
  const mapElement = document.getElementById("map");
  const coordsDisplay = document.createElement("div");
  coordsDisplay.className = "map-coords";
  coordsDisplay.innerHTML = `
        <span><i class="fas fa-crosshairs"></i> <span id="hover-lat">--</span></span>
        <span><i class="fas fa-location-dot"></i> <span id="hover-lng">--</span></span>
        <span><i class="fas fa-mountain"></i> Zoom: <span id="hover-zoom">--</span></span>
    `;
  document.querySelector(".map-section").appendChild(coordsDisplay);

  map.on("mousemove", function (e) {
    document.getElementById("hover-lat").textContent = e.latlng.lat.toFixed(6);
    document.getElementById("hover-lng").textContent = e.latlng.lng.toFixed(6);
    document.getElementById("hover-zoom").textContent = map.getZoom();
    coordsDisplay.classList.add("visible");
  });

  map.on("mouseout", () => coordsDisplay.classList.remove("visible"));
  map.on("click", (e) =>
    createClickRipple(e.containerPoint.x, e.containerPoint.y),
  );
  map.on("dragstart", () => mapElement.classList.add("grabbing"));
  map.on("dragend", () => mapElement.classList.remove("grabbing"));
  map.on(
    "zoomstart",
    () => (mapElement.style.transition = "transform 0.3s ease-out"),
  );
  map.on("zoomend", () => {
    document.getElementById("hover-zoom").textContent = map.getZoom();
    const zoomSpan = document.getElementById("hover-zoom");
    zoomSpan.style.transform = "scale(1.2)";
    zoomSpan.style.color = "#10b981";
    setTimeout(() => {
      zoomSpan.style.transform = "scale(1)";
      zoomSpan.style.color = "";
    }, 200);
  });
}

function createClickRipple(x, y) {
  const mapSection = document.querySelector(".map-section");
  const ripple = document.createElement("div");
  ripple.className = "click-ripple";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  mapSection.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function initEventListeners() {
  document
    .getElementById("btnGetLocation")
    .addEventListener("click", getCurrentLocation);
  document
    .getElementById("btnDrawRoute")
    .addEventListener("click", toggleDrawRoute);
  document
    .getElementById("btnMeasureDistance")
    .addEventListener("click", toggleMeasure);
  document
    .getElementById("btnHeatmap")
    .addEventListener("click", toggleHeatmap);
  document
    .getElementById("btnCluster")
    .addEventListener("click", toggleClusterMode);
  document.getElementById("btnWeather").addEventListener("click", getWeather);
  document
    .getElementById("btnClearAll")
    .addEventListener("click", confirmClearAllData);

  document
    .getElementById("btnThemeToggle")
    .addEventListener("click", toggleDarkMode);
  document
    .getElementById("btnFullscreen")
    .addEventListener("click", toggleFullscreen);
  document
    .getElementById("btnSettings")
    .addEventListener("click", openSettings);
  document
    .getElementById("btnVoiceSearch")
    .addEventListener("click", startVoiceSearch);

  document.getElementById("btnAddMarker").addEventListener("click", () => {
    if (currentPosition) {
      document.getElementById("pointName").focus();
      showToast("Điền thông tin và lưu điểm khảo sát", "info");
      if (typeof gsap !== "undefined")
        gsap.from("#surveyForm", {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        });
    } else {
      showToast("Vui lòng lấy vị trí trước!", "warning");
    }
  });

  document
    .getElementById("btnExportReport")
    .addEventListener("click", generateReport);
  document
    .getElementById("surveyForm")
    .addEventListener("submit", handleAddSurveyPoint);
  document
    .getElementById("filterCategory")
    .addEventListener("change", filterSurveyPoints);

  document
    .getElementById("btnStartTracking")
    .addEventListener("click", startTracking);
  document
    .getElementById("btnStopTracking")
    .addEventListener("click", stopTracking);
  document
    .getElementById("closeMeasure")
    .addEventListener("click", toggleMeasure);

  document
    .getElementById("btnExportJSON")
    .addEventListener("click", exportJSON);
  document.getElementById("btnExportCSV").addEventListener("click", exportCSV);
  document
    .getElementById("btnExportGeoJSON")
    .addEventListener("click", exportGeoJSON);
  document.getElementById("btnExportKML").addEventListener("click", exportKML);

  document.getElementById("closeModal").addEventListener("click", closeModal);
  document
    .getElementById("btnPrintReport")
    .addEventListener("click", printReport);
  document
    .querySelector(".weather-close")
    ?.addEventListener("click", () =>
      document.getElementById("weatherWidget").classList.add("hidden"),
    );
}

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute(
    "data-theme",
    isDarkMode ? "dark" : "light",
  );
  document.querySelector("#btnThemeToggle i").className = isDarkMode
    ? "fas fa-sun"
    : "fas fa-moon";
  showToast(isDarkMode ? "🌙 Chế độ tối" : "☀️ Chế độ sáng", "info");
  localStorage.setItem("its-dark-mode", isDarkMode);
  if (typeof gsap !== "undefined")
    gsap.from("body", { opacity: 0.8, duration: 0.3, ease: "power2.out" });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    showToast("Đã bật toàn màn hình", "info");
  } else {
    document.exitFullscreen();
    showToast("Đã tắt toàn màn hình", "info");
  }
}

function startVoiceSearch() {
  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    showToast("Trình duyệt không hỗ trợ tìm kiếm giọng nói", "warning");
    return;
  }
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "vi-VN";
  recognition.continuous = false;
  recognition.interimResults = false;

  const voiceBtn = document.getElementById("btnVoiceSearch");
  voiceBtn.classList.add("recording");
  voiceBtn.innerHTML = '<i class="fas fa-microphone-alt fa-beat"></i>';
  showToast("🎤 Đang nghe...", "info");

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    document.getElementById("searchInput").value = transcript;
    document.getElementById("searchInput").dispatchEvent(new Event("input"));
    showToast(`Đã nhận: "${transcript}"`, "success");
  };
  recognition.onerror = () =>
    showToast("Không thể nhận diện giọng nói", "error");
  recognition.onend = () => {
    voiceBtn.classList.remove("recording");
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
  };
  recognition.start();
}

async function getWeather() {
  if (!currentPosition) {
    showToast("Vui lòng lấy vị trí trước!", "warning");
    return;
  }
  const widget = document.getElementById("weatherWidget");
  widget.classList.remove("hidden");
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${currentPosition.lat}&longitude=${currentPosition.lng}&current_weather=true&timezone=Asia/Ho_Chi_Minh`,
    );
    const data = await response.json();
    if (data.current_weather) {
      const weather = data.current_weather;
      const temp = Math.round(weather.temperature);
      const weatherInfo = getWeatherInfo(weather.weathercode);
      document.querySelector(".weather-icon i").className =
        `fas ${weatherInfo.icon}`;
      document.querySelector(".weather-temp").textContent = `${temp}°C`;
      document.querySelector(".weather-desc").textContent = weatherInfo.desc;
      showToast(`Thời tiết: ${temp}°C - ${weatherInfo.desc}`, "success");
    }
  } catch (error) {
    showToast("Không thể lấy thông tin thời tiết", "error");
    widget.classList.add("hidden");
  }
}

function getWeatherInfo(code) {
  const weatherCodes = {
    0: { icon: "fa-sun", desc: "Trời quang" },
    1: { icon: "fa-sun", desc: "Chủ yếu quang" },
    2: { icon: "fa-cloud-sun", desc: "Có mây rải rác" },
    3: { icon: "fa-cloud", desc: "Nhiều mây" },
    45: { icon: "fa-smog", desc: "Sương mù" },
    48: { icon: "fa-smog", desc: "Sương mù đóng băng" },
    51: { icon: "fa-cloud-rain", desc: "Mưa phùn nhẹ" },
    53: { icon: "fa-cloud-rain", desc: "Mưa phùn" },
    61: { icon: "fa-cloud-showers-heavy", desc: "Mưa nhỏ" },
    65: { icon: "fa-cloud-showers-heavy", desc: "Mưa to" },
    95: { icon: "fa-bolt", desc: "Giông bão" },
  };
  return weatherCodes[code] || { icon: "fa-question", desc: "Không xác định" };
}

function openSettings() {
  Swal.fire({
    title: "⚙️ Cài đặt",
    html: `<div style="text-align: left; padding: 10px;">
                <div style="margin-bottom: 15px;"><label><input type="checkbox" id="settingAutoSave" checked> Tự động lưu dữ liệu</label></div>
                <div style="margin-bottom: 15px;"><label><input type="checkbox" id="settingHighAccuracy" checked> GPS độ chính xác cao</label></div>
                <div style="margin-bottom: 15px;"><select id="settingUnit" style="width: 100%; padding: 8px;"><option value="metric">Mét / Km</option></select></div>
               </div>`,
    showCancelButton: true,
    confirmButtonText: "Lưu",
    confirmButtonColor: "#0ea5e9",
  }).then((res) => {
    if (res.isConfirmed) showToast("Đã lưu cài đặt", "success");
  });
}

function confirmClearAllData() {
  Swal.fire({
    title: "⚠️ Xác nhận xóa",
    text: "Xóa TẤT CẢ dữ liệu khảo sát?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Xóa tất cả",
  }).then((result) => {
    if (result.isConfirmed) {
      clearAllData();
      Swal.fire({
        title: "Đã xóa!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
}

function initTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.dataset.tab;
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
      document.getElementById(`tab-${tabId}`).classList.add("active");
      if (tabId === "analysis") updateCharts();
    });
  });
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    showToast("Trình duyệt không hỗ trợ GPS!", "error");
    return;
  }
  updateStatus("Đang lấy vị trí GPS...");
  document.getElementById("gpsStatus").innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> GPS: Đang kết nối...';

  const options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };
  navigator.geolocation.getCurrentPosition(
    handleLocationSuccess,
    handleLocationError,
    options,
  );
  if (watchId) navigator.geolocation.clearWatch(watchId);
  watchId = navigator.geolocation.watchPosition(
    handleLocationSuccess,
    handleLocationError,
    options,
  );
}

function handleLocationSuccess(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;
  const speed = position.coords.speed;
  currentPosition = {
    lat,
    lng,
    accuracy,
    speed,
    altitude: position.coords.altitude,
  };

  document.getElementById("currentLat").textContent = lat.toFixed(6);
  document.getElementById("currentLng").textContent = lng.toFixed(6);
  document.getElementById("accuracy").textContent = accuracy
    ? `${accuracy.toFixed(1)} m`
    : "--";
  document.getElementById("speed").textContent = speed
    ? `${(speed * 3.6).toFixed(1)} km/h`
    : "0 km/h";

  document.getElementById("gpsStatus").innerHTML =
    '<i class="fas fa-satellite"></i> GPS: Đã kết nối';
  document.getElementById("gpsStatus").style.color = "#4caf50";

  updateCurrentLocationMarker(lat, lng, accuracy);
  map.setView([lat, lng], 16);

  if (isTracking) updateTracking(lat, lng, speed);
  updateStatus("Đã cập nhật vị trí GPS");
  updateLastUpdate();
}

function handleLocationError(error) {
  const messages = {
    1: "Bạn đã từ chối quyền truy cập vị trí",
    2: "Không thể xác định vị trí",
    3: "Hết thời gian chờ lấy vị trí",
  };
  const message = messages[error.code] || "Lỗi không xác định";
  showToast(message, "error");
  updateStatus(message);
  document.getElementById("gpsStatus").innerHTML =
    '<i class="fas fa-exclamation-triangle"></i> GPS: Lỗi';
  document.getElementById("gpsStatus").style.color = "#f44336";
}

function updateCurrentLocationMarker(lat, lng, accuracy) {
  if (currentLocationMarker) map.removeLayer(currentLocationMarker);
  if (currentLocationCircle) map.removeLayer(currentLocationCircle);

  const icon = L.divIcon({
    className: "current-location-marker",
    html: '<div class="pulse-marker"><div class="pulse-core"></div><div class="pulse-ring"></div></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
  currentLocationMarker = L.marker([lat, lng], {
    icon,
    zIndexOffset: 1000,
  }).addTo(map);
  currentLocationMarker.bindPopup("<b>📍 Vị trí của bạn</b>");

  if (accuracy) {
    currentLocationCircle = L.circle([lat, lng], {
      radius: Math.min(accuracy, 100),
      color: "#1a5f2a",
      fillColor: "#1a5f2a",
      fillOpacity: 0.1,
      weight: 2,
    }).addTo(map);
  }
}

function handleMapClick(e) {
  if (isMeasuring) {
    addMeasurePoint(e.latlng);
    return;
  }
  currentPosition = {
    lat: e.latlng.lat,
    lng: e.latlng.lng,
    accuracy: null,
    speed: null,
  };
  document.getElementById("currentLat").textContent =
    currentPosition.lat.toFixed(6);
  document.getElementById("currentLng").textContent =
    currentPosition.lng.toFixed(6);
  document.getElementById("accuracy").textContent = "--";
  showToast("Đã chọn vị trí. Điền thông tin để lưu điểm khảo sát.", "info");
}

async function handleAddSurveyPoint(event) {
  event.preventDefault();
  if (!currentPosition) {
    showToast("Vui lòng chọn vị trí trước!", "warning");
    return;
  }
  const name = document.getElementById("pointName").value.trim();
  if (!name) {
    showToast("Vui lòng nhập tên điểm!", "warning");
    return;
  }

  const surveyPoint = {
    name: name,
    category: document.getElementById("pointCategory").value,
    trafficFlow: document.getElementById("trafficFlow").value,
    roadCondition: document.getElementById("roadCondition").value,
    laneCount: parseInt(document.getElementById("laneCount").value) || 2,
    description: document.getElementById("pointDescription").value.trim(),
    lat: currentPosition.lat,
    lng: currentPosition.lng,
    accuracy: currentPosition.accuracy,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetchWithAuth("/surveys", {
      method: "POST",
      body: JSON.stringify(surveyPoint),
    });
    const savedPoint = await res.json();
    surveyPoints.push(savedPoint);
    addSurveyMarker(savedPoint);
    updateSurveyPointsList();
    updateStatistics();
    updateCharts();
    updateQuickStats();
    document.getElementById("surveyForm").reset();
    showToast(`Đã thêm: ${name}`, "success");
  } catch (e) {
    showToast("Lỗi lưu điểm khảo sát", "error");
  }
}

function createMarkerIcon(category) {
  const config = categoryConfig[category] || categoryConfig["other"];
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-pin" style="background-color: ${config.color};"><i class="fas ${config.icon}"></i></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
}

function addSurveyMarker(point) {
  const icon = createMarkerIcon(point.category);
  const marker = L.marker([point.lat, point.lng], { icon }).addTo(map);
  const config = categoryConfig[point.category] || categoryConfig["other"];
  const flowConfig = trafficFlowConfig[point.trafficFlow];

  const popupContent = `
        <div style="min-width: 220px;">
            <h3 style="margin: 0 0 8px 0; color: ${config.color};"><i class="fas ${config.icon}"></i> ${point.name}</h3>
            <div style="margin-bottom: 8px;">
                <span style="display: inline-block; padding: 2px 8px; background: ${config.color}; color: white; border-radius: 4px; font-size: 11px;">${config.label}</span>
                <span style="display: inline-block; padding: 2px 8px; background: ${flowConfig.color}; color: ${point.trafficFlow === "medium" ? "#333" : "white"}; border-radius: 4px; font-size: 11px; margin-left: 4px;">Mật độ: ${flowConfig.label}</span>
            </div>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${point.description || "Không có mô tả"}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 8px 0;">
            <p style="margin: 0; font-size: 11px; font-family: monospace; color: #888;">📍 ${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}<br>🛣️ ${point.laneCount} làn | 🕐 ${new Date(point.timestamp).toLocaleString("vi-VN")}</p>
        </div>`;
  marker.bindPopup(popupContent);
  surveyMarkers.push({ id: point.id, marker });
}

function updateSurveyPointsList() {
  const container = document.getElementById("surveyPointsList");
  const filterValue = document.getElementById("filterCategory").value;

  let filteredPoints =
    filterValue !== "all"
      ? surveyPoints.filter((p) => p.category === filterValue)
      : surveyPoints;
  document.getElementById("pointCount").textContent = filteredPoints.length;

  if (filteredPoints.length === 0) {
    container.innerHTML =
      '<p class="empty-message">Không có điểm khảo sát nào</p>';
    return;
  }

  let html = "";
  filteredPoints.forEach((point) => {
    const config = categoryConfig[point.category] || categoryConfig["other"];
    html += `
            <div class="survey-item ${point.category}" data-id="${point.id}" data-testid="survey-item-${point.id}">
                <div class="survey-item-icon" style="background: ${config.color};"><i class="fas ${config.icon}"></i></div>
                <div class="survey-item-content">
                    <div class="survey-item-name">${point.name}</div>
                    <div class="survey-item-meta">${config.label} | ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</div>
                </div>
                <div class="survey-item-actions">
                    <button class="btn-view" onclick="focusOnPoint(${point.id})" title="Xem" data-testid="btn-view-${point.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn-delete" onclick="deletePoint(${point.id})" title="Xóa" data-testid="btn-delete-${point.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
  });
  container.innerHTML = html;
}

function filterSurveyPoints() {
  updateSurveyPointsList();
}

function focusOnPoint(pointId) {
  const point = surveyPoints.find((p) => p.id === pointId);
  const markerObj = surveyMarkers.find((m) => m.id === pointId);
  if (point && markerObj) {
    map.setView([point.lat, point.lng], 18);
    markerObj.marker.openPopup();
  }
}

async function deletePoint(pointId) {
  if (!confirm("Xóa điểm khảo sát này?")) return;
  try {
    await fetchWithAuth(`/surveys/${pointId}`, { method: "DELETE" });
    const markerIndex = surveyMarkers.findIndex((m) => m.id === pointId);
    if (markerIndex !== -1) {
      map.removeLayer(surveyMarkers[markerIndex].marker);
      surveyMarkers.splice(markerIndex, 1);
    }
    surveyPoints = surveyPoints.filter((p) => p.id !== pointId);
    updateSurveyPointsList();
    updateStatistics();
    updateCharts();
    updateQuickStats();
    showToast("Đã xóa điểm khảo sát", "success");
  } catch (e) {
    showToast("Không thể xóa điểm này", "error");
  }
}

function startTracking() {
  isTracking = true;
  trackingPoints = [];
  trackingStartTime = Date.now();
  maxSpeed = 0;
  if (currentPosition)
    trackingPoints.push({
      lat: currentPosition.lat,
      lng: currentPosition.lng,
      time: Date.now(),
    });
  document.getElementById("btnStartTracking").classList.add("hidden");
  document.getElementById("btnStopTracking").classList.remove("hidden");
  trackingTimer = setInterval(updateTrackingTime, 1000);
  trackingPath = L.polyline([], {
    color: "#1a5f2a",
    weight: 4,
    opacity: 0.8,
  }).addTo(map);
  showToast("Bắt đầu ghi hành trình", "success");
}

function stopTracking() {
  isTracking = false;
  clearInterval(trackingTimer);
  document.getElementById("btnStartTracking").classList.remove("hidden");
  document.getElementById("btnStopTracking").classList.add("hidden");
  if (trackingPoints.length > 1) {
    tripHistory.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString("vi-VN"),
      distance: calculateTotalDistance(),
      duration: Date.now() - trackingStartTime,
      avgSpeed: calculateAvgSpeed(),
      maxSpeed: maxSpeed,
      points: [...trackingPoints],
    });
    saveData();
    updateTripHistory();
  }
  showToast("Đã dừng ghi hành trình", "info");
}

function updateTracking(lat, lng, speed) {
  trackingPoints.push({ lat, lng, time: Date.now() });
  if (speed && speed * 3.6 > maxSpeed) {
    maxSpeed = speed * 3.6;
    document.getElementById("trackMaxSpeed").textContent =
      maxSpeed.toFixed(1) + " km/h";
  }
  if (trackingPath) trackingPath.addLatLng([lat, lng]);
  document.getElementById("trackDistance").textContent = formatDistance(
    calculateTotalDistance(),
  );
  document.getElementById("trackAvgSpeed").textContent =
    calculateAvgSpeed().toFixed(1) + " km/h";
}

function updateTrackingTime() {
  document.getElementById("trackTime").textContent = formatDuration(
    Date.now() - trackingStartTime,
  );
}

function calculateTotalDistance() {
  let total = 0;
  for (let i = 1; i < trackingPoints.length; i++) {
    total += haversineDistance(
      trackingPoints[i - 1].lat,
      trackingPoints[i - 1].lng,
      trackingPoints[i].lat,
      trackingPoints[i].lng,
    );
  }
  return total;
}

function calculateAvgSpeed() {
  const distance = calculateTotalDistance();
  const duration = (Date.now() - trackingStartTime) / 3600000;
  return duration > 0 ? distance / duration : 0;
}

function updateTripHistory() {
  const container = document.getElementById("tripHistory");
  if (tripHistory.length === 0) {
    container.innerHTML = '<p class="empty-message">Chưa có hành trình nào</p>';
    return;
  }

  let html = "";
  tripHistory.slice(0, 5).forEach((trip) => {
    html += `
        <div class="trip-item" data-testid="trip-item-${trip.id}">
            <div class="trip-item-header"><span>${trip.date}</span><span>${formatDuration(trip.duration)}</span></div>
            <div class="trip-item-stats">
                <span><i class="fas fa-road"></i> ${formatDistance(trip.distance)}</span>
                <span><i class="fas fa-tachometer-alt"></i> ${trip.avgSpeed.toFixed(1)} km/h</span>
            </div>
        </div>`;
  });
  container.innerHTML = html;
}

function toggleMeasure() {
  isMeasuring = !isMeasuring;
  document
    .getElementById("btnMeasureDistance")
    .classList.toggle("active", isMeasuring);
  document
    .getElementById("measurePanel")
    .classList.toggle("hidden", !isMeasuring);
  if (!isMeasuring) clearMeasurement();
  else showToast("Click trên bản đồ để đo khoảng cách", "info");
}

function addMeasurePoint(latlng) {
  measurePoints.push(latlng);
  measureMarkers.push(
    L.circleMarker(latlng, {
      radius: 6,
      fillColor: "#1a5f2a",
      color: "white",
      weight: 2,
      fillOpacity: 1,
    }).addTo(map),
  );
  if (measurePoints.length > 1) {
    if (measureLine) map.removeLayer(measureLine);
    measureLine = L.polyline(measurePoints, {
      color: "#1a5f2a",
      weight: 3,
      dashArray: "10, 10",
    }).addTo(map);
    const totalDist = measurePoints.reduce(
      (acc, p, i) =>
        i === 0
          ? 0
          : acc +
            haversineDistance(
              measurePoints[i - 1].lat,
              measurePoints[i - 1].lng,
              p.lat,
              p.lng,
            ),
      0,
    );
    document.getElementById("measureText").textContent =
      `Khoảng cách: ${formatDistance(totalDist * 1000)}`;
  }
}

function clearMeasurement() {
  measurePoints = [];
  measureMarkers.forEach((m) => map.removeLayer(m));
  measureMarkers = [];
  if (measureLine) {
    map.removeLayer(measureLine);
    measureLine = null;
  }
  document.getElementById("measureText").textContent = "Khoảng cách: 0 m";
}

function toggleDrawRoute() {
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
    showToast("Đã tắt vẽ tuyến đường", "info");
    return;
  }
  if (!currentPosition) {
    showToast("Vui lòng lấy vị trí trước!", "warning");
    return;
  }
  if (L.Routing && L.Routing.control) {
    routingControl = L.Routing.control({
      waypoints: [L.latLng(currentPosition.lat, currentPosition.lng)],
      routeWhileDragging: true,
      showAlternatives: true,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [
          { color: "#0ea5e9", opacity: 0.8, weight: 6 },
          { color: "#38bdf8", opacity: 0.5, weight: 8 },
        ],
      },
      createMarker: (i, wp) =>
        L.marker(wp.latLng, {
          draggable: true,
          icon: L.divIcon({
            className: "route-marker",
            html: `<div class="route-marker-icon">${i === 0 ? "🚀" : "🏁"}</div>`,
            iconSize: [30, 30],
          }),
        }),
    }).addTo(map);
    showToast("Click trên bản đồ để thêm điểm đến", "info");
    routingControl.on("routesfound", (e) =>
      showToast(
        `📍 ${(e.routes[0].summary.totalDistance / 1000).toFixed(2)} km - ⏱️ ${Math.round(e.routes[0].summary.totalTime / 60)} phút`,
        "success",
      ),
    );
  } else {
    showToast("Tính năng vẽ tuyến đường chưa sẵn sàng", "warning");
  }
}

function toggleHeatmap() {
  if (!L.heatLayer) {
    showToast("Thư viện heatmap chưa được tải", "warning");
    return;
  }
  isHeatmapMode = !isHeatmapMode;
  document
    .getElementById("btnHeatmap")
    .classList.toggle("active", isHeatmapMode);
  if (isHeatmapMode) {
    const heatData = surveyPoints.map((p) => [
      p.lat,
      p.lng,
      { low: 0.3, medium: 0.5, high: 0.7, congested: 1.0 }[p.trafficFlow] ||
        0.5,
    ]);
    if (heatData.length > 0) {
      heatmapLayer = L.heatLayer(heatData, {
        radius: 30,
        blur: 20,
        maxZoom: 17,
        gradient: {
          0.2: "#22c55e",
          0.4: "#eab308",
          0.6: "#f97316",
          0.8: "#ef4444",
          1.0: "#dc2626",
        },
      }).addTo(map);
      showToast("🔥 Bản đồ nhiệt đã bật", "success");
    } else {
      showToast("Chưa có dữ liệu để hiển thị heatmap", "warning");
      isHeatmapMode = false;
      document.getElementById("btnHeatmap").classList.remove("active");
    }
  } else {
    if (heatmapLayer) {
      map.removeLayer(heatmapLayer);
      heatmapLayer = null;
    }
    showToast("Đã tắt bản đồ nhiệt", "info");
  }
}

function toggleClusterMode() {
  isClusterMode = !isClusterMode;
  document
    .getElementById("btnCluster")
    .classList.toggle("active", isClusterMode);
  if (isClusterMode) {
    surveyMarkers.forEach((m) => {
      markerClusterGroup.addLayer(m.marker);
      map.removeLayer(m.marker);
    });
    map.addLayer(markerClusterGroup);
    showToast("📍 Đã bật chế độ gom nhóm", "success");
  } else {
    map.removeLayer(markerClusterGroup);
    markerClusterGroup.clearLayers();
    surveyMarkers.forEach((m) => map.addLayer(m.marker));
    showToast("Đã tắt chế độ gom nhóm", "info");
  }
}

function clearAllData() {
  surveyMarkers.forEach((m) => map.removeLayer(m.marker));
  surveyMarkers = [];
  surveyPoints = [];
  tripHistory = [];
  if (markerClusterGroup) markerClusterGroup.clearLayers();
  if (heatmapLayer) {
    map.removeLayer(heatmapLayer);
    heatmapLayer = null;
    isHeatmapMode = false;
    document.getElementById("btnHeatmap").classList.remove("active");
  }
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
  }
  clearMeasurement();
  if (trackingPath) map.removeLayer(trackingPath);
  saveData();
  updateSurveyPointsList();
  updateStatistics();
  updateCharts();
  updateTripHistory();
  updateQuickStats();
  showToast("Đã xóa tất cả dữ liệu", "success");
}

function updateQuickStats() {
  document.getElementById("quickTotalPoints").textContent = surveyPoints.length;
  document.getElementById("quickCongestion").textContent = surveyPoints.filter(
    (p) => p.category === "congestion",
  ).length;
  if (currentPosition && currentPosition.accuracy)
    document.getElementById("quickAccuracy").textContent =
      `${currentPosition.accuracy.toFixed(0)}m`;
}

function updateStatistics() {
  document.getElementById("totalPoints").textContent = surveyPoints.length;
  document.getElementById("congestionPoints").textContent = surveyPoints.filter(
    (p) => p.category === "congestion",
  ).length;
  document.getElementById("accidentPoints").textContent = surveyPoints.filter(
    (p) => p.category === "accident",
  ).length;
  let totalDist = 0;
  for (let i = 1; i < surveyPoints.length; i++)
    totalDist += haversineDistance(
      surveyPoints[i - 1].lat,
      surveyPoints[i - 1].lng,
      surveyPoints[i].lat,
      surveyPoints[i].lng,
    );
  document.getElementById("totalDistance").textContent = totalDist.toFixed(2);
}

function updateCharts() {
  const ctxCat = document.getElementById("categoryChart");
  const ctxTraf = document.getElementById("trafficChart");
  if (!ctxCat || !ctxTraf) return;

  const categoryCounts = {};
  const flowCounts = { low: 0, medium: 0, high: 0, congested: 0 };
  surveyPoints.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    if (flowCounts.hasOwnProperty(p.trafficFlow)) flowCounts[p.trafficFlow]++;
  });

  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(ctxCat, {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryCounts).map(
        (k) => categoryConfig[k]?.label || k,
      ),
      datasets: [
        {
          data: Object.values(categoryCounts),
          backgroundColor: Object.keys(categoryCounts).map(
            (k) => categoryConfig[k]?.color || "#999",
          ),
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 11 } } },
      },
    },
  });

  if (trafficChart) trafficChart.destroy();
  trafficChart = new Chart(ctxTraf, {
    type: "bar",
    data: {
      labels: ["Thấp", "Trung bình", "Cao", "Ùn tắc"],
      datasets: [
        {
          label: "Số điểm",
          data: Object.values(flowCounts),
          backgroundColor: ["#4caf50", "#ffeb3b", "#ff9800", "#f44336"],
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    },
  });
}

function exportJSON() {
  if (surveyPoints.length === 0)
    return showToast("Không có dữ liệu để xuất!", "warning");
  const data = {
    exportDate: new Date().toISOString(),
    appName: "ITS Survey Application",
    totalPoints: surveyPoints.length,
    points: surveyPoints,
    tripHistory: tripHistory,
  };
  downloadFile(
    JSON.stringify(data, null, 2),
    `its-survey-${getDateString()}.json`,
    "application/json",
  );
  showToast("Đã xuất file JSON", "success");
}

function exportCSV() {
  if (surveyPoints.length === 0)
    return showToast("Không có dữ liệu để xuất!", "warning");
  const headers = [
    "ID",
    "Tên",
    "Loại",
    "Mật độ giao thông",
    "Tình trạng đường",
    "Số làn",
    "Vĩ độ",
    "Kinh độ",
    "Mô tả",
    "Thời gian",
  ];
  const rows = surveyPoints.map((p) => [
    p.id,
    `"${p.name}"`,
    categoryConfig[p.category]?.label || p.category,
    trafficFlowConfig[p.trafficFlow]?.label || p.trafficFlow,
    p.roadCondition,
    p.laneCount,
    p.lat,
    p.lng,
    `"${p.description || ""}"`,
    p.timestamp,
  ]);
  const csv =
    "\ufeff" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadFile(
    csv,
    `its-survey-${getDateString()}.csv`,
    "text/csv;charset=utf-8",
  );
  showToast("Đã xuất file CSV", "success");
}

function exportGeoJSON() {
  if (surveyPoints.length === 0)
    return showToast("Không có dữ liệu để xuất!", "warning");
  const geojson = {
    type: "FeatureCollection",
    features: surveyPoints.map((p) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        name: p.name,
        category: p.category,
        categoryLabel: categoryConfig[p.category]?.label,
        trafficFlow: p.trafficFlow,
        roadCondition: p.roadCondition,
        laneCount: p.laneCount,
        description: p.description,
        timestamp: p.timestamp,
      },
    })),
  };
  downloadFile(
    JSON.stringify(geojson, null, 2),
    `its-survey-${getDateString()}.geojson`,
    "application/geo+json",
  );
  showToast("Đã xuất file GeoJSON", "success");
}

function exportKML() {
  if (surveyPoints.length === 0)
    return showToast("Không có dữ liệu để xuất!", "warning");
  let kml = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n<name>ITS Survey Data</name>\n<description>Dữ liệu khảo sát giao thông thông minh - ${new Date().toLocaleString("vi-VN")}</description>\n`;
  surveyPoints.forEach((p) => {
    const config = categoryConfig[p.category] || categoryConfig["other"];
    kml += `<Placemark><name>${p.name}</name><description><![CDATA[<b>Loại:</b> ${config.label}<br><b>Mật độ:</b> ${trafficFlowConfig[p.trafficFlow]?.label}<br><b>Số làn:</b> ${p.laneCount}<br><b>Mô tả:</b> ${p.description || "Không có"}<br><b>Thời gian:</b> ${new Date(p.timestamp).toLocaleString("vi-VN")}]]></description><Point><coordinates>${p.lng},${p.lat},0</coordinates></Point></Placemark>`;
  });
  kml += `\n</Document>\n</kml>`;
  downloadFile(
    kml,
    `its-survey-${getDateString()}.kml`,
    "application/vnd.google-earth.kml+xml",
  );
  showToast("Đã xuất file KML", "success");
}

function generateReport() {
  const modal = document.getElementById("reportModal");
  const content = document.getElementById("reportContent");
  const categoryCounts = {};
  const flowCounts = { low: 0, medium: 0, high: 0, congested: 0 };

  surveyPoints.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    if (flowCounts.hasOwnProperty(p.trafficFlow)) flowCounts[p.trafficFlow]++;
  });

  let categoryHtml = "";
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    categoryHtml += `<tr><td><span style="color: ${categoryConfig[cat]?.color || "#666"}">●</span> ${categoryConfig[cat]?.label || cat}</td><td>${count}</td></tr>`;
  });

  let pointsHtml = "";
  surveyPoints.forEach((p, i) => {
    pointsHtml += `<tr><td>${i + 1}</td><td>${p.name}</td><td>${categoryConfig[p.category]?.label || p.category}</td><td>${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}</td><td>${trafficFlowConfig[p.trafficFlow]?.label || p.trafficFlow}</td></tr>`;
  });

  content.innerHTML = `
        <div class="report-section">
            <h3>📊 Thông tin chung</h3>
            <table class="report-table">
                <tr><th>Ngày xuất báo cáo</th><td>${new Date().toLocaleString("vi-VN")}</td></tr>
                <tr><th>Tổng số điểm khảo sát</th><td>${surveyPoints.length}</td></tr>
                <tr><th>Điểm ùn tắc</th><td>${surveyPoints.filter((p) => p.category === "congestion").length}</td></tr>
                <tr><th>Điểm nguy hiểm</th><td>${surveyPoints.filter((p) => p.category === "accident").length}</td></tr>
            </table>
        </div>
        <div class="report-section">
            <h3>🚦 Phân loại hạ tầng</h3>
            <table class="report-table">
                <tr><th>Loại</th><th>Số lượng</th></tr>
                ${categoryHtml}
            </table>
        </div>
        <div class="report-section">
            <h3>🚗 Mật độ giao thông</h3>
            <table class="report-table">
                <tr><th>Mức độ</th><th>Số điểm</th></tr>
                <tr><td><span style="color: #4caf50">●</span> Thấp</td><td>${flowCounts.low}</td></tr>
                <tr><td><span style="color: #ffeb3b">●</span> Trung bình</td><td>${flowCounts.medium}</td></tr>
                <tr><td><span style="color: #ff9800">●</span> Cao</td><td>${flowCounts.high}</td></tr>
                <tr><td><span style="color: #f44336">●</span> Ùn tắc</td><td>${flowCounts.congested}</td></tr>
            </table>
        </div>
        <div class="report-section">
            <h3>📍 Chi tiết các điểm khảo sát</h3>
            <table class="report-table">
                <tr><th>STT</th><th>Tên</th><th>Loại</th><th>Vị trí</th><th>Mật độ</th></tr>
                ${pointsHtml}
            </table>
        </div>
    `;
  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("reportModal").classList.add("hidden");
}
function printReport() {
  window.print();
}
function saveData() {
  localStorage.setItem("its-trip-history", JSON.stringify(tripHistory));
}

async function loadData() {
  try {
    const response = await fetchWithAuth("/surveys?page=1&limit=100");
    const result = await response.json();

    surveyPoints = result.data;
    surveyPoints.forEach((point) => addSurveyMarker(point));
    updateSurveyPointsList();
    updateStatistics();
    updateCharts();
    updateQuickStats();

    const savedTrips = localStorage.getItem("its-trip-history");
    if (savedTrips) {
      tripHistory = JSON.parse(savedTrips);
      updateTripHistory();
    }
  } catch (error) {
    console.error(error);
    showToast("Lỗi lấy dữ liệu từ máy chủ", "error");
  }
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371,
    dLat = toRad(lat2 - lat1),
    dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}
function formatDistance(meters) {
  return meters < 1000
    ? Math.round(meters) + " m"
    : (meters / 1000).toFixed(2) + " km";
}
function formatDuration(ms) {
  const s = Math.floor(ms / 1000) % 60,
    m = Math.floor(ms / 60000) % 60,
    h = Math.floor(ms / 3600000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
function getDateString() {
  return new Date().toISOString().split("T")[0];
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function showToast(message, type = "info") {
  if (notyf) {
    if (type === "success") {
      notyf.success(message);
    } else if (type === "error") {
      notyf.error(message);
    } else if (type === "warning") {
      notyf.open({ type: "warning", message: message });
    } else {
      notyf.open({ type: "info", message: message });
    }
  } else {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => (toast.className = "toast"), 3000);
  }
}

function updateStatus(message) {
  const statusEl = document.getElementById("statusMessage");
  statusEl.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
  if (typeof gsap !== "undefined")
    gsap.from(statusEl, {
      x: -10,
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });
}

function updateLastUpdate() {
  const timeText =
    typeof dayjs !== "undefined"
      ? dayjs().format("HH:mm:ss")
      : new Date().toLocaleTimeString("vi-VN");
  document.getElementById("lastUpdate").textContent = `Cập nhật: ${timeText}`;
}

function loadPreferences() {
  if (localStorage.getItem("its-dark-mode") === "true") {
    isDarkMode = true;
    document.documentElement.setAttribute("data-theme", "dark");
    document.querySelector("#btnThemeToggle i").className = "fas fa-sun";
  }
}
