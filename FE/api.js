const API_BASE = "/api";

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("its_token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    handleLogout();
    throw new Error("Phiên đăng nhập hết hạn!");
  }
  return response;
}
