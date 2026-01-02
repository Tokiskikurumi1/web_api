// ========================== AUTH CHECK ==========================
const role = localStorage.getItem("role");
const teacherId = localStorage.getItem("userid");
const token = localStorage.getItem("accessToken");

if (role !== "Teacher" || !teacherId || !token) {
  alert("Bạn không có quyền truy cập");
  window.location.href = "../../User_header_footer/login.html";
}

// ========================== STATE ==========================
let allAssignments = [];
let currentFilter = "all";

// ========================== DOM READY ==========================
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  loadAssignmentsAPI();
});

// ======================= LOAD ASSIGNMENTS =======================
async function loadAssignmentsAPI() {
  try {
    const res = await fetch(
      "https://localhost:7057/teacherAssignmentVideo/get-all-assignments",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Không load được assignments");

    const data = await res.json();

    // MAP API → STATE
    allAssignments = data.map((a) => ({
      id: a.assignmentID,
      title: a.assignmentName,
      course: a.assignmentCourse,
      deadline: a.assignmentDeadline,
      status: a.assignmentStatus === "completed" ? "completed" : "incomplete",
    }));

    renderAssignments();
    updateTabCounts();
  } catch (err) {
    console.error(err);
    alert("Lỗi tải bài tập");
  }
}

// ======================= RENDER =======================
function renderAssignments() {
  const grid = document.querySelector(".assignment-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = allAssignments.filter((a) => {
    if (currentFilter === "completed") return a.status === "completed";
    if (currentFilter === "incomplete") return a.status === "incomplete";
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

// ======================= CARD =======================
function createAssignmentCard(a) {
  const card = document.createElement("div");
  card.className = "assignment-card";

  if (a.status === "completed") {
    card.innerHTML = `
      <div class="assignment-card-header">
        <div class="assignment">
          <h3 class="assignment-title">${escapeHtml(a.title)}</h3>
          <span class="badge badge-published">Đã hoàn thành</span>
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
            <div class="stat-value done">0</div>
            <div class="stat-label">Đã nộp</div>
          </div>
          <div class="stat-item">
            <div class="stat-value done-yet">0</div>
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
          <span class="badge badge-draft">Chưa hoàn thành</span>
        </div>
        <div class="assignment-meta">
          <span><i class="fas fa-book"></i> ${escapeHtml(
            a.course || "Chưa chọn khóa"
          )}</span>
        </div>
      </div>
      <div class="assignment-body">
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

// ======================= TABS =======================
function setupTabs() {
  document.querySelectorAll(".filter-tabs .tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-tabs .tab")
        .forEach((t) => t.classList.remove("active"));

      tab.classList.add("active");

      const text = tab.innerText;
      if (text.includes("Tất cả")) currentFilter = "all";
      else if (text.includes("Hoàn thành")) currentFilter = "completed";
      else currentFilter = "incomplete";

      renderAssignments();
    });
  });
}

// ======================= COUNT =======================
function updateTabCounts() {
  const completed = allAssignments.filter(
    (a) => a.status === "completed"
  ).length;
  const incomplete = allAssignments.filter(
    (a) => a.status === "incomplete"
  ).length;

  const tabs = document.querySelectorAll(".filter-tabs .tab");
  if (tabs[0]) tabs[0].innerText = `Tất cả (${allAssignments.length})`;
  if (tabs[1]) tabs[1].innerText = `Hoàn thành (${completed})`;
  if (tabs[2]) tabs[2].innerText = `Chưa hoàn thành (${incomplete})`;
}

// ======================= ACTIONS =======================
function editDraft(id) {
  localStorage.setItem("editingAssignmentId", id);
  window.location.href = "create-homework.html";
}

// ======================= VIEW DETAIL =======================
function viewDetail(id) {
  localStorage.setItem("detailAssignmentId", id);
  window.location.href = "detail-homework.html";
}

// ======================= DELETE =======================
async function deleteAssignment(id) {
  id = Number(id);
  if (!confirm("Bạn có chắc muốn xóa bài tập này?")) return;

  try {
    const res = await fetch(
      `https://localhost:7057/teacherAssignmentVideo/delete-assignment/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Xóa thất bại");
    allAssignments = allAssignments.filter((a) => a.id !== id);

    renderAssignments();
    updateTabCounts();
    alert("Xóa bài tập thành công");
  } catch (err) {
    console.error(err);
    alert("Không thể xóa bài tập");
  }
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

// ======================= CREATE NEW =======================
document
  .getElementById("create-new-homework")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("editingAssignmentId");
    window.location.href = "./create-homework.html";
  });
