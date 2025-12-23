const API_BASE = "https://localhost:7057";

/* =======================
   TOKEN HANDLE
======================= */
function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

/* =======================
   BASE REQUEST
======================= */
async function apiRequest(url, method = "GET", body = null, auth = false) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(API_BASE + url, options);

  if (res.status === 401) {
    alert("Chưa đăng nhập hoặc token hết hạn");
    clearToken();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText);
  }

  return res.json();
}
