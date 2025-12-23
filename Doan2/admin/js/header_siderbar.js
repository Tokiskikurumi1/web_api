// Load Sidebar
fetch("Components/sidebar.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("sidebar-placeholder").innerHTML = html;
    // sideBarActive();
    restoreActiveMenu();
  });

// Load Header
fetch("Components/header.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;
    updateLoginStatus();
    MenuToggle();
  });

// Menu toggle
function MenuToggle() {
  const menuIcon = document.getElementById("menuIcon");
  const leftSlide = document.querySelector(".left-slide");
  const overlay = document.getElementById("overlay"); // PHẢI KHAI BÁO DO CHƯA LOAD

  if (menuIcon && leftSlide && overlay) {
    menuIcon.addEventListener("click", () => {
      leftSlide.classList.toggle("active");
      overlay.classList.toggle("active");
    });
    overlay.addEventListener("click", () => {
      leftSlide.classList.remove("active");
      overlay.classList.remove("active");
    });
  }
}

function sideBarActive() {
  const links = document.querySelectorAll(".nav-bar-title ul li a");

  links.forEach((item, index) => {
    item.addEventListener("click", () => {
      localStorage.setItem("activeMenu", index); // Lưu vị trí
    });
  });
}

function restoreActiveMenu() {
  const links = document.querySelectorAll(".nav-bar-title ul li a");
  const activeIndex = localStorage.getItem("activeMenu");

  if (activeIndex !== null) {
    links.forEach((a) => a.classList.remove("active"));
    links[activeIndex].classList.add("active");
  }
}
