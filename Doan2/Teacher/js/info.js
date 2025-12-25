// ========================== AUTH CHECK ==========================
let role = localStorage.getItem("role");
const teacherId = localStorage.getItem("userid");

if (role !== "Teacher" || !teacherId) {
  alert("Bạn không có quyền truy cập");
  window.location.href = "../User_header_footer/login.html";
}

const token = localStorage.getItem("accessToken");

// ========================== DOM ELEMENTS ==========================
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

// ========================== STATE ==========================
let infoTeacher = [];

// ========================== LOAD USER INFO INTO FORM ==========================
function loadUserInfo() {
  if (!infoTeacher) return;

  fullNameInput.value = infoTeacher.userName || "";
  dobInput.value = infoTeacher.date_of_Birth || "";
  genderSelect.value = infoTeacher.gender || "";
  districtInput.value = infoTeacher.district || "";
  provinceInput.value = infoTeacher.province || "";
  phoneInput.value = infoTeacher.phoneNumber || "";
  emailInput.value = infoTeacher.email || "";
}

// ========================== INITIAL LOAD ==========================
document.addEventListener("DOMContentLoaded", () => {
  loadInfoTeacher();
  loadUserInfo();
});

// ========================== UPDATE TEACHER INFO ==========================
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

  let phoneToSave = "";
  if (phoneInput.value.trim() !== "") {
    if (/[^0-9\s\-\+\(\)]/.test(phoneInput.value)) {
      alert("Số điện thoại không được chứa chữ cái hoặc ký tự đặc biệt!");
      return;
    }

    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      alert("Số điện thoại phải đúng 10 chữ số!");
      return;
    }

    phoneToSave = phoneDigits;
  }

  const updatedData = {
    userName: fullNameInput.value.trim(),
    date_of_Birth: dobInput.value,
    gender: genderSelect.value,
    district: districtInput.value.trim(),
    province: provinceInput.value.trim(),
    phoneNumber: phoneToSave,
    email: emailInput.value.trim(),
  };

  try {
    fetch("https://localhost:7057/teacherInfo/update-info-teacher", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    alert("Cập nhật thông tin thành công");
    loadInfoTeacher();
  } catch (error) {
    console.error("Error updating teacher info:", error);
    alert("Cập nhật thông tin thất bại");
  }
});

// ======================= CHANGE PASSWORD UI =======================
document
  .getElementById("change-password-btn")
  ?.addEventListener("click", () => {
    document.getElementById("modal-change-password")?.classList.add("show");
  });

function closeModal() {
  const modal = document.getElementById("modal-change-password");
  if (!modal) return;

  modal.classList.remove("show");
  modal.querySelectorAll("input").forEach((i) => (i.value = ""));
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

// ======================= CHANGE PASSWORD LOGIC =======================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#modal-change-password form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const oldPass = oldPasswordInput.value.trim();
    const newPass = newPasswordInput.value.trim();
    const confirmPass = confirmPasswordInput.value.trim();

    // ===== VALIDATE =====
    if (!oldPass || !newPass || !confirmPass) {
      alert("Vui lòng nhập đầy đủ các trường!");
      return;
    }

    if (newPass !== confirmPass) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (newPass.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const response = await fetch(
        "https://localhost:7057/teacherUpdatePass/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPass: oldPass,
            newPass: newPass,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Đổi mật khẩu thất bại!");
        return;
      }

      alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");

      // ===== LOGOUT =====
      localStorage.clear();
      window.location.href = "../User_header_footer/login.html";
    } catch (error) {
      console.error("Change password error:", error);
      alert("Không thể kết nối server!");
    }
  });
});


// ========================== API: LOAD TEACHER INFO ==========================
async function loadInfoTeacher() {
  try {
    const response = await fetch(
      "https://localhost:7057/teacherInfo/get-info-teacher",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    infoTeacher = data[0];

    localStorage.setItem("currentUserInfo", JSON.stringify(infoTeacher));
    window.dispatchEvent(new Event("userInfoUpdated"));

    loadUserInfo();
  } catch (error) {
    console.error("Error fetching teacher info:", error);
  }
}
