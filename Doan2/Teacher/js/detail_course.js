// ========================== AUTH ==========================
const token = localStorage.getItem("accessToken");
const courseId = Number(localStorage.getItem("courseID"));
// const userId = Number(localStorage.getItem("userid"));
const currentUser = localStorage.getItem("user");

if (!token || !courseId) {
  alert("Thiếu thông tin khóa học");
  window.location.href = "manage-course.html";
}

// ========================== ELEMENTS ==========================
const titleInput = document.getElementById("course-title");
const typeSelect = document.getElementById("course-select");
const dateInput = document.getElementById("date-input");
const courseDetail = document.getElementById("course-detail");
const priceInput = document.getElementById("number-price");
const videoListEl = document.getElementById("video-list");
const nameInput = document.querySelector(".name-teacher");
const statusSelect = document.getElementById("course-status");

const editVideoName = document.getElementById("edit-video-title");
const editVideoURL = document.getElementById("edit-video-url");
const createAssignmentModal = document.getElementById(
  "create-assignment-modal"
);
const cancelCreateBtn = document.getElementById("cancel-create");
const assignmentNameInput = document.getElementById("assignment-name");
const assignmentDurationInput = document.getElementById("assignment-duration");
const assignmentDesInput = document.getElementById("assignmentDes-detail");
const assignmentTypeInput = document.getElementById("assignment-type");
const assignmentDateInput = document.getElementById("assignment-date");
const courseNameInput = document.getElementById("course-name");

// ========================== THEEM VIDEO ==========================
const addVideoBtn = document.getElementById("add-video-btn");
const addVideoModal = document.getElementById("add-video-modal");
const cancelVideoBtn = document.getElementById("cancel-video");
let course = null;
let videos = [];
// ========================== LOAD COURSE DETAIL ==========================
async function loadCourseDetail() {
  try {
    const res = await fetch(
      `https://localhost:7057/teacher/get-course-by-id/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Không lấy được chi tiết khóa học");

    const data = await res.json();
    course = data[0]; //  QUAN TRỌNG
    renderCourse();
  } catch (err) {
    console.error(err);
    alert("Lỗi tải chi tiết khóa học");
  }
}

// ========================== RENDER COURSE ==========================
function renderCourse() {
  nameInput.textContent = currentUser || "Giảng viên";
  titleInput.value = course.courseName;
  typeSelect.value = course.courseType;
  dateInput.value = course.courseDate;
  courseDetail.value = course.courseDes || "";
  priceInput.value = course.coursePrice || 0;
  statusSelect.value = course.courseStatus;
}

// ========================== LOAD VIDEO COURSE ==========================

async function loadVideoCourse() {
  try {
    const res = await fetch(
      `https://localhost:7057/teacherCourseVideo/get-all-video/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("STATUS:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error("API ERROR:", errText);
      throw new Error("Không lấy được video khóa học");
    }

    const data = await res.json();
    console.log("VIDEO DATA:", data);

    videos = data;
    renderVideos();
  } catch (err) {
    console.error("FETCH VIDEO ERROR:", err);
    alert("Lỗi tải video khóa học");
  }
}

// ========================== RENDER VIDEO ==========================
async function renderVideos() {
  videoListEl.innerHTML = "";

  if (!videos || videos.length === 0) {
    videoListEl.innerHTML = "<p>Chưa có video</p>";
    return;
  }

  for (const video of videos) {
    const assignmentInfo = await checkAssignment(video.videoID);

    const div = document.createElement("div");
    div.className = "video-item";

    const assignmentBtn = assignmentInfo.hasAssignment
      ? `<button type="button" class="edit-assignment-btn btn-action-js">Sửa bài tập</button>`
      : `<button type="button" class="create-assignment-btn btn-action-js">Tạo bài tập</button>`;

    div.innerHTML = `
      <p><strong>${video.videoName}</strong></p>
      <a href="${video.videoURL}" target="_blank">Video bài giảng</a>

      <div class="video-actions">
        <button type="button" class="edit-video-btn">Sửa video</button>
        ${assignmentBtn}
        <button type="button" class="delete-video-btn">Xóa video</button>
      </div>
    `;

    // ===== VIDEO =====
    div.querySelector(".edit-video-btn").onclick = () =>
      openEditVideoModal(video);

    div.querySelector(".delete-video-btn").onclick = () =>
      deleteVideo(video.videoID);

    // ===== ASSIGNMENT =====
    if (assignmentInfo.hasAssignment) {
      // ===== EDIT =====
      div.querySelector(".edit-assignment-btn").onclick = () => {
        localStorage.setItem(
          "editingAssignmentId",
          assignmentInfo.assignmentID
        );
        localStorage.setItem("videoID", video.videoID);
        window.location.href = "./create-homework.html";
      };
    } else {
      // ===== CREATE =====
      div.querySelector(".create-assignment-btn").onclick = () => {
        localStorage.setItem("videoID", video.videoID);

        // set sẵn dữ liệu cho form
        document.getElementById("course-name").value = course.courseName;
        document.getElementById("assignment-date").value = new Date()
          .toISOString()
          .split("T")[0];

        // reset các field còn lại
        assignmentNameInput.value = "";
        assignmentDurationInput.value = "";
        assignmentDesInput.value = "";

        createAssignmentModal.style.display = "flex";
      };
    }

    videoListEl.appendChild(div);
  }
}
document.getElementById("cancel-create").onclick = () => {
  createAssignmentModal.style.display = "none";
};

