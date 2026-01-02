const API_BASE = "https://localhost:7204/api";

// ========================== DOM ==========================
const accountInput = document.getElementById("account");
const passInput = document.getElementById("pass");
const roleSelect = document.getElementById("role");
const loginBtn = document.getElementById("loginBtn");

// ========================== LOGIN ==========================
loginBtn.addEventListener("click", async () => {
  const account = accountInput.value.trim();
  const pass = passInput.value.trim();
  const selectedRole = roleSelect.value;

  if (!account || !pass) {
    alert("Vui lòng nhập tài khoản và mật khẩu");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: account,
        pass: pass,
      }),
    });

    if (!res.ok) {
      alert("Sai tài khoản hoặc mật khẩu");
      return;
    }

    const data = await res.json();

    // ===== CHECK ROLE (chỉ so sánh) =====
    if (selectedRole && data.role !== selectedRole) {
      alert("Vai trò không đúng với tài khoản!");
      return;
    }

    // ===== SAVE TOKEN =====
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", data.user);
    localStorage.setItem("userid", data.userid);

    alert("Đăng nhập thành công");

    if (data.role === "Teacher") {
      window.location.href = "../Teacher/teacher.html";
    } else {
      window.location.href = "./info.html";
    }
  } catch (err) {
    console.error(err);
    alert("Không kết nối được server");
  }
});
