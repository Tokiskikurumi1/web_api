// ========================== AUTH CHECK ==========================
let role = localStorage.getItem("role");
const teacherId = localStorage.getItem("userid");

if (role !== "Teacher" || !teacherId) {
  alert("Bạn không có quyền truy cập");
  window.location.href = "../User_header_footer/login.html";
}
const token = localStorage.getItem("accessToken");
// ========================== DOM ==========================
const courseListEl = document.getElementById("course-list");
const searchBar = document.querySelector(".search-bar");
const fromDateEl = document.getElementById("fromDate");
const toDateEl = document.getElementById("toDate");
const roleFilter = document.querySelector(".role_course");
const arrangeFilter = document.querySelector(".arrange");
const createCourse = document.getElementById("new-course");
let courses = []; // ← DATA TỪ API

// ========================== CALL API ==========================
async function loadCourses() {
  try {
    const res = await fetch("https://localhost:7057/teacher/get-all-course", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Không lấy được khóa học");

    courses = await res.json();
    renderCourses();
  } catch (err) {
    console.error(err);
    alert("Lỗi tải khóa học");
  }
}

// ========================== RENDER ==========================
function renderCourses() {
  courseListEl.innerHTML = "";

  let filtered = [...courses];

  // SEARCH
  const keyword = searchBar.value.toLowerCase();
  if (keyword) {
    filtered = filtered.filter((c) =>
      c.courseName.toLowerCase().includes(keyword)
    );
  }

  // DATE
  if (fromDateEl.value)
    filtered = filtered.filter((c) => c.courseDate >= fromDateEl.value);
  if (toDateEl.value)
    filtered = filtered.filter((c) => c.courseDate <= toDateEl.value);

  // STATUS / TYPE
  const role = roleFilter.value;
  if (role === "published")
    filtered = filtered.filter((c) => c.courseStatus === "completed");
  else if (role === "draft")
    filtered = filtered.filter((c) => c.courseStatus === "incomplete");
  else if (role !== "all")
    filtered = filtered.filter((c) => c.courseType === role);

  // SORT
  const arrange = arrangeFilter.value;
  if (arrange === "new")
    filtered.sort((a, b) => new Date(b.courseDate) - new Date(a.courseDate));
  else if (arrange === "old")
    filtered.sort((a, b) => new Date(a.courseDate) - new Date(b.courseDate));
  else if (arrange === "AtoZ")
    filtered.sort((a, b) => a.courseName.localeCompare(b.courseName));
  else if (arrange === "ZtoA")
    filtered.sort((a, b) => b.courseName.localeCompare(a.courseName));

  // NO DATA
  if (filtered.length === 0) {
    courseListEl.innerHTML = `
      <div class="no-course">
        Không có khóa học nào
      </div>`;
    return;
  }

  // RENDER
  filtered.forEach((course) => {
    const div = document.createElement("div");
    div.className = "item-course";

    div.innerHTML = `
      <div class="item-course-panel">
        <div class="image-course">
          <img src="./img/course.png" />
        </div>
        <div class="course-info">
          <div class="name-course">${course.courseName}</div>

          <div class="date-and-number">
            <div class="date-make">Ngày tạo: ${course.courseDate}</div>
            <div class="number-of-student">---</div>
          </div>

          <hr />

          <div class="status-course">
            <div class="status">
              ${
                course.courseStatus === "completed"
                  ? "Đã hoàn thành"
                  : "Chưa hoàn thành"
              }
            </div>
            <button class="delete-btn">Xóa</button>
          </div>
        </div>
      </div>
    `;
    const deleteBtn = div.querySelector(".delete-btn");

    deleteBtn.onclick = async (e) => {
      e.stopPropagation(); //  chặn click lan ra panel

      if (!confirm("Bạn có chắc muốn xóa khóa học này?")) return;

      try {
        const res = await fetch(
          `https://localhost:7057/teacher/delete-course/${course.courseID}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Xóa thất bại");

        // XÓA TRÊN UI
        courses = courses.filter((c) => c.courseID !== course.courseID);
        renderCourses();
      } catch (err) {
        console.error(err);
        alert("Không thể xóa khóa học");
      }
    };

    // CHI TIẾT
    div.querySelector(".item-course-panel").onclick = (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      localStorage.setItem("courseID", course.courseID);
      window.location.href = "detail-course.html";
    };

    courseListEl.appendChild(div);
  });
}

// ========================== TẠO KHÓA HỌC ==========================
const createForm = document.getElementById("create-course-form");
const modalCreate = document.getElementById("create-course-modal");
createCourse.onclick = () => {
  modalCreate.style.display = "flex";
};
createForm.onsubmit = async (e) => {
  e.preventDefault();

  const body = {
    teacherID: teacherId,
    courseName: document.getElementById("course-name").value,
    courseType: document.getElementById("course-type").value,
    courseDes: document.getElementById("course-detail").value,
    coursePrice: document.getElementById("course-price").value,
    courseStatus: document.getElementById("course-status").value,
    courseImage: null, // sau này upload file xử lý riêng
  };

  try {
    const res = await fetch(
      "https://localhost:7057/teacher/create-new-course",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) throw new Error("Tạo khóa học thất bại");

    alert("Tạo khóa học thành công!");

    modalCreate.style.display = "none";
    createForm.reset();

    loadCourses(); // reload danh sách
  } catch (err) {
    console.error(err);
    alert("Không thể tạo khóa học");
  }
};

// =========================HỦY TẠO =========================
document.getElementById("cancel-create").onclick = () => {
  modalCreate.style.display = "none";
};

// ========================== EVENTS ==========================
searchBar.oninput = renderCourses;
document.querySelector(".apply").onclick = renderCourses;
roleFilter.onchange = renderCourses;
arrangeFilter.onchange = renderCourses;

// ========================== START ==========================
loadCourses();
