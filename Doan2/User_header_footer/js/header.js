fetch("header.html")
  .then((response) => {
    if (!response.ok) throw new Error("Không tìm thấy header.html");
    return response.text();
  })
  .then((data) => {
    document.getElementById("main-header").innerHTML = data;

    // Menu toggle
    const menuIcon = document.querySelector("#menu-icon");
    const navBarMenuIconActive = document.querySelector(
      ".nav-bar-menu-icon-active"
    );
    if (menuIcon && navBarMenuIconActive) {
      menuIcon.addEventListener("click", () => {
        navBarMenuIconActive.classList.toggle("active");
        menuIcon.classList.toggle("fa-bars");
        menuIcon.classList.toggle("fa-x");
      });
    }

    updateLoginStatus();
  })
  .catch((error) => console.error("Lỗi fetch:", error));

function updateLoginStatus() {
  const loginArea = document.querySelector(".login");
  if (!loginArea) {
    // Nếu header chưa load xong → thử lại sau 100ms
    setTimeout(updateLoginStatus, 100);
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser")); // ← KEY PHẢI ĐÚNG

  if (currentUser && currentUser.username) {
    loginArea.innerHTML = `
      <span>Chào mừng: ${currentUser.name} | <a href="#" id="logout">Đăng xuất</a></span>
    `;

    // Đăng xuất đúng cách
    document.getElementById("logout")?.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser"); // chỉ xóa currentUser
      location.reload();
    });
  } else {
    loginArea.innerHTML = `
      <span><a href="${
        location.pathname.includes("web_children")
          ? "./login.html"
          : "./login.html"
      }">Đăng nhập/Đăng ký</a></span>
    `;
  }
}

// GỌI SAU KHI HEADER ĐÃ LOAD XONG (bắt buộc)
fetch("header.html")
  .then((r) => (r.ok ? r.text() : Promise.reject("Không tìm thấy header")))
  .then((data) => {
    document.getElementById("main-header").innerHTML = data;

    // Menu toggle
    const menuIcon = document.querySelector("#menu-icon");
    const nav = document.querySelector(".nav-bar-menu-icon-active");
    if (menuIcon && nav) {
      menuIcon.onclick = () => {
        nav.classList.toggle("active");
        menuIcon.classList.toggle("fa-bars");
        menuIcon.classList.toggle("fa-x");
      };
    }

    // GỌI NGAY KHI HEADER ĐÃ CHÈN XONG → CHẮC CHẮN HIỂN THỊ ĐÚNG
    updateLoginStatus();
  })
  .catch((err) => console.error(err));

// Dự phòng nếu header load chậm
window.addEventListener("load", () => setTimeout(updateLoginStatus, 500));
