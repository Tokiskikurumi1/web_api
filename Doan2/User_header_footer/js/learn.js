const buttons = document.querySelectorAll('.info-nav-btn');
    const contents = document.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // đổi trạng thái nút
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // ẩn/hiện nội dung
            contents.forEach(c => c.classList.remove('active'));
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // ví dụ load dữ liệu từ storage (sau này bạn thêm)
    // const vocabData = JSON.parse(localStorage.getItem("vocabulary")) || [];
    // const exerciseData = JSON.parse(localStorage.getItem("exercise")) || [];