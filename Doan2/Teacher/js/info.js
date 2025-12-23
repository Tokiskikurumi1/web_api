// ========================== AUTH CHECK ==========================
let role = localStorage.getItem("role");
const teacherId = localStorage.getItem("userid");

if (role !== "Teacher" || !teacherId) {
  alert("Bạn không có quyền truy cập");
  window.location.href = "../User_header_footer/login.html";
}
const token = localStorage.getItem("accessToken");

const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone-number");
const dobInput = document.getElementById("date-of-birth");
const genderSelect = document.getElementById("gender");
const provinceInput = document.getElementById("province");
const districtInput = document.getElementById("district");
const oldPasswordInput = document.getElementById("current-password");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");

// Load thông tin
function loadUserInfo() {
  if (!currentUser) {
    return;
  }
  fullNameInput.value = currentUser.yourname || "";
  emailInput.value = currentUser.email || "";
  phoneInput.value = currentUser.phone || "";
  dobInput.value = currentUser.dob || "";
  genderSelect.value = currentUser.gender || "";
  provinceInput.value = currentUser.province || "";
  districtInput.value = currentUser.district || "";
}

document.addEventListener("DOMContentLoaded", loadUserInfo);

// Lưu thông tin
document.getElementById("save-btn")?.addEventListener("click", () => {
  if (!fullNameInput.value.trim()) {
    alert("Họ và tên không được để trống!");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
    alert(
      "Email không hợp lệ! Vui lòng nhập đúng định dạng (ví dụ: abc@gmail.com)"
    );
    return;
  }

  let phoneToSave = ""; // mặc định để trống
  if (phoneInput.value.trim() !== "") {
    if (/[^0-9\s\-\+\(\)]/.test(phoneInput.value)) {
      return alert(
        "Số điện thoại không được chứa chữ cái hoặc ký tự đặc biệt!"
      );
    }

    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return alert("Số điện thoại phải đúng 10 chữ số!");
    }

    phoneToSave = phoneDigits;
  }

  const updatedData = {
    yourname: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneToSave,
    dob: dobInput.value,
    gender: genderSelect.value,
    province: provinceInput.value.trim(),
    district: districtInput.value.trim(),
  };

  const allUsers = JSON.parse(localStorage.getItem("listusers") || "{}");
  if (allUsers[currentUser.id]) {
    allUsers[currentUser.id] = { ...allUsers[currentUser.id], ...updatedData };
    localStorage.setItem("listusers", JSON.stringify(allUsers));
    localStorage.setItem("currentUser", currentUser.id); // CHỈ LƯU ID!
    alert("Cập nhật thành công!");
  }
});

// ======================= ĐỔI MẬT KHẨU  =======================
document
  .getElementById("change-password-btn")
  ?.addEventListener("click", () => {
    document.getElementById("modal-change-password")?.classList.add("show");
  });

// Đóng modal
function closeModal() {
  const modal = document.getElementById("modal-change-password");
  if (modal) {
    modal.classList.remove("show");
    modal.querySelectorAll("input").forEach((i) => (i.value = ""));
  }
}

document
  .getElementById("modal-change-password")
  ?.addEventListener("click", (e) => {
    if (
      e.target === e.currentTarget ||
      e.target.classList.contains("cancel-btn")
    ) {
      closeModal();
    }
  });

// XỬ LÝ ĐỔI MẬT KHẨU
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#modal-change-password form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const oldPass = oldPasswordInput.value.trim();
    const newPass = newPasswordInput.value;
    const confirmPass = confirmPasswordInput.value;

    // Validate
    if (!oldPass || !newPass || !confirmPass) {
      return alert("Vui lòng nhập đầy đủ các trường!");
    }
    if (newPass !== confirmPass) {
      return alert("Mật khẩu xác nhận không khớp!");
    }
    if (newPass.length < 8) {
      return alert("Mật khẩu mới phải có ít nhất 8 ký tự!");
    }

    // Lấy dữ liệu thật từ listusers
    const allUsers = JSON.parse(localStorage.getItem("listusers") || "{}");
    const user = allUsers[currentUser.id]; // currentUser lấy từ hàm getCurrentUser() ở trên

    if (!user) {
      return alert("Lỗi hệ thống: Không tìm thấy tài khoản!");
    }
    if (user.password !== oldPass) {
      return alert("Mật khẩu hiện tại không đúng!");
    }

    // Cập nhật mật khẩu mới
    user.password = newPass;
    allUsers[currentUser.id] = user;

    localStorage.setItem("listusers", JSON.stringify(allUsers));

    alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");

    // Đăng xuất
    localStorage.removeItem("currentUser");
    window.location.href = "../User_header_footer/login.html";
  });
});