document
  .getElementById("create-course-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const videoID = Number(localStorage.getItem("videoID"));

    const body = {
      videoID: videoID,
      assignmentName: assignmentNameInput.value.trim(),
      assignmentCourse: course.courseName,
      assignmentType: assignmentTypeInput.value,
      assignmentDeadline: document.getElementById("assignment-date").value,
      assignmentDuration: Number(assignmentDurationInput.value || 0),
      assginmentDes: assignmentDesInput.value.trim(),
      assignmentStatus: "completed",
    };

    try {
      const res = await fetch(
        "https://localhost:7057/teacherAssignmentVideo/create-assignment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      alert("Tạo bài tập thành công");
      createAssignmentModal.style.display = "none";
      loadVideoCourse(); // reload lại danh sách video
    } catch (err) {
      console.error(err);
      alert("Tạo bài tập thất bại");
    }
  });

// ========================== ADD VIDEO ==========================

addVideoBtn.onclick = (e) => {
  e.preventDefault();
  addVideoModal.style.display = "flex";
};

cancelVideoBtn.onclick = () => {
  addVideoModal.style.display = "none";
};

document.getElementById("add-video-form").onsubmit = async (e) => {
  e.preventDefault();

  const videoName = document.getElementById("video-title").value.trim();
  const videoURL = document.getElementById("video-url").value.trim();

  if (!videoName || !videoURL) {
    alert("Vui lòng nhập đầy đủ thông tin video");
    return;
  }

  const body = {
    courseID: courseId,
    videoName: videoName,
    videoURL: videoURL,
    videoProgress: "incomplete",
  };

  try {
    const res = await fetch(
      "https://localhost:7057/teacherCourseVideo/create-new-video",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("ADD VIDEO ERROR:", err);
      alert("Thêm video thất bại");
      return;
    }

    // ✅ Reset + đóng modal
    document.getElementById("add-video-form").reset();
    addVideoModal.style.display = "none";

    // ✅ Load lại danh sách video
    loadVideoCourse();
  } catch (err) {
    console.error(err);
    alert("Lỗi khi thêm video");
  }
};

// ========================== EDIT VIDEO ==========================
let editingVideoId = null;

function openEditVideoModal(video) {
  editingVideoId = video.videoID;

  document.getElementById("edit-video-title").value = video.videoName;
  document.getElementById("edit-video-url").value = video.videoURL;

  document.getElementById("edit-video-modal").style.display = "flex";
}

document.getElementById("edit-video-form").onsubmit = async (e) => {
  e.preventDefault();

  const body = {
    videoID: editingVideoId,
    courseID: courseId,
    videoName: editVideoName.value.trim(),
    videoURL: editVideoURL.value.trim(),
    videoProgress: "incomplete",
  };

  const res = await fetch(
    `https://localhost:7057/teacherCourseVideo/update-video`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    alert("Sửa video thất bại");
    return;
  }

  document.getElementById("edit-video-modal").style.display = "none";
  loadVideoCourse();
};

// ========================== DELETE VIDEO ==========================
async function deleteVideo(videoID) {
  if (!confirm("Bạn có chắc muốn xóa video này?")) return;

  const res = await fetch(
    `https://localhost:7057/teacherCourseVideo/delete-video/${videoID}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    alert("Xóa video thất bại");
    return;
  }

  alert("Đã xóa video");
  loadVideoCourse();
}

// ========================== SAVE COURSE ==========================
document.getElementById("save-course").onclick = async () => {
  try {
    // ===== FIX LỖI DECIMAL =====
    const rawPrice = priceInput.value.trim();

    if (rawPrice === "" || isNaN(rawPrice)) {
      alert("Giá khóa học không hợp lệ");
      return;
    }

    const price = parseFloat(rawPrice);

    const body = {
      courseID: Number(courseId),
      courseName: titleInput.value.trim(),
      courseType: typeSelect.value,
      courseDes: courseDetail.value.trim(),
      courseDate: dateInput.value, // yyyy-MM-dd
      coursePrice: Number(price.toFixed(3)), // 🔥 FIX 8114
      courseStatus: statusSelect.value,
      courseImage: course.courseImage ?? null,
    };

    // console.log("BODY SEND:", body);

    const res = await fetch(
      `https://localhost:7057/teacher/update-course/${courseId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    alert("Lưu thành công!");
    window.location.href = "manage-course.html";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// ========================== CANCEL ==========================
document.getElementById("cancel-course").onclick = () => {
  setTimeout(() => {
    window.location.href = "../Teacher/manage-course.html";
  }, 10);
};

document.getElementById("cancel-edit-video").onclick = () => {
  document.getElementById("edit-video-modal").style.display = "none";
};
// =========================== CHECK ASSIGNMENT ==========================
async function checkAssignment(videoID) {
  try {
    const res = await fetch(
      `https://localhost:7057/teacherAssignmentVideo/get-all-assignment/${videoID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) return { hasAssignment: false };

    const data = await res.json();

    if (!data || data.length === 0) {
      return { hasAssignment: false };
    }

    //  mỗi video chỉ có 1 assignment
    return {
      hasAssignment: true,
      assignmentID: data[0].assignmentID,
      assignment: data[0], // optional
    };
  } catch (err) {
    console.error(err);
    return { hasAssignment: false };
  }
}

// ========================== START ==========================
loadCourseDetail();
loadVideoCourse();
