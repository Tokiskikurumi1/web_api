// ========================== KEY LOCALSTORAGE ==========================
const POSTS_KEY = "community_posts";

// ========================== LẤY DỮ LIỆU TỪ LOCAL (nếu có) ==========================
let posts = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
if (posts.length === 0) {
  // Dữ liệu mẫu lần đầu
  posts = [
    {
      id: 1,
      author: "Lan",
      avt: "L",
      time: "2 giờ trước",
      cat: "Ngữ pháp",
      content:
        "Cách sử dụng thì Hiện tại đơn và ví dụ cụ thể: I eat, he eats...",
      likes: 0,
      comments: 0,
      _liked: false,
    },
    {
      id: 2,
      author: "Minh",
      avt: "M",
      time: "1 ngày trước",
      cat: "TT",
      content:
        "500 từ vựng cơ bản cho người mới bắt đầu: apple, book, chair...",
      likes: 0,
      comments: 0,
      _liked: false,
    },
    {
      id: 3,
      author: "Hương",
      avt: "H",
      time: "3 ngày trước",
      cat: "Trang cá nhân",
      content: "Mẹo luyện nghe mỗi ngày: nghe podcast, chép chính tả...",
      likes: 0,
      comments: 0,
      _liked: false,
    },
  ];
}

// ========================== LƯU POSTS VÀO LOCALSTORAGE ==========================
function savePosts() {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// ========================== BIẾN TOÀN CỤC ==========================
const postList = document.getElementById("postList");
const postModal = document.getElementById("postModal");
const modalMeta = document.getElementById("modalMeta");
const modalContent = document.getElementById("modalContent");
const commentsEl = document.getElementById("comments");
const commentInput = document.getElementById("commentInput");
const closeModal = document.getElementById("closeModal");
const newPostBtn = document.getElementById("newPostBtn");
const newPostModal = document.getElementById("newPostModal");
const closeNewPost = document.getElementById("closeNewPost");
const createPost = document.getElementById("createPost");
const categories = document.querySelectorAll(".cat");
const searchInput = document.getElementById("searchInput");
const postImageInput = document.getElementById("postImage");
const imagePreview = document.getElementById("imagePreview");
const avatarElements = document.querySelector(".actions .avatar");
const generalBtn = document.getElementById("generalBtn");
const imgSearch = document.querySelector(".img-search");
const profileSection = document.getElementById("profileSection");

let currentFilter = "Tổng hợp";
let currentPost = null;
let commentsMap = {}; // postId → mảng bình luận (cũng sẽ lưu sau nếu cần)
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
  name: "Bạn",
};

// ========================== KIỂM TRA ĐĂNG NHẬP ==========================
function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

// ========================== LẤY TÊN + AVATAR HIỆN TẠI ==========================
function getCurrentUserInfo() {
  const name = currentUser.name || "Bạn";
  const avt = name.charAt(0).toUpperCase();
  return { name, avt };
}

// ========================== HIỂN THỊ AVATAR TRÊN HEADER ==========================
function renderIconNames() {
  if (!isLoggedIn()) {
    if (avatarElements) avatarElements.textContent = "?";
    return;
  }
  if (avatarElements) avatarElements.textContent = getCurrentUserInfo().avt;
}
renderIconNames();

// ========================== CẬP NHẬT TÊN TRONG FORM TẠO BÀI ==========================
function updateCreatePostAvatar() {
  const box = document.querySelector(".avt_create");
  if (box && isLoggedIn()) {
    const info = getCurrentUserInfo();
    box.querySelector(".c-avatar").textContent = info.avt;
    box.querySelector(".meta").textContent = info.name;
  }
}
updateCreatePostAvatar();

