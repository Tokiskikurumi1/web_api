import { User, UserManager } from './object.js';

const currentUser = User.loadCurrent();

const provincesData = {
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Đống Đa", "Cầu Giấy", "Thanh Xuân", "Hai Bà Trưng"],
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Quận 7", "Thủ Đức"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn"],
  "Chưa cập nhật": ["Chưa cập nhật"]
};

function renderUserInfo(user) {
  document.querySelector(".input-yourname").textContent = user.yourname || "Chưa cập nhật";
  document.querySelector(".input-username").textContent = user.username || "Chưa cập nhật";
  document.querySelector(".input-email").textContent = user.email || "Chưa cập nhật";
  document.querySelector(".input-phone").textContent = user.phone || "Chưa cập nhật";
  document.querySelector(".input-dob").textContent = user.dob || "Chưa cập nhật";
  document.querySelector(".input-province").textContent = user.province || "Chưa cập nhật";
  document.querySelector(".input-district").textContent = user.district || "Chưa cập nhật";
  document.querySelector(".input-intro").textContent = user.intro || "Chưa có giới thiệu";
}

if (currentUser) {
  renderUserInfo(currentUser);
}

document.addEventListener("DOMContentLoaded", function () {
  const btnUpdate = document.querySelector(".btn-update");
  let isEditing = false;

  btnUpdate.addEventListener("click", function () {
    const infoContents = document.querySelectorAll(".right-infomation-content span");

    if (!isEditing) {
      // Chuyển span -> input/select
      infoContents.forEach(span => {
        const field = span.dataset.field;
        let input;

        if (field === "dob") {
          input = document.createElement("input");
          input.type = "date";
          input.value = span.textContent !== "Chưa cập nhật" ? span.textContent : "";
        } else if (field === "province") {
          input = document.createElement("select");
          Object.keys(provincesData).forEach(p => {
            const opt = document.createElement("option");
            opt.value = p;
            opt.textContent = p;
            if (span.textContent === p) opt.selected = true;
            input.appendChild(opt);
          });
        } else if (field === "district") {
          input = document.createElement("select");
          const province = currentUser.province || "Chưa cập nhật";
          const districts = provincesData[province] || ["Chưa cập nhật"];
          districts.forEach(d => {
            const opt = document.createElement("option");
            opt.value = d;
            opt.textContent = d;
            if (span.textContent === d) opt.selected = true;
            input.appendChild(opt);
          });
        } else {
          input = document.createElement("input");
          input.type = "text";
          input.value = span.textContent !== "Chưa cập nhật" ? span.textContent : "";
        }

        input.className = span.className;
        input.dataset.field = field;
        span.replaceWith(input);
      });

      // xử lý load quận/huyện khi chọn tỉnh
      const provinceSelect = document.querySelector(".input-province");
      const districtSelect = document.querySelector(".input-district");
      provinceSelect.addEventListener("change", function () {
        districtSelect.innerHTML = "";
        const districts = provincesData[provinceSelect.value] || ["Chưa cập nhật"];
        districts.forEach(d => {
          const opt = document.createElement("option");
          opt.value = d;
          opt.textContent = d;
          districtSelect.appendChild(opt);
        });
      });

      btnUpdate.textContent = "Lưu";
      isEditing = true;
    } else {
      // Chuyển input -> span và lưu dữ liệu
      const inputs = document.querySelectorAll(".right-infomation-content input, .right-infomation-content select");
      let valid = true;

      inputs.forEach(input => {
        const span = document.createElement("span");
        span.className = input.className;
        span.dataset.field = input.dataset.field;

        let value = input.value.trim();

        // xử lý ngoại lệ từng trường
        switch (input.dataset.field) {
          case "yourname":
            if (!/^[\p{L}\s]+$/u.test(value)) {
              alert("Họ tên chỉ được chứa chữ cái và khoảng trắng.");
              valid = false;
            }
            break;
          case "username":
            if (!/^[a-zA-Z0-9]{4,12}$/.test(value)) {
              alert("Tên tài khoản phải từ 4-12 ký tự, chỉ gồm chữ và số.");
              valid = false;
            }
            break;
          case "email":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              alert("Email không hợp lệ.");
              valid = false;
            }
            break;
          case "phone":
            if (value && !/^(\+84\d{9,10}|0\d{9,10})$/.test(value)) {
              alert("Số điện thoại phải có định dạng +84xxxxxxxxx hoặc 0xxxxxxxxx.");
              valid = false;
            }
            break;
          case "dob":
            if (!value) {
              value = "Chưa cập nhật";
            } else {
              const dobDate = new Date(value);
              const today = new Date();
              let age = today.getFullYear() - dobDate.getFullYear();
              const monthDiff = today.getMonth() - dobDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                age--;
              }
              if (age < 6) {
                alert("Vui lòng điền ngày sinh thật (ít nhất 6 tuổi).");
                valid = false;
              }
            }
            break;
          case "intro":
            if (value.length > 200) {
              alert("Giới thiệu không được quá 200 ký tự.");
              valid = false;
            }
            break;
        }

        span.textContent = value || "Chưa cập nhật";
        input.replaceWith(span);

        currentUser[input.dataset.field] = value === "Chưa cập nhật" ? "" : value;
      });

      if (!valid) return; // nếu có lỗi thì dừng

      // lưu lại vào localStorage
      const users = UserManager.getAllUsers();
      users[currentUser.id] = currentUser;
      UserManager.saveAllUsers(users);

      btnUpdate.textContent = "Cập nhật";
      isEditing = false;
      alert("Thông tin đã được cập nhật!");
    }
  });
});
