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

// ========================== LOAD CHI TIẾT BÀI TẬP ==========================
async function loadAssignmentForEdit(id) {
  try {
    const res = await fetch(
      `https://localhost:7057/teacherAssignmentVideo/get-assignment-by-id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Không load được bài tập");

    const data = await res.json();

    // 👉 nếu API trả object
    const a = Array.isArray(data) ? data[0] : data;

    if (!a) throw new Error("Không có dữ liệu bài tập");

    // ===== ĐỔ DATA VÀO FORM =====
    titleInput.value = a.assignmentName || "";
    courseInput.value = a.assignmentCourse || "";
    deadlineInput.value = a.assignmentDeadline?.slice(0, 10) || "";
    descriptionInput.value = a.assignmentDes || "";
    durationInput.value = a.assignmentDuration || "";
    statusSelect.value = a.assignmentStatus || "";

    // ===== LOAD QUESTIONS =====
    await loadQuestions(a.assignmentID);
  } catch (err) {
    console.error(err);
    alert("Chưa có câu hỏi cho bài tập này!");
  }
}
