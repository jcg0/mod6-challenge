const searchForm = document.querySelector("#searchForm");
const apiKey = "5a937f93e610e1adbf4727fe4992bad9";
const searchLocation = searchForm.elements.query.value;
const cityName = document.querySelector("#cityName");
const currentWeatherDiv = document.querySelector("#currentWeather");
const forcast = document.querySelector("#forcast");
const aside = document.querySelector("#aside");
const weatherSection = document.querySelector("#weatherSection");

//could use empty array for localstorage

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  currentWeatherDiv.innerHTML = "";
  forcast.innerHTML = "";
  cityName.innerHTML = "";
  aside.classList.add("asideStyle");
  weatherSection.classList.add("weather-container");
  getWeather();
});

const showCurrentCity = function (name, state) {
  const cityNameP = document.createElement("p");
  // const currentWeatherCity = document.createElement("p");
  // currentWeatherCity.textContent = "Current";
  // currentWeatherDiv.append(currentWeatherCity);
  cityNameP.textContent = `Weather for ${name}, ${state}`;
  cityName.prepend(cityNameP);
};

const showDailyWeather = function (data) {
  for (let i = 1; i < data.daily.length - 2; i++) {
    const div = document.createElement("div");
    const p = document.createElement("p");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    const p3 = document.createElement("p");
    const p4 = document.createElement("p");

    const convertDate = new Date(data.daily[i].dt * 1000);

    for (let j = 0; j < data.daily[i].weather.length; j++) {
      const img = document.createElement("img");
      const weeklyIcon = data.daily[i].weather[j].icon;
      img.src = `http://openweathermap.org/img/wn/${weeklyIcon}.png`;
      div.append(p, img, p1, p2, p3, p4);
    }
    const weeklyHi = data.daily[i].temp.max;
    const weeklyLow = data.daily[i].temp.min;
    const weeklyHumidity = data.daily[i].humidity;
    const weeklyWindspeed = data.daily[i].wind_speed;
    p.textContent = convertDate.toDateString("en-US");
    p1.textContent = `High: ${Math.round(weeklyHi)}°`;
    p2.textContent = `Low: ${Math.round(weeklyLow)}°`;
    p3.textContent = `Humidity: ${weeklyHumidity}%`;
    p4.textContent = `Wind Speed: ${weeklyWindspeed}MPH`;
    div.classList.add("forcast");

    forcast.append(div);
    // use localStorage.setItem() to store the data properties and then use JSON.stringify and parse
  }
};

const showCurrentWeather = function (data) {
  const p = document.createElement("p");
  const p1 = document.createElement("p");
  const p2 = document.createElement("p");
  const p3 = document.createElement("p");
  const img = document.createElement("img");
  const currentIcon = data.current.weather[0].icon;
  const currentTemp = data.current.temp;
  const currentHumidity = data.current.humidity;
  const currentWindspeed = data.current.wind_speed;
  const currentDate = new Date(data.current.dt * 1000);
  p.textContent = currentDate.toDateString("en-US");
  p1.textContent = `Temperature: ${Math.round(currentTemp)}°`;
  p2.textContent = `Humidity: ${currentHumidity}%`;
  p3.textContent = `Wind Speed: ${currentWindspeed} MPH`;
  img.src = `http://openweathermap.org/img/wn/${currentIcon}.png`;
  currentWeatherDiv.classList.add("currentWeather");

  currentWeatherDiv.append(p, img, p1, p2, p3);
  console.log(data);
};

function getWeather() {
  const searchLocation = searchForm.elements.query.value;
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${searchLocation}&limit=5&appid=${apiKey}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const name = data[0].name;
      const state = data[0].state;
      const lat = data[0].lat;
      const lon = data[0].lon;
      showCurrentCity(name, state);
      fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely,alerts&appid=${apiKey}`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          showCurrentWeather(data);
          showDailyWeather(data);
          return console.log(data);
        });
      return;
    });
}

// const getLocation = function () {
//   fetch(
//     `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}`
//   )
//     .then((res) => {
//       return res.json();
//     })
//     .then((data) => {
//       return console.log(data);
//     });
// };
