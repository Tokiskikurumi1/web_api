const token = localStorage.getItem("accessToken");
const role = localStorage.getItem("role");
const username = localStorage.getItem("user");

const titleComback = document.querySelector(".title-comback");

function render() {
  // chưa đăng nhập
  if (!token) {
    window.location.href = "../User_header_footer/login.html";
    return;
  }

  // không phải giảng viên
  if (role?.toLowerCase() !== "teacher") {
    alert("Bạn không có quyền truy cập trang giảng viên");
    window.location.href = "../User_header_footer/login.html";
    return;
  }

  const hoTen = username || "Giảng viên";

  titleComback.innerHTML = `
    <h2>
      Chào mừng trở lại,
      <span style="color: var(--blue-)">GV. ${hoTen}</span>!
    </h2>
    <p style="color: var(--grey)">
      Hôm nay: ${new Date().toLocaleDateString("vi-VN")}
    </p>
  `;
}

render();
