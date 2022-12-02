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
  getWeather();
  aside.classList.add("asideStyle");
  weatherSection.classList.add("weather-container");
});

const showDailyWeather = function (data) {
  for (let i = 0; i < data.daily.length - 3; i++) {
    const div = document.createElement("div");
    const p = document.createElement("p");
    const p1 = document.createElement("p");
    const weeklyForcast = data.daily[i].temp.max;
    const convertDate = new Date(data.daily[i].dt * 1000);
    p1.textContent = weeklyForcast;

    p.textContent = convertDate.toLocaleDateString("en-US");
    div.classList.add("forcast");

    forcast.append(div);
    div.append(p, p1);
    console.log(weeklyForcast);
    // use localStorage.setItem() to store the data properties and then use JSON.stringify and parse
  }
};

const showCurrentWeather = function (data) {
  const p = document.createElement("p");
  const p1 = document.createElement("p");
  const p2 = document.createElement("p");
  const currentTemp = data.current.temp;
  const currentHumidity = data.current.humidity;
  const currentWindspeed = data.current.wind_speed;
  p.textContent = `Temperature: ${currentTemp}°`;
  p1.textContent = `Humidity: ${currentHumidity}%`;
  p2.textContent = `Windspeed: ${currentWindspeed} MPH`;
  currentWeatherDiv.classList.add("currentWeather");

  currentWeatherDiv.append(cityName, p, p1, p2);
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

      fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely,alerts&appid=${apiKey}`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cityName.textContent = `Current Weather for ${name}, ${state}`;
          showCurrentWeather(data);
          showDailyWeather(data);
          return console.log(data);
        });
      // cityName.textContent = `Current Weather for ${name}, ${state}`;
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
