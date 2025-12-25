// ========================== AUTH ==========================
const token = localStorage.getItem("accessToken");
const role = localStorage.getItem("role");
const teacherId = localStorage.getItem("userid");

const videoId = Number(localStorage.getItem("videoID"));
const editingAssignmentId = Number(localStorage.getItem("editingAssignmentId"));

if (role !== "Teacher" || !teacherId) {
  alert("Bạn không có quyền truy cập");
  window.location.href = "../User_header_footer/login.html";
}

// ========================== DOM ==========================
const titleInput = document.getElementById("homework-title");
const courseInput = document.getElementById("courseName");
const deadlineInput = document.getElementById("deadline-input");
const descriptionInput = document.querySelector(".form-textarea");
const statusSelect = document.getElementById("status-select");
const durationInput = document.getElementById("duration-select");
const questionsContainer = document.getElementById("questions-container");

// ========================== GLOBAL ==========================
let assignmentList = [];
let currentQuestions = [];
let editingQuestionID = null;
let editingAnswers = [];

// ========================== LOAD ASSIGNMENT ==========================
async function loadAssignments() {
  const res = await fetch(
    `https://localhost:7057/teacherAssignmentVideo/get-all-assignment/${videoId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  assignmentList = await res.json();
  loadDraft();
}

function loadDraft() {
  const assignment = assignmentList.find(
    (a) => a.assignmentID === editingAssignmentId
  );
  if (!assignment) return;

  titleInput.value = assignment.assignmentName || "";
  courseInput.value = assignment.assignmentCourse || "";
  deadlineInput.value = assignment.assignmentDeadline?.slice(0, 10) || "";
  descriptionInput.value = assignment.assignmentDes || "";
  statusSelect.value = assignment.assignmentStatus;
  durationInput.value = assignment.assignmentDuration + " phút";

  loadQuestions(editingAssignmentId);
}

// ========================== LOAD QUESTIONS ==========================
async function loadQuestions(assignmentId) {
  const qRes = await fetch(
    `https://localhost:7057/teacherManageQuestion/get-question/${assignmentId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  currentQuestions = await qRes.json();
  renderQuestions();
}

// ========================== RENDER ==========================
async function renderQuestions() {
  questionsContainer.innerHTML = "";

  for (let i = 0; i < currentQuestions.length; i++) {
    const q = currentQuestions[i];

    const aRes = await fetch(
      `https://localhost:7057/teacherManageAnswer/get-all-answer/${q.questionID}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const answers = aRes.ok ? await aRes.json() : [];

    const div = document.createElement("div");
    div.className = "question-builder";
    div.dataset.questionId = q.questionID;

    div.innerHTML = `
      <div class="question-header">
        <div class="question-title">Câu hỏi ${i + 1}</div>
        <div>
          <button type="button" class="btn-edit" onclick="editQuestion(${
            q.questionID
          })">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-remove" onclick="removeQuestion(this)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <textarea class="form-textarea question-content" disabled>${
        q.content
      }</textarea>

      <div class="answer-list">
        ${answers
          .sort((a, b) => a.answerIndex - b.answerIndex)
          .map(
            (a) => `
            <div class="answer-option">
              <input type="radio" ${a.isCorrect ? "checked" : ""} disabled />
              <input type="text" class="answer-input" value="${
                a.answerText
              }" disabled />
            </div>
          `
          )
          .join("")}
      </div>
      <hr />
    `;

    questionsContainer.appendChild(div);
  }
}

// ========================== MODAL ==========================
function openQuestionModalCreate() {
  editingQuestionID = null;
  editingAnswers = [];

  document.getElementById("modal-question-content").value = "";
  document.getElementById("modal-answers").innerHTML = `
    ${[0, 1, 2, 3]
      .map(
        (i) => `
      <div class="answer-row">
        <input type="radio" name="correctAnswer" value="${i}">
        <input type="text">
      </div>`
      )
      .join("")}
  `;

  document.getElementById("questionModal").classList.remove("hidden");
}

function openQuestionModalEdit() {
  document.getElementById("questionModal").classList.remove("hidden");
}

function closeQuestionModal() {
  document.getElementById("questionModal").classList.add("hidden");
}

// ========================== CREATE / UPDATE ==========================
async function saveQuestion() {
  const content = document
    .getElementById("modal-question-content")
    .value.trim();
  const answersInput = document.querySelectorAll(
    "#modal-answers input[type=text]"
  );
  const correctIndex = document.querySelector(
    'input[name="correctAnswer"]:checked'
  )?.value;

  if (!content || correctIndex === undefined) {
    alert("Nhập đủ câu hỏi và chọn đáp án đúng");
    return;
  }

  // ================= UPDATE =================
  if (editingQuestionID) {
    await fetch(
      "https://localhost:7057/teacherManageQuestion/update-question",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionID: editingQuestionID,
          assignmentID: editingAssignmentId,
          questionType: "Quizz",
          content,
          original: "",
          rewritten: "",
        }),
      }
    );

    for (let i = 0; i < editingAnswers.length; i++) {
      await fetch("https://localhost:7057/teacherManageAnswer/update-answer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answerID: editingAnswers[i].answerID,
          questionID: editingQuestionID,
          answerText: answersInput[i].value.trim(),
          isCorrect: Number(correctIndex) === i,
          answerIndex: i,
        }),
      });
    }
  }

  // ================= CREATE =================
  else {
    const qRes = await fetch(
      "https://localhost:7057/teacherManageQuestion/create-new-question",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignmentID: editingAssignmentId,
          questionType: "Quizz",
          content,
          original: "",
          rewritten: "",
        }),
      }
    );

    const qListRes = await fetch(
      `https://localhost:7057/teacherManageQuestion/get-question/${editingAssignmentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const questions = await qListRes.json();
    const questionID = questions.sort((a, b) => b.questionID - a.questionID)[0]
      .questionID;

    for (let i = 0; i < answersInput.length; i++) {
      if (!answersInput[i].value.trim()) continue;

      await fetch("https://localhost:7057/teacherManageAnswer/create-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionID,
          answerText: answersInput[i].value.trim(),
          isCorrect: Number(correctIndex) === i,
          answerIndex: i,
        }),
      });
    }
  }

  closeQuestionModal();
  await loadQuestions(editingAssignmentId);
}

