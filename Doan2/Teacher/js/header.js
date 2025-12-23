// Load Sidebar
fetch("components/sidebar.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("sidebar-placeholder").innerHTML = html;
    restoreActiveMenu();
    sideBarActive();
  })
  .catch((err) => console.error("Lỗi load sidebar:", err));

// Load Header
fetch("components/header.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    // GỌI SAU KHI HEADER ĐÃ ĐƯỢC CHÈN VÀO DOM
    updateLoginStatus();
    MenuToggle(); // phải gọi ở đây, không gọi sớm quá!
  })
  .catch((err) => console.error("Lỗi load header:", err));

// ==================== MENU TOGGLE ====================
function MenuToggle() {
  const menuIcon = document.getElementById("menuIcon");
  const leftSlide = document.querySelector(".left-slide");
  const overlay = document.getElementById("overlay");

  // Phải kiểm tra tồn tại (vì có thể đang ở trang không có header)
  if (!menuIcon || !leftSlide || !overlay) {
    return; // thoát nếu không có phần tử (trang login chẳng hạn)
  }

  menuIcon.onclick = () => {
    leftSlide.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  overlay.onclick = () => {
    leftSlide.classList.remove("active");
    overlay.classList.remove("active");
  };
}

// ==================== ACTIVE MENU ====================
function sideBarActive() {
  const links = document.querySelectorAll(".nav-bar-title ul li a");

  links.forEach((item, index) => {
    item.addEventListener("click", () => {
      localStorage.setItem("activeMenu", index);
    });
  });
}

function restoreActiveMenu() {
  const links = document.querySelectorAll(".nav-bar-title ul li a");
  const activeIndex = localStorage.getItem("activeMenu");

  if (!links.length) return; // nếu chưa load sidebar thì thôi

  links.forEach((a) => a.classList.remove("active"));
  if (activeIndex !== null && links[activeIndex]) {
    links[activeIndex].classList.add("active");
  }
}

// ==================== HIỂN THỊ THÔNG TIN NGƯỜI DÙNG ====================
function updateLoginStatus() {
  // let role = localStorage.getItem("role");
  const teacherName = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  const userInfo = document.querySelector(".user-info");
  if (!userInfo) return;

  if (teacherName) {
    userInfo.innerHTML = `
      <div class="avatar">
        <i class="fa-solid fa-user"></i>
      </div>
      <span style="font-weight: 500">
        ${role === "teacher" ? "GV. " : ""}${teacherName}
      </span>
    `;

    // ĐĂNG XUẤT BẰNG LI – CHẠY 100%, KHÔNG BỊ ĐÈ SỰ KIỆN
    const logoutItem = document.getElementById("logout");
    if (logoutItem) {
      // Xóa hết sự kiện cũ (nếu có) bằng cách clone
      const newItem = logoutItem.cloneNode(true);
      logoutItem.parentNode.replaceChild(newItem, logoutItem);

      // Gắn sự kiện vào thẻ <li> mới
      newItem.addEventListener("click", (e) => {
        // Nếu bấm vào <a> bên trong thì vẫn chặn href
        e.preventDefault();
        if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
          localStorage.removeItem("currentUser");
          localStorage.removeItem("activeMenu");
          localStorage.removeItem("role");
          localStorage.removeItem("userid");
          localStorage.removeItem("accessToken");
          window.location.href = "../index.html";
        }
      });
    }
  } else {
    userInfo.innerHTML = `<a href="../User_header_footer/login.html">Đăng nhập</a>`;
  }
}
