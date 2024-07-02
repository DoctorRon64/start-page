document.addEventListener('DOMContentLoaded', () => {
    function updateClock() {
        const clockElement = document.getElementById('clock');
        let date = new Date();
        clockElement.innerHTML = date.toLocaleTimeString();
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
            <iconify-icon icon="${link.icon}" class="textIcons""></iconify-icon>    
            <span>${link.name}</span>
        </a>
    `;
}
