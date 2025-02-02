const apiKey = '4aeb300cf1991781d64c00c7e1218677'; // Your API Key

async function getWeather() {
  const city = document.getElementById('city-input').value.trim();
  
  if (city === '') {
    alert('Please enter a city name.');
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== '200') {
      document.getElementById('weather-info').innerHTML = `<p>${data.message}</p>`;
      return;
    }

    const weatherData = data.list[0]; // Taking the first forecast for simplicity
    const cityName = data.city.name;
    const country = data.city.country;
    const temp = weatherData.main.temp; // Now in Celsius
    const description = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    document.getElementById('weather-info').innerHTML = `
      <div class="card">
        <h2>${cityName}, ${country}</h2>
        <p class="temp">${temp}°C</p>
        <p class="details">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
        <p class="details">Humidity: ${humidity}%</p>
        <p class="details">Wind Speed: ${windSpeed} m/s</p>
      </div>
    `;
  } catch (error) {
    console.error(error);
    alert('Error fetching weather data.');
  }
}
