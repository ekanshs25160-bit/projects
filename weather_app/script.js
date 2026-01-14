async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  
  // Clean state
  weatherDataSection.classList.add("hidden");
  weatherDataSection.innerHTML = "";
  
  const apiKey = "e66f1e6c2f757acd2e3e7ef5a7084220";

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid city name.</p>
      </div>
    `;
    weatherDataSection.classList.remove("hidden");
    return;
  }

  async function getLonAndLat() {
    const countryCode = 'IN'; // Optimized for India
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad Response ", response.status);
      return;
    }

    const data = await response.json();

    if (data.length === 0) {
      console.log("Something went wrong here!");
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid city name.</p>
        </div>
      `;
      weatherDataSection.classList.remove("hidden");
      return;
    } else {
      return data[0];
    }
  }

  // === DYNAMIC BACKGROUND (COLORS) ===
  // This function takes the weather condition (e.g., "Clouds", "Rain") as input
  function updateBackground(weatherCondition) {
    const bgElement = document.querySelector('.background-gradient');
    const condition = weatherCondition.toLowerCase();
    
    // Define Gradients for different weathers
    // We use radial gradients for a smooth, premium look
    let gradient = '';

    if (condition.includes('clear') || condition.includes('sun')) {
      // Sunny/Clear: warm orange, yellow, bright blue
      gradient = 'radial-gradient(circle at 50% 50%, rgba(255, 171, 0, 0.8), transparent 60%), radial-gradient(circle at 10% 20%, rgba(255, 87, 34, 0.8), transparent 50%), radial-gradient(circle at 90% 80%, rgba(33, 150, 243, 0.8), transparent 40%)';
    } else if (condition.includes('cloud')) {
      // Cloudy: Greys, muted blues, whites
      gradient = 'radial-gradient(circle at 50% 50%, rgba(144, 164, 174, 1), transparent 60%), radial-gradient(circle at 10% 20%, rgba(84, 110, 122, 1), transparent 50%), radial-gradient(circle at 90% 80%, rgba(207, 216, 220, 1), transparent 40%)';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      // Rain: Deep blues, purples, greys
      gradient = 'radial-gradient(circle at 50% 50%, rgba(63, 81, 181, 0.9), transparent 60%), radial-gradient(circle at 10% 20%, rgba(48, 63, 159, 1), transparent 50%), radial-gradient(circle at 90% 80%, rgba(26, 35, 126, 1), transparent 40%)';
    } else if (condition.includes('snow')) {
      // Snow: Very light blues, whites, cool greys
      gradient = 'radial-gradient(circle at 50% 50%, rgba(224, 247, 250, 1), transparent 60%), radial-gradient(circle at 10% 20%, rgba(128, 222, 234, 1), transparent 50%), radial-gradient(circle at 90% 80%, rgba(178, 235, 242, 1), transparent 40%)';
    } else if (condition.includes('thunder') || condition.includes('storm')) {
      // Thunder: Dark purples, blacks, electric blues
      gradient = 'radial-gradient(circle at 50% 50%, rgba(49, 27, 146, 1), transparent 60%), radial-gradient(circle at 10% 20%, rgba(0, 0, 0, 1), transparent 50%), radial-gradient(circle at 90% 80%, rgba(103, 58, 183, 1), transparent 40%)';
    } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
       // Mist/Fog: Hazy purples, greys
       gradient = 'radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.6), transparent 60%), radial-gradient(circle at 10% 20%, rgba(123, 31, 162, 0.8), transparent 50%), radial-gradient(circle at 90% 80%, rgba(225, 190, 231, 1), transparent 40%)';
    } else {
      // Default: The original beautiful gradient
      gradient = 'radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 1), transparent 50%), radial-gradient(circle at 10% 20%, rgba(6, 182, 212, 1), transparent 40%), radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 1), transparent 40%)';
    }
    
    // Apply the gradient
    bgElement.style.background = gradient;
    bgElement.style.backgroundSize = '200% 200%'; // Ensure animation still works
  }

  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(weatherURL);

    if (!response.ok) {
      console.log("Bad Response ", response.status);
      return;
    }

    const data = await response.json();

    // Call our new function to update the background!
    // We pass the main weather description (e.g., "Rain")
    updateBackground(data.weather[0].main);

    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
      </div>
    `;
    weatherDataSection.classList.remove("hidden");
  }

  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  if (geocodeData) {
    await getWeatherData(geocodeData.lon, geocodeData.lat);
  }
}
// Add enter key support
document.getElementById("search").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    fetchWeather();
  }
});