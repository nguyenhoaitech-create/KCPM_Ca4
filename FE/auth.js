document.addEventListener("DOMContentLoaded", () => {
  checkAuthAndInit();
});

function checkAuthAndInit() {
  const token = localStorage.getItem("its_token");
  if (token) {
    document.getElementById("login-screen").style.display = "none";
    document.querySelector(".app-container").style.display = "flex";
    if (typeof initApp === "function") initApp();
  } else {
    document.getElementById("login-screen").style.display = "flex";
    document.querySelector(".app-container").style.display = "none";

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
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pass }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("its_token", data.access_token);
      errText.style.display = "none";
      checkAuthAndInit();
    } else {
      errText.innerText = data.error;
      errText.style.display = "block";
    }
  } catch (e) {
    errText.innerText = "Lỗi kết nối máy chủ!";
    errText.style.display = "block";
  }
}

function handleLogout() {
  localStorage.removeItem("its_token");
  window.location.reload();
}
