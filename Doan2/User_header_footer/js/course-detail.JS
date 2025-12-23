(() => {
  // ========================== HELPERS ==========================
  const $ = (sel) => document.querySelector(sel);
  const $all = (sel) => Array.from(document.querySelectorAll(sel));

  function isLoggedIn() {
    return !!localStorage.getItem("savedUsername");
  }

  function formatPriceRaw(v) {
    const n = Number(v);
    if (!v && v !== 0) return null;
    if (Number.isNaN(n)) return v; // nếu là string text khác
    if (n === 0) return "Miễn phí";
    return n.toLocaleString("vi-VN") + " đ";
  }

  // ========================== SELECTORS ==========================
  const titleEl = $(".title");
  const imgContainer = $(".img");
  const ratingEl = $(".rating");
  const reviewsEl = $(".reviews");
  const studentsEl = $(".students");

  const priceEl = $(".info-price .price");
  const payBtn = document.querySelector(".info-price button") || $("#btnwhite");

  const descEl = $(".info-description p");
  const instructorNameEl = $(".info-instructor .name");
  const levelEl = $(".info-level .level");
  const timeEl = $(".info-duration .time");

  const curriculumContainer = $(".info-curriculum"); // wrapper
  const curriculumListEl = $(".info-curriculum ul");

  // ========================== LOAD COURSE FROM localStorage ==========================
  const raw = localStorage.getItem("selectedCourse");
  if (!raw) {
    console.warn(
      "Không có dữ liệu khóa học trong localStorage (key: selectedCourse)."
    );
    // Optionally show message to user
    if (titleEl) titleEl.textContent = "Không tìm thấy khóa học";
    if (imgContainer) imgContainer.innerHTML = "";
    if (priceEl) priceEl.textContent = "";
    if (descEl) descEl.textContent = "Không có mô tả.";
    // stop here
    return;
  }

  let course;
  try {
    course = JSON.parse(raw);
  } catch (err) {
    console.error("selectedCourse không parse được JSON:", err);
    return;
  }

  // ========================== POPULATE UI ==========================
  // Title
  if (titleEl) titleEl.textContent = course.name || "Tên khóa học";

  // Image (use course.image, course.image_url, or a default)
  const imgSrc = course.image_url || "../img/image_course/image-course.png";
  if (imgContainer) {
    imgContainer.innerHTML = `<img src="${imgSrc}" alt="${(
      course.name || "Khóa học"
    ).replace(/"/g, "")}" />`;
  }

  // Rating & reviews & students (if any)
  if (ratingEl) ratingEl.textContent = (course.rating ?? 0).toFixed(1);
  if (reviewsEl) reviewsEl.textContent = `(${course.reviews ?? 0} đánh giá)`;
  if (studentsEl) studentsEl.textContent = Number(course.students ?? 0);

  // Price
  const prettyPrice = formatPriceRaw(course.price);
  if (priceEl) priceEl.textContent = prettyPrice ?? "Liên hệ";

  // Description
  if (descEl)
    descEl.textContent =
      course.description || "Chưa có mô tả cho khóa học này.";

  // Instructor
  // prefer course.instructor, fallback to savedUsername, fallback text
  const savedUser = localStorage.getItem("savedUsername");
  const instructorName =
    course.instructor ||
    (savedUser ? `GV. ${savedUser}` : "Giảng viên: Đang cập nhật");
  if (instructorNameEl) instructorNameEl.textContent = instructorName;

  // Level / Duration
  if (levelEl) levelEl.textContent = course.level || "Tất cả trình độ";
  if (timeEl)
    timeEl.textContent = course.duration || "Tùy theo tiến độ học viên";

  // ========================== CURRICULUM (video list) ==========================
  function renderCurriculum() {
    if (!curriculumListEl) return;
    curriculumListEl.innerHTML = "";

    const videos = Array.isArray(course.videos) ? course.videos : [];
    if (videos.length === 0) {
      // show placeholder item(s)
      curriculumListEl.innerHTML = `<li><em>Chưa có bài giảng nào.</em></li>`;
      return;
    }

    videos.forEach((v, idx) => {
      // v: { id, title, url }
      const li = document.createElement("li");
      li.className = "info-curriculum-item";
      // allow clicking to open the video url (in new tab) if url present
      const titleText = v.title || `Bài ${idx + 1}`;
      const safeUrl = v.url || "";
      li.innerHTML = `
        <span class="lesson">${idx + 1}</span>
        <span class="title"><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${titleText}</a></span>
      `;
      curriculumListEl.appendChild(li);
    });
  }

  renderCurriculum();

  // ========================== PAYMENT / REGISTER BUTTON ==========================
  if (payBtn) {
    payBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (!isLoggedIn()) {
        alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.");
        // save where user wanted to go
        localStorage.setItem(
          "afterLoginRedirect",
          window.location.pathname + window.location.search
        );
        window.location.href = "login.html"; // sửa đường dẫn login nếu khác
        return;
      }

      localStorage.setItem("checkoutCourse", JSON.stringify(course));
      // chuyển sang trang thanh toán (thay đổi đường dẫn nếu bạn có trang khác)
      window.location.href = "checkout.html";
    });
  }
})();
