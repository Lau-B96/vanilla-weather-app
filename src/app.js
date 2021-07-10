function formatDate(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let now = new Date(timestamp);
  let weekDay = days[now.getDay(timestamp)];
  let month = months[now.getMonth(timestamp)];
  let day = now.getDate(timestamp);
  let hour = now.getHours(timestamp);
  let minutes = now.getMinutes(timestamp);
  if (hour < 10) {
    hour = `0${hour}`;
  } else {
    hour;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  } else {
    minutes;
  }

  return `${weekDay}, ${month} ${day}, ${hour}:${minutes}`;
}

function searchCity(cityEntered) {
  let apiKey = "bba30742206f6fc2ab4952eb606f9aba";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityEntered}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function searchForCity(event) {
  event.preventDefault();
  if (document.querySelector("input").value !== "") {
    event.preventDefault();
    let cityEntered = document.querySelector("input").value;
    searchCity(cityEntered);
  } else {
    alert("Please enter a city or search for your current location 🗺");
    searchCity("Porto");
  }
}

function displayWeather(response) {
  let cityHeading = document.querySelector("h1");
  cityHeading.innerHTML = response.data.name;
  let cityEntered = document.querySelector("input");
  cityEntered.value = "";
  let currentTemperature = Math.round(response.data.main.temp);
  let temp = document.querySelector("#current-temperature");
  temp.innerHTML = currentTemperature;
  let tempDescription = document.querySelector("#weather-description");
  tempDescription.innerHTML = response.data.weather[0].description;
  let maxTemp = document.querySelector("#max-temp-today");
  maxTemp.innerHTML = `${Math.round(response.data.main.temp_max)}ºC`;
  let minTemp = document.querySelector("#min-temp-today");
  minTemp.innerHTML = `${Math.round(response.data.main.temp_min)}ºC`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${Math.round(response.data.main.humidity)}%`;
  let currentDate = document.querySelector("#current-time");
  let timeZoneOffset = response.data.timezone;
  currentDate.innerHTML = formatDate(
    (response.data.dt + (timeZoneOffset - 3600)) * 1000
  );
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiKey = "bba30742206f6fc2ab4952eb606f9aba";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchForCity);
let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchForCity);

let geoButton = document.querySelector("#location-button");
geoButton.addEventListener("click", getCurrentPosition);

searchCity("Porto");
