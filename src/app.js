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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDate();
  let weekDay = date.getDay();
  let month = date.getMonth();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let forecastDate = `${days[weekDay]}, ${months[month]} ${day}`;

  return forecastDate;
}

function displayForecast(response) {
  let forecast = document.querySelector("#forecast-section");

  let forecastDays = response.data.daily;
  console.log(forecastDays);

  let forecastHTML = "";
  forecastDays.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col days">
              <div class="day-title">${formatDay(forecastDay.dt)}</div>
              <ul>
                <li>
                  <img class="forecast-icon" src="img/${
                    forecastDay.weather[0].icon
                  }.svg" alt="${forecastDay.weather[0].description}" />
                </li>
                <li class="info">
                  <img
                    class="forecast-temp-icon"
                    src="img/020-thermometer.svg"
                    title="Maximum Temperature"
                  /> <span id="forecast-temp-max">${Math.round(
                    forecastDay.temp.max
                  )} º</span>
                  
                </li>
                <li class="info">
                  <img
                    class="forecast-temp-icon"
                    src="img/018-thermometer.svg"
                    title="Minimum Temperature"
                  /> <span id="forecast-temp-min">${Math.round(
                    forecastDay.temp.min
                  )} º</span>
                  
                </li>
                <li class="info">
                  <img
                    class="forecast-temp-icon"
                    src="img/017-wind.svg"
                    title="Wind Speed"
                  /> <span id="forecast-wind">${Math.round(
                    forecastDay.wind_speed
                  )} km/h</span>
                </li>
                <li class="info">
                  <img
                    class="forecast-temp-icon"
                    src="img/007-drops.svg"
                    title="Humidity" 
                  /> <span id="forecast-humidity">${Math.round(
                    forecastDay.humidity
                  )} %</span>
                </li>
              </ul>
            </div>`;
    }
  });
  forecast.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "bba30742206f6fc2ab4952eb606f9aba";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  let cityHeading = document.querySelector("h1");
  let country = document.querySelector(".country");
  let cityEntered = document.querySelector("input");
  let temp = document.querySelector("#current-temperature");
  let tempDescription = document.querySelector("#weather-description");
  let maxTemp = document.querySelector("#max-temp-today");
  let minTemp = document.querySelector("#min-temp-today");
  let wind = document.querySelector("#wind");
  let humidity = document.querySelector("#humidity");
  let weatherIcon = document.querySelector("#current-temperature-icon");
  let icon = response.data.weather[0].icon;
  let currentDate = document.querySelector("#current-time");
  let timeZoneOffset = response.data.timezone;

  celsiusTemperature = Math.round(response.data.main.temp);
  celsiusMaxTemperature = Math.round(response.data.main.temp_max);
  celsiusMinTemperature = Math.round(response.data.main.temp_min);

  cityEntered.value = "";
  cityHeading.innerHTML = response.data.name;
  country.innerHTML = response.data.sys.country;
  temp.innerHTML = Math.round(response.data.main.temp);
  tempDescription.innerHTML = response.data.weather[0].description;
  maxTemp.innerHTML = `${Math.round(response.data.main.temp_max)} ºC`;
  minTemp.innerHTML = `${Math.round(response.data.main.temp_min)} ºC`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  humidity.innerHTML = `${Math.round(response.data.main.humidity)} %`;
  weatherIcon.setAttribute("src", `img/${icon}.svg`);
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  currentDate.innerHTML = formatDate(
    (response.data.dt + (timeZoneOffset - 3600)) * 1000
  );

  getForecast(response.data.coord);
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

function displayFahrenheitTemperature(event) {
  event.preventDefault();

  let temp = document.querySelector("#current-temperature");
  let maxTemp = document.querySelector("#max-temp-today");
  let minTemp = document.querySelector("#min-temp-today");

  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  let fahrenheitMaxTemp = (celsiusMaxTemperature * 9) / 5 + 32;
  let fahrenheitMinTemp = (celsiusMinTemperature * 9) / 5 + 32;

  temp.innerHTML = Math.round(fahrenheitTemp);
  maxTemp.innerHTML = `${Math.round(fahrenheitMaxTemp)}ºF`;
  minTemp.innerHTML = `${Math.round(fahrenheitMinTemp)}ºF`;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function displayCelsiusTemperature(event) {
  event.preventDefault();

  let temp = document.querySelector("#current-temperature");
  let maxTemp = document.querySelector("#max-temp-today");
  let minTemp = document.querySelector("#min-temp-today");

  temp.innerHTML = Math.round(celsiusTemperature);
  maxTemp.innerHTML = `${Math.round(celsiusMaxTemperature)}ºC`;
  minTemp.innerHTML = `${Math.round(celsiusMinTemperature)}ºC`;
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

let celsiusTemperature = null;
let celsiusMaxTemperature = null;
let celsiusMinTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchForCity);
let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchForCity);

let geoButton = document.querySelector("#location-button");
geoButton.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

searchCity("Porto");
