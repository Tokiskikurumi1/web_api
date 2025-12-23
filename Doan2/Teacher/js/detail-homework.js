// ========================== AUTH CHECK ==========================
let role = localStorage.getItem("role");
const teacherId = localStorage.getItem("userid");

if (role !== "Teacher" || !teacherId) {
  alert("Bạn không có quyền truy cập");
  window.location.href = "../../User_header_footer/login.html";
}
const token = localStorage.getItem("accessToken");

// ==================================================== ELEMENTS ====================================================
const nameAssignment = document.getElementById("nameAss");
const nameCourse = document.getElementById("nameCourse");
const deadLine = document.getElementById("deadLine");
const timeWork = document.getElementById("timeWork");
const type = document.getElementById("type");
const description = document.getElementById("description");

// ========================== HIỂN THỊ ==========================
nameAssignment.innerHTML = assignment.title;
nameCourse.innerHTML = assignment.course;
deadLine.innerHTML = assignment.deadline;
timeWork.innerHTML = assignment.duration;
type.innerHTML = assignment.type;
description.innerHTML = assignment.description;
