// ========================== AUTH CHECK ==========================
let role = localStorage.getItem("role");
const teacherId = localStorage.getItem("userid");

if (role !== "Teacher" || !teacherId) {
  alert("Bạn không có quyền truy cập");
  window.location.href = "../../User_header_footer/login.html";
}
const token = localStorage.getItem("accessToken");

document.addEventListener("DOMContentLoaded", () => {
  console.log("manage_homework.js loaded");
  loadAssignments(); // mặc định load "all"
  setupTabs();
  updateTabCounts();
});

let allAssignments = []; // toàn bộ bài tập

// ========================== DOM READY ==========================
document.addEventListener("DOMContentLoaded", () => {
  loadAssignmentsAPI("all"); // 🔥 PHẢI GỌI API
  setupTabs();
});

// ======================= LOAD ASSIGNMENTS =======================
async function loadAssignmentsAPI(filter = "all") {
  try {
    const res = await fetch(
      "https://localhost:7057/teacherAssignmentVideo/get-all-assignments",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Không load được assignments");

    const data = await res.json();

    // 🔥 MAP FIELD API → UI
    allAssignments = data.map((a) => ({
      id: a.assignmentID,
      title: a.assignmentName,
      course: a.assignmentCourse,
      deadline: a.assignmentDeadline,
      status: a.assignmentStatus === "completed" ? "published" : "draft",
    }));

    renderAssignments(filter);
    updateTabCounts();
  } catch (err) {
    console.error(err);
    alert("Lỗi tải bài tập");
  }
}

// ======================= RENDER ASSIGNMENTS =======================
function renderAssignments(filter = "all") {
  const grid = document.querySelector(".assignment-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = allAssignments.filter((a) => {
    if (filter === "published") return a.status === "published";
    if (filter === "draft") return a.status === "draft";
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="background:white;padding:2rem;border-radius:12px;text-align:center">
        <p>Chưa có bài tập nào</p>
      </div>
    `;
    return;
  }

  filtered.forEach((a) => {
    grid.appendChild(createAssignmentCard(a));
  });
}

// ======================= CREATE CARD =======================
function createAssignmentCard(a) {
  const card = document.createElement("div");
  card.className = "assignment-card";

  const submitted = 0; // Sẽ cập nhật sau
  const notSubmitted = 0;
  const total = submitted + notSubmitted;
  const percent = total > 0 ? Math.round((submitted / total) * 100) : 0;

  if (a.status === "published") {
    card.innerHTML = `
      <div class="assignment-card-header">
        <div class="assignment">
          <h3 class="assignment-title">${escapeHtml(a.title)}</h3>
          <span class="badge badge-published">Đã xuất bản</span>
        </div>
        <div class="assignment-meta">
          <span><i class="fas fa-book"></i> ${escapeHtml(
            a.course || "Không xác định"
          )}</span>
          <span><i class="fas fa-calendar"></i> Hạn: ${formatDeadline(
            a.deadline
          )}</span>
        </div>
      </div>
      <div class="assignment-body">
        <div class="stats-grid" style="opacity: 0;">
          <div class="stat-item">
            <div class="stat-value done">${submitted}</div>
            <div class="stat-label">Đã nộp</div>
          </div>
          <div class="stat-item">
            <div class="stat-value done-yet">${notSubmitted}</div>
            <div class="stat-label">Chưa nộp</div>
          </div>
        </div>
        
        <div class="assignment-actions">
          <button class="btn btn-primary btn-sm" onclick="viewDetail('${
            a.id
          }')">Xem chi tiết</button>
          <button class="btn btn-outline btn-sm" onclick="editDraft('${
            a.id
          }')">Chỉnh sửa</button>
          <button class="btn btn-outline btn-sm text-red" onclick="deleteAssignment('${
            a.id
          }')">Xóa</button>
        </div>
      </div>
    `;
  } else {
    card.innerHTML = `
      <div class="assignment-card-header">
        <div class="assignment">
          <h3 class="assignment-title">${escapeHtml(a.title)}</h3>
          <span class="badge badge-draft">Bản nháp</span>
        </div>
        <div class="assignment-meta">
          <span><i class="fas fa-book"></i> ${escapeHtml(
            a.course || "Chưa chọn khóa"
          )}</span>
          <span><i class="fas fa-calendar"></i> Chưa đặt hạn</span>
        </div>
      </div>
      <div class="assignment-body">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">—</div>
            <div class="stat-label">Chưa xuất bản</div>
          </div>
        </div>
        <div class="assignment-actions">
          <button class="btn btn-outline btn-sm" onclick="editDraft('${
            a.id
          }')">Tiếp tục soạn</button>
          <button class="btn btn-outline btn-sm text-red" onclick="deleteAssignment('${
            a.id
          }')">Xóa</button>
        </div>
      </div>
    `;
  }

  return card;
}

// ======================= TAB =======================
function setupTabs() {
  document.querySelectorAll(".filter-tabs .tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-tabs .tab")
        .forEach((t) => t.classList.remove("active"));

      tab.classList.add("active");

      const text = tab.innerText;
      if (text.includes("Tất cả")) renderAssignments("all");
      else if (text.includes("Đã xuất bản")) renderAssignments("published");
      else renderAssignments("draft");
    });
  });
}

// ======================= COUNT =======================
function updateTabCounts() {
  const published = allAssignments.filter(
    (a) => a.status === "published"
  ).length;
  const draft = allAssignments.filter((a) => a.status === "draft").length;
  const total = allAssignments.length;

  const tabs = document.querySelectorAll(".filter-tabs .tab");
  if (tabs[0]) tabs[0].innerText = `Tất cả (${total})`;
  if (tabs[1]) tabs[1].innerText = `Đã xuất bản (${published})`;
  if (tabs[2]) tabs[2].innerText = `Bản nháp (${draft})`;
}

// ======================= ACTIONS =======================
function editDraft(id) {
  localStorage.setItem("editingAssignmentId", id);
  window.location.href = "create-homework.html";
}

function viewDetail(id) {
  localStorage.setItem("detailAssignmentId", id);
  window.location.href = "detail-homework.html";
}

// ======================= UTIL =======================
function formatDeadline(d) {
  if (!d) return "Chưa đặt";
  return new Date(d).toLocaleDateString("vi-VN");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
// ==============================================

// ======================= XÓA =======================
async function deleteAssignment(id) {
  if (!confirm("Bạn có chắc muốn xóa bài tập này?")) return;

  if (!confirm("Bạn có chắc muốn xóa khóa học này?")) return;

  try {
    const res = await fetch(
      `https://localhost:7057/teacher/delete-assignment/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Xóa thất bại");

    // XÓA TRÊN UI
    allAssignments = allAssignments.filter((a) => a.id !== id);
    renderAssignments(getActiveFilter());
  } catch (err) {
    console.error(err);
    alert("Không thể xóa bài tập");
  }

  // Cập nhật lại danh sách hiện tại
  allAssignments = allAssignments.filter((a) => a.id !== id);
  updateTabCounts();
  loadAssignments(getActiveFilter());
}

function getActiveFilter() {
  const active = document.querySelector(".filter-tabs .tab.active");
  const text = active?.textContent || "";
  if (text.includes("Tất cả")) return "all";
  if (text.includes("Đã xuất bản")) return "published";
  return "draft";
}

// ======================= TẠO MỚI =======================
document
  .getElementById("create-new-homework")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("editingAssignmentId"); // đảm bảo tạo mới
    window.location.href = "./create-homework.html";
  });