// ========================== HIỂN THỊ DANH SÁCH ==========================
function renderList() {
  if (!isLoggedIn()) {
    postList.innerHTML = `<div style="padding:40px;text-align:center;color:#6b7280;font-size:18px;">
      Vui lòng <a href="../User_header_footer/login.html" style="color:#2563eb;">đăng nhập</a> để xem các bài viết.
    </div>`;
    return;
  }

  postList.innerHTML = "";
  const q = (searchInput.value || "").toLowerCase();
  const filtered = posts.filter(
    (p) =>
      (p.content || "").toLowerCase().includes(q) ||
      (p.author || "").toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    postList.innerHTML =
      '<div style="padding:20px;color:#6b7280;text-align:center;">Không tìm thấy bài viết nào.</div>';
    return;
  }

  filtered.forEach((p) => {
    const el = document.createElement("div");
    el.className = "post";
    el.innerHTML = `
      <div class="top-content">
        <div class="left">
          <div class="avt-name-title">
            <div class="c-avatar">${p.avt || "U"}</div>
            <div class="meta">Bởi ${p.author} • ${p.time}</div>
          </div>
          <div class="title">${p.content}</div>
          ${p.image ? `<img src="${p.image}" class="post-image" />` : ""}
        </div>
      </div>
      <div class="icons-action">
        <div class="icon-card heart-card">
          <i class="fa-solid fa-heart" style="color:${
            p._liked ? "red" : ""
          }"></i>
          <p class="count-heart">${p.likes || 0}</p>
        </div>
        <div class="icon-card message-card">
          <i class="fa-solid fa-message"></i>
          <p class="count-message">${p.comments || 0}</p>
        </div>
      </div>
    `;

    el.addEventListener("click", (e) => {
      if (e.target.closest(".icon-card")) return;
      openPost(p.id);
    });

    // Like
    el.querySelector(".heart-card").addEventListener("click", (e) => {
      e.stopPropagation();
      p._liked = !p._liked;
      p.likes += p._liked ? 1 : -1;
      savePosts();
      renderList();
    });

    // Comment icon
    el.querySelector(".message-card").addEventListener("click", (e) => {
      e.stopPropagation();
      openPost(p.id);
    });

    postList.appendChild(el);
  });
}

// ========================== TRANG CÁ NHÂN ==========================
function renderMyPosts() {
  if (!isLoggedIn()) return;

  const info = getCurrentUserInfo();
  profileSection.innerHTML = `
    <div class="c-avatar" style="width:80px;height:80px;font-size:30px;margin:0 auto;background:#2563eb;color:white;display:flex;align-items:center;justify-content:center;border-radius:50%">
      ${info.avt}
    </div>
    <h3 style="margin-top:10px">${info.name}</h3>
    <p style="color:gray">Bài viết của tôi</p>
  `;

  postList.innerHTML = "";
  const q = (searchInput.value || "").toLowerCase();
  const myPosts = posts.filter(
    (p) =>
      p.cat === "Trang cá nhân" &&
      p.author === info.name &&
      (p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q))
  );

  if (myPosts.length === 0) {
    postList.innerHTML =
      '<div style="padding:20px;color:#6b7280;text-align:center;">Bạn chưa đăng bài nào.</div>';
    return;
  }

  myPosts.forEach((p) => renderSinglePost(p));
}

function renderSinglePost(p) {
  const el = document.createElement("div");
  el.className = "post";
  el.innerHTML = `
    <div class="top-content">
      <div class="left">
        <div class="avt-name-title">
          <div class="c-avatar">${p.avt}</div>
          <div class="meta">Bởi ${p.author} • ${p.time}</div>
        </div>
        <div class="title">${p.content}</div>
        ${p.image ? `<img src="${p.image}" class="post-image" />` : ""}
      </div>
    </div>
    <div class="icons-action">
      <div class="icon-card heart-card" data-id="${p.id}">
        <i class="fa-solid fa-heart" style="color:${p._liked ? "red" : ""}"></i>
        <p class="count-heart">${p.likes || 0}</p>
      </div>
      <div class="icon-card message-card" data-id="${p.id}">
        <i class="fa-solid fa-message"></i>
        <p class="count-message">${p.comments || 0}</p>
      </div>
    </div>
  `;

  el.addEventListener("click", () => openPost(p.id));
  el.querySelector(".heart-card").addEventListener("click", (e) => {
    e.stopPropagation();
    const post = posts.find((x) => x.id === p.id);
    post._liked = !post._liked;
    post.likes += post._liked ? 1 : -1;
    savePosts();
    renderMyPosts();
  });
  el.querySelector(".message-card").addEventListener("click", (e) => {
    e.stopPropagation();
    openPost(p.id);
  });

  postList.appendChild(el);
}

// ========================== MỞ BÀI CHI TIẾT ==========================
function openPost(id) {
  const p = posts.find((x) => x.id === id);
  if (!p) return;
  currentPost = p;

  modalMeta.innerHTML = `
    <div class="avt-name-title">
      <div class="c-avatar">${p.avt}</div>
      <div class="meta">Bởi ${p.author} • ${p.time}</div>
    </div>
  `;
  modalContent.innerHTML = `
    <div class="text-content">${p.content}</div>
    ${p.image ? `<img src="${p.image}" class="post-image" />` : ""}
  `;

  renderComments();
  postModal.setAttribute("aria-hidden", "false");
}

function closeModalFn() {
  postModal.setAttribute("aria-hidden", "true");
}
closeModal.addEventListener("click", closeModalFn);
postModal.addEventListener(
  "click",
  (e) => e.target === postModal && closeModalFn()
);

