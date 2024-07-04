document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    fetchLinks();

    initSearch();

    fetchWeatherData();
});

function updateClock() {
    const clockElement = document.getElementById('clock');
    let date = new Date();
    clockElement.innerHTML = date.toLocaleTimeString();
}

function fetchLinks() {
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
}

function returnHTML(link) {
    return `
        <a href="${link.url}" title="${link.hovertext}" class="link">
            <iconify-icon icon="${link.icon}" class="textIcons"></iconify-icon>    
            <span>${link.name}</span>
        </a>
    `;
}

function initSearch() {
    const searchBar = document.getElementById('search');
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownContent = document.getElementById('dropdown-content');
    let selectedSearchEngine = 'https://duckduckgo.com/?q=';

    searchBar.value = '';
    searchBar.focus();

    dropdownButton.addEventListener('click', () => {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (event) => {
            selectedSearchEngine = item.getAttribute('data-url');
            dropdownButton.innerHTML = item.innerHTML + '<iconify-icon icon="uiw:caret-down"></iconify-icon>';
            dropdownContent.style.display = 'none';

            if (selectedSearchEngine === 'https://duckduckgo.com/?q=') {
                searchBar.placeholder = 'Searching on DuckDuckGo...';
            } else if (selectedSearchEngine === 'https://www.google.com/search?q=') {
                searchBar.placeholder = 'Searching on Google...';
            } else if (selectedSearchEngine === 'https://www.bing.com/search?q=') {
                searchBar.placeholder = 'Searching on Bing...';
            }
        });
    });

    searchBar.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const query = searchBar.value.trim();
            if (query) {
                const searchUrl = `${selectedSearchEngine}${encodeURIComponent(query)}`;
                window.location.href = searchUrl;
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchBar.contains(event.target) && !dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            setTimeout(() => searchBar.focus(), 100);
        }
    });

    window.onclick = function(event) {
        if (!event.target.matches('.dropdown-button')) {
            dropdownContent.style.display = 'none';
        }
    };
}

function fetchWeatherData() {
    const apiKey = '1c70c9d071434cc9884212912240207';
    const weatherWidget = document.getElementById('weather-widget');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    updateWeatherWidget(data);
                })
                .catch(error => {
                    weatherWidget.innerHTML = '<p>Error fetching weather data.</p>';
                    console.error('Error fetching the weather data:', error);
                });
        }, error => {
            weatherWidget.innerHTML = '<p>Unable to retrieve your location.</p>';
            console.error('Error getting the location:', error);
        });
    } else {
        weatherWidget.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
}

function updateWeatherWidget(data) {
    const weatherWidget = document.getElementById('weather-widget');
    const temperature = data.current.temp_c;
    const condition = data.current.condition.text;
    const icon = data.current.condition.icon;

    weatherWidget.innerHTML = `
        <p class="temperature">${temperature}°C</p>
        <p class="condition">${condition}</p>
        <img src="${icon}" alt="${condition}">
    `;
}
