document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggleFilter");
    const overlay = document.getElementById("filterOverlay");
    const closeBtn = document.getElementById("closeFilter");

    toggleBtn.addEventListener("click", () => {
        overlay.style.display = "flex"; // hiện overlay
    });

    closeBtn.addEventListener("click", () => {
        overlay.style.display = "none"; // ẩn overlay
    });
});
