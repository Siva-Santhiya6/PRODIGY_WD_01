document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherContainer = document.getElementById('weather-container');
    const loadingElement = document.getElementById('loading');

    // Replace with your actual OpenWeatherMap API key
    const API_KEY = 'sk-5xUOagbqLL8HtcmKl2h2ZQ';
    
    // Current temperature unit (Celsius by default)
    let currentUnit = 'metric';
    
    // Hide loading initially
    loadingElement.style.display = 'none';

    // Default city
    fetchWeather('New York');

    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    function handleSearch() {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
            cityInput.value = '';
        }
    }

    function fetchWeather(city) {
        loadingElement.style.display = 'block';
        weatherContainer.innerHTML = '';
        weatherContainer.appendChild(loadingElement);

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                showError(error.message);
            })
            .finally(() => {
                loadingElement.style.display = 'none';
            });
    }

    function displayWeather(data) {
        const { name, main, weather, wind, sys, dt } = data;
        const currentDate = new Date(dt * 1000);
        
        const weatherHTML = `
            <div class="weather-content">
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i> ${name}, ${sys.country}
                </div>
                <div class="date-time">
                    ${currentDate.toLocaleDateString()} • ${currentDate.toLocaleTimeString()}
                </div>
                
                <div class="temperature">
                    ${Math.round(main.temp)}${currentUnit === 'metric' ? '°C' : '°F'}
                </div>
                
                <img class="weather-icon" src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png" 
                     alt="${weather[0].description} weather icon showing ${weather[0].main} conditions"
                     onerror="this.onerror=null; this.src='https://placehold.co/120x120/667eea/ffffff?text=Weather+Icon'; this.alt='Weather icon placeholder'">
                
                <div class="description">
                    ${weather[0].description}
                </div>
                
                <div class="unit-toggle">
                    <button class="unit-btn ${currentUnit === 'metric' ? 'active' : ''}" onclick="changeUnit('metric')">
                        °C
                    </button>
                    <button class="unit-btn ${currentUnit === 'imperial' ? 'active' : ''}" onclick="changeUnit('imperial')">
                        °F
                    </button>
                </div>
                
                <div class="weather-details">
                    <div class="detail-item">
                        <i class="fas fa-temperature-high"></i>
                        <div class="detail-label">Feels Like</div>
                        <div class="detail-value">${Math.round(main.feels_like)}${currentUnit === 'metric' ? '°C' : '°F'}</div>
                    </div>
                    
                    <div class="detail-item">
                        <i class="fas fa-tint"></i>
                        <div class="detail-label">Humidity</div>
                        <div class="detail-value">${main.humidity}%</div>
                    </div>
                    
                    <div class="detail-item">
                        <i class="fas fa-wind"></i>
                        <div class="detail-label">Wind Speed</div>
                        <div class="detail-value">${currentUnit === 'metric' ? Math.round(wind.speed * 3.6) + ' km/h' : Math.round(wind.speed) + ' mph'}</div>
                    </div>
                    
                    <div class="detail-item">
                        <i class="fas fa-compress-arrows-alt"></i>
                        <div class="detail-label">Pressure</div>
                        <div class="detail-value">${main.pressure} hPa</div>
                    </div>
                    
                    <div class="detail-item">
                        <i class="fas fa-eye"></i>
                        <div class="detail-label">Visibility</div>
                        <div class="detail-value">${Math.round(data.visibility / 1000)} km</div>
                    </div>
                    
                    <div class="detail-item">
                        <i class="fas fa-cloud"></i>
                        <div class="detail-label">Cloudiness</div>
                        <div class="detail-value">${data.clouds?.all || 0}%</div>
                    </div>
                </div>
                
                <img src="https://placehold.co/600x300/667eea/ffffff?text=Weather+Visualization" 
                     alt="Weather visualization graphic showing current atmospheric conditions with animated weather elements"
                     class="weather-graphic"
                     onerror="this.onerror=null; this.style.display='none';">
            </div>
        `;
        
        weatherContainer.innerHTML = weatherHTML;
        
        // Add event listeners to the newly created unit buttons
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const unit = this.textContent.trim() === '°C' ? 'metric' : 'imperial';
                changeUnit(unit);
            });
        });
    }

    function showError(message) {
        weatherContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                ${message}. Please try another city.
            </div>
            <div class="weather-content">
                <img src="https://placehold.co/600x400/667eea/ffffff?text=Weather+Error" 
                     alt="Weather app error illustration showing a broken cloud with rain and a sad face" 
                     class="weather-graphic"
                     onerror="this.onerror=null; this.style.display='none';">
            </div>
        `;
    }

    function changeUnit(unit) {
        if (unit !== currentUnit) {
            currentUnit = unit;
            
            // Get current city from displayed location
            const locationElement = document.querySelector('.location');
            if (locationElement) {
                const locationText = locationElement.textContent.trim();
                const city = locationText.split(',')[0].replace('📍', '').trim();
                fetchWeather(city);
            }
        }
    }

    // Add geolocation functionality
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                },
                error => {
                    console.log('Geolocation error:', error);
                    showError('Location access denied. Please search for a city.');
                }
            );
        }
    }

    function fetchWeatherByCoords(lat, lon) {
        loadingElement.style.display = 'block';
        weatherContainer.innerHTML = '';
        weatherContainer.appendChild(loadingElement);

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Location weather data not available');
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                showError(error.message);
            })
            .finally(() => {
                loadingElement.style.display = 'none';
            });
    }

    // Add demo functionality for testing without API key
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        // Show demo data if no API key is provided
        setTimeout(() => {
            const demoData = {
                name: "New York",
                sys: { country: "US" },
                main: {
                    temp: 22,
                    feels_like: 24,
                    humidity: 65,
                    pressure: 1013
                },
                weather: [{ 
                    icon: "01d",
                    description: "clear sky",
                    main: "Clear"
                }],
                wind: { speed: 3.5 },
                visibility: 10000,
                clouds: { all: 0 },
                dt: Math.floor(Date.now() / 1000)
            };
            displayWeather(demoData);
        }, 1000);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            getLocation();
        }
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            cityInput.focus();
        }
    });

    // Make functions globally available for HTML onclick attributes
    window.changeUnit = changeUnit;
    window.getLocation = getLocation;

    // Add auto-focus to search input
    setTimeout(() => {
        cityInput.focus();
    }, 500);
});
