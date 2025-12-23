const searchBox = document.getElementById("searchBox");
const searchInput = searchBox.querySelector("input");
const searchIcon = document.getElementById("searchIcon");
const resultsContainer = document.getElementById("search-results-container");
const searchWrapper = document.querySelector(".header-search");
const searchResults = document.querySelector(".header-search-results");

let searchOpened = false;

searchResults.style.display = "none";

searchIcon.addEventListener("click", function () {
  if (!searchOpened) {
    searchWrapper.classList.add("active");
    searchInput.focus();
    searchOpened = true;
  } else {
    window.location.href = "/search";
  }
});

searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase().trim();
  resultsContainer.innerHTML = "";

  if (keyword === "") {
    searchResults.style.display = "none";
    return;
  }

  const filtered = ["a", "b", "c", "d", "e"].filter(item =>
    item.toLowerCase().includes(keyword)
  );

  if (filtered.length > 0) {
    searchResults.style.display = "block";
    filtered.forEach(item => {
      const div = document.createElement("div");
      div.className = "header-search-results-item";
      div.textContent = item;
      resultsContainer.appendChild(div);
    });
  } else {
    searchResults.style.display = "none";
  }
});

document.addEventListener("click", function (e) {
  const isClickInside = searchWrapper.contains(e.target);
  if (!isClickInside) {
    searchWrapper.classList.remove("active");
    searchResults.style.display = "none";
    searchOpened = false;
  }
});

function setupDropdownHover(containerId) {
  const container = document.getElementById(containerId);
  let timeout;

  container.addEventListener('mouseenter', () => {
    clearTimeout(timeout);
    container.classList.add('active');
  });

  container.addEventListener('mouseleave', () => {
    timeout = setTimeout(() => {
      container.classList.remove('active');
    }, 150); // giữ menu mở thêm 300ms
  });
}

// Kích hoạt cho cả user và notification
setupDropdownHover('userContainer');
setupDropdownHover('notificationContainer');

document.getElementById("burgerToggle").addEventListener("click", function () {
  const menu = document.getElementById("burgerMenu");
  menu.classList.toggle("active");
});
  



