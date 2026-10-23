document.addEventListener("DOMContentLoaded", () => {
  checkAuthAndInit();
});

function checkAuthAndInit() {
  const token = localStorage.getItem("its_token");
  if (token) {
    const loginScreen = document.getElementById("login-screen");
    const appContainer = document.querySelector(".app-container");
    if (loginScreen) loginScreen.style.display = "none";
    if (appContainer) appContainer.style.display = "flex";
    if (typeof initApp === "function") initApp();
  } else {
    const loginScreen = document.getElementById("login-screen");
    const appContainer = document.querySelector(".app-container");
    if (loginScreen) loginScreen.style.display = "flex";
    if (appContainer) appContainer.style.display = "none";

    const loading = document.getElementById("loadingScreen");
    if (loading) {
      loading.style.opacity = "0";
      setTimeout(() => (loading.style.display = "none"), 500);
    }
  }
}

async function handleLogin() {
  const user = document.getElementById("login-username").value;
  const pass = document.getElementById("login-password").value;
  const errText = document.getElementById("login-error");

  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pass }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("its_token", data.access_token);
      if (errText) errText.style.display = "none";
      checkAuthAndInit();
    } else {
      if (errText) {
        errText.innerText = data.error || "Đăng nhập thất bại!";
        errText.style.display = "block";
      }
    }
  } catch (e) {
    if (errText) {
      errText.innerText = "Lỗi kết nối máy chủ!";
      errText.style.display = "block";
    }
  }
}

function handleLogout() {
  localStorage.removeItem("its_token");
  window.location.reload();
}