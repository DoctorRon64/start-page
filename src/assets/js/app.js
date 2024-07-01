document.addEventListener('DOMContentLoaded', () => {
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = timeString;
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
    
    
    fetch('/json/links.json')
        .then(response => response.json())
        .then(data => {
            let htmlContent = '<div class="sections-container">';
            data.sections.forEach(section => {
                htmlContent += `<div class="section"><h2>${section.name}</h2>`;
                section.links.forEach(link => {
                    htmlContent += returnHTML(link);
                });
                htmlContent += '</div>';
            });
            htmlContent += '</div>';

            document.getElementById('links').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error fetching the JSON data:', error);
        });

    const searchBar = document.getElementById('search');
    searchBar.value = '';
    searchBar.focus();
    searchBar.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const query = searchBar.value.trim(); // trim() to remove leading/trailing whitespace
            if (query) {
                const searchUrl = `https://duckduckgo.com/?t=h_&q=${encodeURIComponent(query)}`;
                window.location.href = searchUrl;
            }
        }
    });
});

function returnHTML(link) {
    return `
        <a href="${link.url}" title="${link.hovertext}" class="link">
            <iconify-icon icon="${link.icon}" width="24" height="24" style="transform: translateY(0px); margin: 3px;"></iconify-icon>    
            <span>${link.name}</span>
        </a>
    `;
}