// ========================== EDIT ==========================
async function editQuestion(questionID) {
  editingQuestionID = questionID;

  const q = currentQuestions.find((q) => q.questionID === questionID);
  if (!q) {
    alert("Không tìm thấy câu hỏi");
    return;
  }

  document.getElementById("modal-question-content").value = q.content;

  const aRes = await fetch(
    `https://localhost:7057/teacherManageAnswer/get-all-answer/${questionID}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  editingAnswers = aRes.ok ? await aRes.json() : [];

  const answersContainer = document.getElementById("modal-answers");
  answersContainer.innerHTML = "";

  editingAnswers
    .sort((a, b) => a.answerIndex - b.answerIndex)
    .forEach((a, index) => {
      answersContainer.innerHTML += `
        <div class="answer-row">
          <input type="radio" name="correctAnswer" value="${index}" ${
        a.isCorrect ? "checked" : ""
      }>
          <input type="text" value="${a.answerText}">
        </div>
      `;
    });

  openQuestionModal();
}

// ========================== DELETE ==========================
async function removeQuestion(btn) {
  const questionID = btn.closest(".question-builder").dataset.questionId;
  if (!confirm("Xóa câu hỏi này?")) return;

  await fetch(
    `https://localhost:7057/teacherManageQuestion/delete-question/${questionID}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
  );

  await loadQuestions(editingAssignmentId);
}

function openQuestionModal() {
  document.getElementById("questionModal").classList.remove("hidden");
}

function closeQuestionModal() {
  document.getElementById("questionModal").classList.add("hidden");

  // reset state
  editingQuestionID = null;
  editingAnswers = [];
}

// ========================== INIT ==========================
loadAssignments();
