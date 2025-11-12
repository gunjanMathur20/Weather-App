const apiKey = "5a9395ada97ca66ab145f7fd8e10fa7b";

const inputBox = document.getElementById("input-box");
const searchBtn = document.getElementById("search-btn");

const weatherData = document.getElementById("weather-data");
const errorBox = document.querySelector(".location-not-found");

const cityName = document.getElementById("city-name");
const tempValue = document.getElementById("temp-value");
const feelsLike = document.getElementById("feels-like");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity-value");
const windSpeed = document.getElementById("wind-speed");
const sunriseTime = document.getElementById("sunrise-time");
const sunsetTime = document.getElementById("sunset-time");

const weatherImg = document.getElementById("weather-img");

// function to convert UNIX timestamp to local time string (HH:MM)
function convertTime(timestamp, timezoneOffset) {
  // Create a new Date in milliseconds
  const utcTime = timestamp * 1000; // timestamp is in seconds

  // Add the city’s timezone offset (in seconds → ms)
  const localTime = new Date(utcTime + timezoneOffset * 1000);

  // Convert to readable 12-hour format with AM/PM
  return localTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC' // Keep it fixed so offset math works correctly
  });
}


// Function to set weather image based on weather condition
function setWeatherImage(condition) {
  const cond = condition.toLowerCase();

  if (cond.includes("cloud")) {
    weatherImg.src = "images/clouds.png";
  } else if (cond.includes("rain")) {
    weatherImg.src = "images/rain.png";
  } else if (cond.includes("clear")) {
    weatherImg.src = "images/clear.png";
  } else if (cond.includes("mist")) {
    weatherImg.src = "images/mist.png";
  } else if (cond.includes("snow")) {
    weatherImg.src = "images/snow.png";
  } else if (cond.includes("haze")) {
    weatherImg.src = "images/haze.png";
  } else if (cond.includes("cold")) {
    weatherImg.src = "images/cold.png";
  } else if (cond.includes("sunny")) {
    weatherImg.src = "images/sunny.png";
  } else {
    weatherImg.src = "images/clouds.png"; // default image
  }
}

// Initially show weather layout with placeholder/default values, hide error
weatherData.style.display = "block";
errorBox.style.display = "none";

// Main function to fetch and show weather data
async function getWeather(city) {
  try {
    // Step 1: Get city info (state, country)
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      weatherData.style.display = "none";
      errorBox.style.display = "block";
      return;
    }

    const { lat, lon, state, country, name } = geoData[0];

    // Step 2: Get weather using lat & lon
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      weatherData.style.display = "none";
      errorBox.style.display = "block";
      return;
    }

    const data = await response.json();

    // Show weather layout
    errorBox.style.display = "none";
    weatherData.style.display = "block";

    // City, State, Country
    cityName.textContent = `${name}, ${state || "N/A"}, ${country}`;

    // Update rest of the info
    tempValue.innerHTML = `Temperature <span class="value">${Math.round(data.main.temp)}<sup>°C</sup></span>`;
    feelsLike.innerHTML = `Feels Like <span class="value">${Math.round(data.main.feels_like)}<sup>°C</sup></span>`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} km/h`;

    sunriseTime.textContent = convertTime(data.sys.sunrise, data.timezone);
    sunsetTime.textContent = convertTime(data.sys.sunset, data.timezone);

    setWeatherImage(data.weather[0].main);

  } catch (error) {
    weatherData.style.display = "none";
    errorBox.style.display = "block";
    console.error("Error fetching weather:", error);
  }
}


// Event listener on Search button click
searchBtn.addEventListener("click", () => {
  const city = inputBox.value.trim();
  if (city !== "") {
    getWeather(city);
  }
});

// Also allow Enter key press on input box to trigger search
inputBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

// // ================ //

// const inputBox = document.querySelector("#input-box");
// const searchBtn = document.querySelector("#search-btn");
// const weatherData = document.querySelector("#weather-data");
// const errorBox = document.querySelector(".location-not-found");
// const cityName = document.querySelector("#city-name");
// const temperature_value = document.querySelector("#temp-value");
// const feelsLike = document.querySelector("#feels-like");
// const description = document.querySelector("#description");
// const humidity = document.querySelector("#humidity-value");
// const wind_speed = document.querySelector("#wind-speed");
// const sunriseTime = document.querySelector("#sunrise-time");
// const sunsetTime = document.querySelector("#sunset-time");
// const weatherImage = document.querySelector("#weather-img");

// //default view on page load
// weatherData.style.display = "block";
// errorBox.style.display = "none";

// //convert unix timestamp to local time
// function convertTime(timestamp) {
//   const date = new Date(timestamp * 1000);
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// // function to fetch weather data
// const getWeather = async (city) => {
//   const apiKey = "5a9395ada97ca66ab145f7fd8e10fa7b";
//   const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//   try {
//     const response = await fetch(URL);
//     const data = await response.json();
//     console.log(data);

//     // Check if city not found
//     if (data.cod !== 200) {
//       weatherData.style.display = "none";
//       errorBox.style.display = "block";
//       return;
//     }

//     // if city found : display weather data
//     weatherData.style.display = "block";
//     errorBox.style.display = "none";

//     // update weather data :
//     cityName.textContent = data.name;
//     temperature_value.innerHTML = `Temperature <span>${Math.round(
//       data.main.temp
//     )}<sup>°C</sup></span>`;
//     feelsLike.innerHTML = `Feels Like <span>${Math.round(
//       data.main.feels_like
//     )}<sup>°C</sup></span>`;

//     description.textContent = data.weather[0].description;

//     humidity.textContent = ` ${data.main.humidity}%`;
//     wind_speed.textContent = ` ${data.wind.speed} km/H`;

//     sunriseTime.textContent = ` ${convertTime(data.sys.sunrise)} `;
//     sunsetTime.textContent = ` ${convertTime(data.sys.sunset)}`;

//     // Set weather image from OpenWeather icon
//     displayWeatherImage(data.weather[0].main);
//     // const iconCode = data.weather[0].icon;
//     // const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
//     // weatherImage.src = iconUrl;

//   } catch (error) {
//     weatherData.style.display = "none";
//     errorBox.style.display = "block";
//   }
// };

// //function to set weather image based on conditions
// const displayWeatherImage = (condition) => {
//   const cond = condition.toUpperCase();

//   if (cond.includes("cloud")) {
//     weatherImage.src = "images/clouds.png";
//   } else if (cond.includes("rain")) {
//     weatherImage.src = "images/rain.png";
//   } else if (cond.includes("clear")) {
//     weatherImage.src = "images/clear.png";
//   } else if (cond.includes("mist")) {
//     weatherImage.src = "images/mist.png";
//   } else if (cond.includes("snow")) {
//     weatherImage.src = "images/snow.png";
//   } else if (cond.includes("haze")) {
//     weatherImage.src = "images/haze.png";
//   } else if (cond.includes("cold")) {
//     weatherImage.src = "images/cold.png";
//   } else if (cond.includes("sunny")) {
//     weatherImage.src = "images/sunny.png";
//   } else {
//     weatherImage.src = "images/clouds.png"; // default image
//   }
// };

// // Add Event Listener on search button
// searchBtn.addEventListener("click", () => {
//   const city = inputBox.value.trim();
//   if (city !== "") {
//     getWeather(city);
//   }
// });

// // Add Event Listener on input box
// inputBox.addEventListener("keypress", (event) => {
//   if (event.key === "Enter") {
//     searchBtn.click();
//   }
// });
