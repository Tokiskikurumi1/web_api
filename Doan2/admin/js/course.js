// ======================= LẤY CÁC ELEMENT =======================
const courseTableBody = document.getElementById("courseTableBody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");

// Modal
const modal = document.getElementById("editCourseModal");
const saveBtn = document.getElementById("saveCourseBtn");
const closeBtn = document.getElementById("closeModalBtn");

// Input trong modal
const nameInput = document.getElementById("nameInput");
const descInput = document.getElementById("descInput");
const roleInput = document.getElementById("roleInput");
const teacherInput = document.getElementById("teacherInput");

// Biến lưu ID khóa học đang sửa
let editingCourseId = null;
let courses = JSON.parse(localStorage.getItem("courses") || "[]");

// ======================= HIỂN THỊ BẢNG =======================
function displayCourses(list) {
  courseTableBody.innerHTML = "";

  if (list.length === 0) {
    courseTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:60px 20px; color:#95a5a6; font-size:15px;">
          <i class="fas fa-search fa-3x" style="margin-bottom:16px; display:block;"></i>
          Không tìm thấy khóa học nào
        </td>
      </tr>
    `;
    return;
  }

  list.forEach((course) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${course.id}</td>
      <td><strong>${course.name}</strong></td>
      <td>${course.detail}</td>
      <td>
        <span class="badge ${course.type}">
          ${course.type.toUpperCase()}
        </span>
      </td>
      <td>${course.teacherName}</td>
      <td class="actions">
        <button class="edit-btn" onclick="openEditModal(${
          course.id
        })" title="Sửa">
          <i class="fas fa-pen"></i>
        </button>
        <button class="delete-btn" onclick="deleteCourse(${
          course.id
        })" title="Xóa">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    courseTableBody.appendChild(tr);
  });
}

// ======================= TÌM KIẾM + LỌC =======================
function filterCourses() {
  const query = searchInput.value.toLowerCase().trim();
  const category = roleFilter.value; // all, ielts, toeic

  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.detail.toLowerCase().includes(query) ||
      c.teacherName.toLowerCase().includes(query);

    const matchesCategory = category === "all" || c.type === category;

    return matchesSearch && matchesCategory;
  });

  displayCourses(filtered);
}

// ======================= MỞ MODAL SỬA =======================
function openEditModal(id) {
  const course = courses.find((c) => c.id === id);
  if (!course) return;

  editingCourseId = id;

  // Set data vào modal
  nameInput.value = course.name;
  descInput.value = course.detail;
  roleInput.value = course.type;
  teacherInput.value = course.teacherName;

  modal.classList.add("show");
}

// ======================= LƯU THAY ĐỔI =======================
saveBtn.onclick = function () {
  if (!editingCourseId) return;

  // Tìm vị trí khóa học cần sửa
  const index = courses.findIndex((c) => c.id === editingCourseId);
  if (index === -1) return alert("Không tìm thấy khóa học để cập nhật!");

  const oldCourse = courses[index];

  const updatedCourse = {
    ...oldCourse, // GIỮ TẤT CẢ CÁC FIELD KHÁC
    name: nameInput.value.trim(),
    detail: descInput.value.trim(),
    type: roleInput.value,
    teacherName: teacherInput.value.trim(),
  };

  if (!updatedCourse.name || !updatedCourse.teacherName) {
    alert("Vui lòng nhập đầy đủ tên khóa học và giảng viên!");
    return;
  }

  // Cập nhật mảng
  courses[index] = updatedCourse;

  // Lưu lại localStorage
  localStorage.setItem("courses", JSON.stringify(courses));

  alert("Cập nhật khóa học thành công!");

  modal.classList.remove("show");
  filterCourses();
};

// ======================= XÓA KHÓA HỌC =======================
function deleteCourse(id) {
  if (confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
    courses = courses.filter((c) => c.id !== id);
    localStorage.setItem("courses", JSON.stringify(courses));
    filterCourses();
  }
}

// ======================= ĐÓNG MODAL =======================
closeBtn.onclick = function () {
  modal.classList.remove("show");
  editingCourseId = null;
};

window.onclick = function (e) {
  if (e.target === modal) {
    modal.classList.remove("show");
    editingCourseId = null;
  }
};

// ======================= KHỞI TẠO =======================
displayCourses(courses);
