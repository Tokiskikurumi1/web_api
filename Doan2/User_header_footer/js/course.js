// ========================== LOAD DATA TỪ MANAGE COURSE ==========================
let courses = JSON.parse(localStorage.getItem("courses")) || [];

// ========================== KHAI BÁO PHẦN TỬ ==========================
const btnMenuIcon = document.getElementById("menu-icon");
const Categorys = document.querySelector(".categorys");
const li_cate = document.querySelectorAll(".categorys ul li");
const searchInput = document.querySelector(".search input");
const listCourse = document.querySelector(".list-course");
const btnSearch = document.querySelector(".search button");

// ==================== TOGGLE MENU ==========================
btnMenuIcon.addEventListener("click", () => {
  Categorys.classList.toggle("active");
});

// ================== BẤM DANH MỤC ===========================
li_cate.forEach((item) => {
  item.addEventListener("click", () => {
    li_cate.forEach((el) => el.classList.remove("active"));
    item.classList.add("active");

    const type = item.getAttribute("data-type");
    updateCourse(type);
  });
});

// ================== HÀM RENDER KHÓA HỌC ===========================
function updateCourse(type = "ALL") {
  listCourse.innerHTML = "";

  let filteredCourses =
    type === "ALL"
      ? courses
      : courses.filter((c) => String(c.type).toUpperCase() === type);

  if (filteredCourses.length === 0) {
    listCourse.style.display = "block";
    listCourse.innerHTML = "<p>Không có khóa học nào trong danh mục này.</p>";
    return;
  }

  listCourse.style.display = "grid";

  filteredCourses.forEach((course) => {
    const courseImg =
      course.image_url || "../img/image_course/image-course.png"; // LẤY ẢNH TỪ LOCALSTORAGE

    listCourse.innerHTML += `
      <div class="item-course" data-id="${course.id}">
        <div class="item-course-panel">
          <div class="image-course">
            <img src="${courseImg}" alt="${course.name}" />
          </div>

          <div class="course-info">
            <div class="name-course">${course.name}</div>

            <div class="course-tag" style="display:none">
              <div class="course-tag-item">
                <i class="fa-solid fa-play"></i> <span>Video</span>
              </div>
            </div>

            <hr />

            <div class="course-price">
              <div class="price">${Number(
                course.price
              ).toLocaleString()} VND</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  addCourseClickEvents();
}

// ===================== CLICK CHI TIẾT KHÓA HỌC ===========================
function addCourseClickEvents() {
  const courseItems = document.querySelectorAll(".item-course");

  courseItems.forEach((item) => {
    item.addEventListener("click", () => {
      const id = parseInt(item.getAttribute("data-id"));
      const selected = courses.find((c) => c.id === id);

      if (selected) {
        localStorage.setItem("selectedCourse", JSON.stringify(selected));
        window.location.href = "course-detail.html";
      }
    });
  });
}

// ============================ TÌM KIẾM ============================
btnSearch.addEventListener("click", () => {
  const searchText = searchInput.value.trim().toLowerCase();
  listCourse.innerHTML = "";

  const filtered = courses.filter((course) =>
    course.name.toLowerCase().includes(searchText)
  );

  if (filtered.length === 0) {
    listCourse.style.display = "block";
    listCourse.innerHTML = "<p>Không có khóa học nào phù hợp.</p>";
    return;
  } else {
    listCourse.style.display = "grid";
  }

  filtered.forEach((course) => {
    const courseImg = course.image_url || "./img/course.png"; // LẤY ẢNH TỪ LOCALSTORAGE

    listCourse.innerHTML += `
      <div class="item-course" data-id="${course.id}">
        <div class="item-course-panel">
          <div class="image-course">
            <img src="${courseImg}" alt="${course.name}" />
          </div>

          <div class="course-info">
            <div class="name-course">${course.name}</div>

            <hr />

            <div class="course-price">
              <div class="price">${Number(
                course.price
              ).toLocaleString()} VND</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  addCourseClickEvents();
});

// ========================== LOAD LÚC ĐẦU ==========================
updateCourse("ALL");
