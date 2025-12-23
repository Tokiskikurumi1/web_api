// CỐT LÕI: Đọc dữ liệu dạng OBJECT → chuyển thành MẢNG để dùng như cũ
let usersObject = JSON.parse(localStorage.getItem("listusers")) || {};
let allUsers = Object.values(usersObject); // ← Dòng quan trọng nhất!

let allCourses = JSON.parse(localStorage.getItem("courses")) || [];

// Hiển thị số liệu tổng
document.getElementById("userCount").textContent = allUsers.length;
document.getElementById("courseCount").textContent = allCourses.length;

// ... phần còn lại giữ nguyên 100%
function new_user(newUsers) {
  const tableBody = document.getElementById("userTable");
  let html = "";
  for (let i = 0; i < newUsers.length; i++) {
    html += `
      <tr>
        <td>${newUsers[i].yourname || newUsers[i].name || "Chưa có tên"}</td>
        <td>${newUsers[i].email}</td>
        <td>${newUsers[i].created || newUsers[i].date || "Chưa có ngày"}</td>
      </tr>`;
  }
  tableBody.innerHTML = html;
}

// Hiển thị (mới nhất lên đầu)
new_user(allUsers.slice().reverse());
