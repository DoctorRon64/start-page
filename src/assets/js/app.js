document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '1c70c9d071434cc9884212912240207'; // Replace 'YOUR_API_KEY' with your actual WeatherAPI key
    const weatherWidget = document.getElementById('weather-widget');

    // Function to fetch weather data
    function fetchWeather(lat, lon) {
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
    }

    // Function to update the weather widget
    function updateWeatherWidget(data) {
        const temperature = data.current.temp_c;
        const condition = data.current.condition.text;
        const icon = data.current.condition.icon;

        weatherWidget.innerHTML = `
            <p class="temperature">${temperature}°C</p>
            <p class="condition">${condition}</p>
            <img src="${icon}" alt="${condition}">
        `;
    }

    // Function to get user's location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeather(lat, lon);
            }, error => {
                weatherWidget.innerHTML = '<p>Unable to retrieve your location.</p>';
                console.error('Error getting the location:', error);
            });
        } else {
            weatherWidget.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
        }
    }

    // Fetch weather data on page load
    getLocation();
});

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
            dropdownButton.innerHTML = item.innerHTML + ' ' + '<iconify-icon icon="bx:bx-caret-down"></iconify-icon>';
            dropdownContent.style.display = 'none';
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

    // Refocus the search bar when the page is clicked, but not when the search bar is clicked
    document.addEventListener('click', (event) => {
        if (!searchBar.contains(event.target) && !dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            setTimeout(() => searchBar.focus(), 100);
        }
    });

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropdown-button')) {
            dropdownContent.style.display = 'none';
        }
    };
});

function returnHTML(link) {
    return `
        <a href="${link.url}" title="${link.hovertext}" class="link">
            <iconify-icon icon="${link.icon}" class="textIcons"></iconify-icon>    
            <span>${link.name}</span>
        </a>
    `;
}