// ========================== BÌNH LUẬN ==========================
function renderComments() {
  commentsEl.innerHTML = "";
  const arr = commentsMap[currentPost.id] || [];
  if (arr.length === 0) {
    commentsEl.innerHTML =
      '<div style="color:#6b7280;padding:8px 0">Chưa có bình luận</div>';
    return;
  }
  arr.forEach((c) => {
    const el = document.createElement("div");
    el.className = "comment";
    el.innerHTML = `
      <div class="c-avatar">${c.avt}</div>
      <div class="c-body">
        <strong>${c.name}</strong>
        <div class="c-meta">${c.time}</div>
        <div>${c.text}</div>
      </div>
    `;
    commentsEl.appendChild(el);
  });
}

document.getElementById("sendComment")?.addEventListener("click", () => {
  const txt = commentInput.value.trim();
  if (!txt) return alert("Hãy nhập bình luận!");

  const info = getCurrentUserInfo();
  const arr = commentsMap[currentPost.id] || [];
  arr.push({ name: info.name, avt: info.avt, time: "vừa xong", text: txt });
  commentsMap[currentPost.id] = arr;

  currentPost.comments = arr.length;
  savePosts();
  commentInput.value = "";
  renderComments();

  if (currentFilter === "Trang cá nhân") renderMyPosts();
  else renderList();
});

// ========================== TẠO BÀI MỚI ==========================
newPostBtn.addEventListener("click", () => {
  if (!isLoggedIn()) return alert("Bạn cần đăng nhập để đăng bài!");
  newPostModal.setAttribute("aria-hidden", "false");
});
closeNewPost.addEventListener("click", () =>
  newPostModal.setAttribute("aria-hidden", "true")
);
newPostModal.addEventListener(
  "click",
  (e) =>
    e.target === newPostModal &&
    newPostModal.setAttribute("aria-hidden", "true")
);

document
  .querySelector(".btn-choose-img")
  ?.addEventListener("click", () => postImageInput.click());

createPost.addEventListener("click", () => {
  const body = document.getElementById("postBody").value.trim();
  const file = postImageInput.files[0];
  if (!body && !file) return alert("Viết gì đó hoặc thêm ảnh đi bro!");

  const info = getCurrentUserInfo();
  const newId = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

  const addNewPost = (imgBase64 = null) => {
    posts.unshift({
      id: newId,
      author: info.name,
      avt: info.avt,
      time: "vừa xong",
      cat: "Trang cá nhân",
      content: body,
      image: imgBase64,
      likes: 0,
      comments: 0,
      _liked: false,
    });
    savePosts();

    document.getElementById("postBody").value = "";
    postImageInput.value = "";
    imagePreview.src = "";
    imagePreview.style.display = "none";
    newPostModal.setAttribute("aria-hidden", "true");

    if (currentFilter === "Trang cá nhân") renderMyPosts();
    else renderList();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => addNewPost(e.target.result);
    reader.readAsDataURL(file);
  } else {
    addNewPost();
  }
});

// Xem trước ảnh
postImageInput.addEventListener("change", () => {
  const file = postImageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// ========================== CHUYỂN TAB ==========================
categories.forEach((c) => {
  c.addEventListener("click", () => {
    categories.forEach((x) => x.classList.remove("active"));
    c.classList.add("active");
    currentFilter = c.getAttribute("data-cat");

    document.getElementById("panelTitle").textContent =
      currentFilter === "Trang cá nhân" ? "Trang cá nhân" : "Bài viết mới nhất";
    profileSection.style.display =
      currentFilter === "Trang cá nhân" ? "block" : "none";

    if (currentFilter === "Trang cá nhân") renderMyPosts();
    else renderList();
  });
});

// Tìm kiếm
searchInput.addEventListener("input", () => {
  currentFilter === "Trang cá nhân" ? renderMyPosts() : renderList();
});

// Avatar mở trang cá nhân
document.querySelector(".avatar")?.addEventListener("click", () => {
  if (!isLoggedIn()) return alert("Chưa đăng nhập!");
  document.querySelector('[data-cat="Trang cá nhân"]')?.click();
});

// Nút tổng hợp (mobile)
generalBtn?.addEventListener("click", () => {
  if (!isLoggedIn()) return alert("Chưa đăng nhập!");
  document.querySelector('[data-cat="Tổng hợp"]')?.click();
});

// Tìm kiếm icon
imgSearch.addEventListener("click", () => {
  imgSearch.classList.toggle("active");
  searchInput.style.top = imgSearch.classList.contains("active")
    ? "100%"
    : "-200%";
});

// ========================== KHỞI TẠO ==========================
renderList();
