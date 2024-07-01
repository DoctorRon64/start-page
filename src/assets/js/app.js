document.addEventListener('DOMContentLoaded', () => {
    fetch('/json/links.json')
        .then(response => response.json())
        .then(data => {
            let htmlContent = '';
            data.sections.forEach(section => {
                htmlContent += `<h2>${section.name}</h2>`;
                section.links.forEach(link => {
                    htmlContent += returnHTML(link);
                });
            });

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
            <iconify-icon icon="${link.icon}" width="24" height="24" style="transform: translateY(0px);"></iconify-icon>
            <span>${link.name}</span>
        </a>
    `;
}