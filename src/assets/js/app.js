document.addEventListener('DOMContentLoaded', async function () {
    async function loadJSONResource(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    }
    
    function createLinkHTML(link) {
        return `
                    <a href="${link.url}" class="link" style="color: ${link.color}" data-hover="${link.hoverText}" data-hover-color="${link.hoverColor}">
                        ${link.name}
                    </a>
                `;
    }

    function createSectionHTML(section) {
        const linksHTML = section.links.map(createLinkHTML).join('');
        return `
                    <div class="section" style="background-color: ${section.color}">
                        <h2 class="section-title">${section.section}</h2>
                        ${linksHTML}
                    </div>
                `;
    }

    async function fetchLinks() {
        const linksData = await loadJSONResource('links.json');
        const linksContainer = document.getElementById('links');
        const sectionsHTML = linksData.map(createSectionHTML).join('');
        linksContainer.innerHTML = sectionsHTML;

        // Add event listeners for hover colors
        document.querySelectorAll('.link').forEach(link => {
            const originalColor = link.style.color;
            link.addEventListener('mouseover', () => {
                link.style.color = link.getAttribute('data-hover-color');
            });
            link.addEventListener('mouseout', () => {
                link.style.color = originalColor;
            });
        });
    }

    fetchLinks();

    // Search functionality
    document.getElementById('search').addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        document.querySelectorAll('.section').forEach(section => {
            let sectionVisible = false;
            section.querySelectorAll('.link').forEach(link => {
                if (link.textContent.toLowerCase().includes(searchValue)) {
                    link.style.display = 'block';
                    sectionVisible = true;
                } else {
                    link.style.display = 'none';
                }
            });
            section.style.display = sectionVisible ? 'block' : 'none';
        });
    });
});