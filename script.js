const apiKey = '4aeb300cf1991781d64c00c7e1218677'; // Your API Key

async function getWeather() {
  let city = document.getElementById('city-input').value.trim();
  
  if (city === '') {
    alert('অনুগ্রহ করে শহরের নাম লিখুন।');
    return;
  }

  // Common city name corrections
  const corrections = {
    'dhaka': 'Dhaka',
    'daka': 'Dhaka', 
    'dakha': 'Dhaka',
    'chittaging': 'Chittagong',
    'chittagong': 'Chittagong', 
    'ctg': 'Chittagong',
    'sylet': 'Sylhet',
    'shylet': 'Sylhet',
    'rajshahi': 'Rajshahi',
    'rajsahi': 'Rajshahi',
    'khulna': 'Khulna',
    'kulna': 'Khulna',
    'barishal': 'Barisal',
    'barisal': 'Barisal',
    'barishaal': 'Barisal',
    'rangpur': 'Rangpur',
    'rongpur': 'Rangpur'
  };

  // Check and correct spelling with fuzzy matching
  city = city.toLowerCase();
  let matchFound = false;
  let bestMatch = '';
  let bestMatchScore = 0;

  // Function to calculate similarity score between two strings
  function similarityScore(str1, str2) {
    let score = 0;
    const len1 = str1.length;
    const len2 = str2.length;
    const maxLen = Math.max(len1, len2);
    
    for(let i = 0; i < Math.min(len1, len2); i++) {
      if(str1[i] === str2[i]) score++;
    }
    
    return score / maxLen;
  }

  // Find best matching city
  Object.keys(corrections).forEach(key => {
    const score = similarityScore(city, key);
    if(score > bestMatchScore) {
      bestMatchScore = score;
      bestMatch = key;
    }
  });

  // If good match found (threshold 0.6)
  if(bestMatchScore > 0.6) {
    city = corrections[bestMatch];
    matchFound = true;
  } else if(corrections[city]) {
    city = corrections[city];
    matchFound = true;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== '200') {
      // If no exact match found, show similar cities
      if(!matchFound) {
        const similarCities = Object.keys(corrections).filter(key => {
          const score = similarityScore(city, key);
          return score > 0.4; // Lower threshold for suggestions
        });
        
        if (similarCities.length > 0) {
          const suggestions = similarCities.map(city => corrections[city]);
          const uniqueSuggestions = [...new Set(suggestions)];
          
          document.getElementById('weather-info').innerHTML = `
            <div class="card">
              <h2>আপনি কি এই শহরগুলোর কোনটি খুঁজছেন?</h2>
              ${uniqueSuggestions.map(suggestion => 
                `<button onclick="document.getElementById('city-input').value='${suggestion}'; getWeather();" 
                 class="suggestion-btn">${suggestion}</button>`
              ).join('')}
            </div>
          `;
          return;
        }
      }

      document.getElementById('weather-info').innerHTML = `
        <div class="card">
          <p>দুঃখিত, এই শহরের তথ্য পাওয়া যায়নি।</p>
          <p>অনুগ্রহ করে শহরের নাম সঠিকভাবে লিখুন।</p>
        </div>`;
      return;
    }

    const weatherData = data.list[0];
    const cityName = data.city.name;
    const country = data.city.country;
    const temp = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const weatherId = weatherData.weather[0].id;

    // Get weather icon based on condition
    let weatherIcon = '';
    if (weatherId >= 200 && weatherId < 300) {
      weatherIcon = '⛈️'; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 400) {
      weatherIcon = '🌧️'; // Drizzle
    } else if (weatherId >= 500 && weatherId < 600) {
      weatherIcon = '🌧️'; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
      weatherIcon = '❄️'; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
      weatherIcon = '🌫️'; // Atmosphere (fog, mist etc)
    } else if (weatherId === 800) {
      weatherIcon = '☀️'; // Clear sky
    } else if (weatherId > 800) {
      weatherIcon = '☁️'; // Clouds
    }

    document.getElementById('weather-info').innerHTML = `
      <div class="card">
        <h2>${cityName}, ${country}</h2>
        <div style="font-size: 3rem; margin: 1rem 0;">${weatherIcon}</div>
        <p class="temp">${temp}°C</p>
        <p class="details">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
        <p class="details">আর্দ্রতা: ${humidity}%</p>
        <p class="details">বাতাসের গতি: ${windSpeed} m/s</p>
      </div>
    `;
  } catch (error) {
    console.error(error);
    alert('আবহাওয়ার তথ্য আনতে সমস্যা হচ্ছে।');
  }
}
