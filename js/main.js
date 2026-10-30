document.addEventListener("DOMContentLoaded", function() {
    const accordionButtons = document.querySelectorAll('.accordion-btn, .level-btn');

    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');

            const content = this.nextElementSibling;
            if (content) {
                content.classList.toggle('show');
            }
        });
    });

    const timeLimitSelect = document.getElementById('time-limit');
    const customTimeInput = document.getElementById('custom-time');

    if (timeLimitSelect && customTimeInput) {
        timeLimitSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customTimeInput.classList.remove('hidden');
                customTimeInput.focus();
            } else {
                customTimeInput.classList.add('hidden');
                customTimeInput.value = '';
            }
        });
    }

    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
        });
    }
});