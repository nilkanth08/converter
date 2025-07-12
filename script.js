document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav a');

    function showSection(id) {
        sections.forEach(section => {
            if (section.id === id) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Show the first section by default
    if (sections.length > 0) {
        showSection(sections[0].id);
    }
});
