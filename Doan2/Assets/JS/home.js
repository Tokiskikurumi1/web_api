let slides = document.getElementsByClassName("slide");
let dots = document.getElementsByClassName("dot");
const menuIcon = document.querySelector("#menu-icon");
const navBarMenuIconActive = document.querySelector(
  ".nav-bar-menu-icon-active"
);

let currentCenter = 1;

const container = document.querySelector(".slideshow-container");
let startX = 0;
let currentX = 0;
let isDragging = false;

// Đợi DOM tải xong

// GỌI SAU KHI HEADER ĐÃ LOAD XONG (bắt buộc)
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
          ? "./User_header_footer/login.html"
          : "./User_header_footer/login.html"
      }">Đăng nhập/Đăng ký</a></span>
    `;
  }
}
// Menu toggle
const nav = document.querySelector(".nav-bar-menu-icon-active");
if (menuIcon && nav) {
  menuIcon.onclick = () => {
    nav.classList.toggle("active");
    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-x");
  };
}

// Dự phòng nếu header load chậm
window.addEventListener("load", () => setTimeout(updateLoginStatus, 500));

function startDrag(e) {
  isDragging = true;
  startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
}

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
}

function endDrag(e) {
  if (!isDragging) return;
  isDragging = false;
  const deltaX = currentX - startX;
  const threshold = 50;
  if (Math.abs(deltaX) > threshold) {
    if (deltaX > 0) {
      // Dragged right: move to previous slide
      const prevIndex = (currentCenter - 1 + 3) % 3;
      moveToCenter(prevIndex);
    } else {
      // Dragged left: move to next slide
      const nextIndex = (currentCenter + 1) % 3;
      moveToCenter(nextIndex);
    }
  }
  currentX = 0; // Reset
}

// Attach mouse events
container.addEventListener("mousedown", startDrag);
container.addEventListener("mousemove", drag);
container.addEventListener("mouseup", endDrag);
container.addEventListener("mouseleave", endDrag);

// Attach touch events
container.addEventListener("touchstart", startDrag);
container.addEventListener("touchmove", drag, { passive: false });
container.addEventListener("touchend", endDrag);

function moveToCenter(index) {
  // Xóa class hiện tại của slides và dots
  for (let i = 0; i < slides.length; i++) {
    slides[i].className = "slide slide" + (i + 1);
    dots[i].classList.remove("active");
  }

  // Gán class mới dựa trên chỉ số
  if (index === 0) {
    slides[0].classList.add("center");
    slides[1].classList.add("right");
    slides[2].classList.add("left");
  } else if (index === 1) {
    slides[0].classList.add("left");
    slides[1].classList.add("center");
    slides[2].classList.add("right");
  } else if (index === 2) {
    slides[0].classList.add("right");
    slides[1].classList.add("left");
    slides[2].classList.add("center");
  }
  dots[index].classList.add("active");
  // slides[index].classList.add("active"); // Removed as it's not used in CSS
  currentCenter = index;
}

updateLoginStatus();
