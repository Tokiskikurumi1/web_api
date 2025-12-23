const API_BASE = "https://localhost:7057";

async function loginUser() {
  const account = document.getElementById("login-username").value.trim();
  const pass = document.getElementById("login-password").value.trim();

  if (!account || !pass) {
    alert("Vui lòng nhập tài khoản và mật khẩu");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account, pass }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Đăng nhập thất bại");
      return;
    }

    const data = await res.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", data.user);
    localStorage.setItem("userid", data.userid);
    alert("Đăng nhập thành công");

    if (data.role.toLowerCase() === "teacher") {
      window.location.href = "../Teacher/teacher.html";
    } else {
      window.location.href = "./info.html";
    }
  } catch (e) {
    console.error(e);
    alert("Không kết nối được server");
  }
}
