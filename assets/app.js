const searchForm = document.querySelector("#searchForm");
const apiKey = "5a937f93e610e1adbf4727fe4992bad9";
let searchLocation = searchForm.elements.query.value;
const cityName = document.querySelector("#cityName");
const currentWeatherDiv = document.querySelector("#currentWeather");
const forcast = document.querySelector("#forcast");
const aside = document.querySelector("#aside");
const weatherSection = document.querySelector("#weatherSection");
const weatherUl = document.querySelector("#storedWeather");

const weatherList = [];

// Grabbing any stored data
// let startupData = localStorage.getItem("weather");
// console.log(startupData); // --> JSON OBJECT "{ "weather": "["Detriot"]" }"
// console.log(typeof startupData); // --> STRING

// parsing the information (converting the STRING/JSON into JS OBJECTs)
// let parsedData = JSON.parse(startupData);
// console.log(parsedData); // --> JS OBJECT { weather: ["Detriot"] }
// console.log(typeof parsedData); // --> OBJECT (JS ARRAY)

// // here we ADD NEW DATA to our JS OBJECT
// parsedData.push("Chicago");
// console.log(parsedData); // --> { weather: ["Detroit", "Chicago"]}

// // Transform data back to a SRTING / JSON
// let jsonData = JSON.stringify(parsedData);
// console.log(jsonData); //
// console.log(typeof jsonData); //

// // we are writing the NEW DATA into the Browser
// localStorage.setItem("weather", jsonData);

// use empty array for localstorage
// add searched location to localstorage
// add location to ul when location is submitted
// each time new location is searched and submitted add it to the list
// when a location is selected it should display the data from that location that was stored in local storage

//if there is time use media queries to make page responsive

const initalizeData = () => {
  // Initialize our Dataset --> "weather": "[]"
  localStorage.setItem("weather", JSON.stringify(weatherList));
};

const storeWeatherList = function () {
  // we need to get the data
  let storedData = localStorage.getItem("weather");

  // parse the data
  let storedParsedData = JSON.parse(storedData);

  // update our dataset  --> Where is this new data coming from(?)
  searchLocation = searchForm.elements.query.value;

  storedParsedData.push(searchLocation);

  // convert our data back to a STRING / JSON
  let storedStringData = JSON.stringify(storedParsedData);

  // update/save the new dataset
  localStorage.setItem("weather", storedStringData);
};

const showWeatherList = function () {
  let storedWeatherData = JSON.parse(localStorage.getItem("weather"));
  weatherUl.innerHTML = "";
  for (let i = 0; i < storedWeatherData.length; i++) {
    const btn = document.createElement("button");
    const li = document.createElement("li");

    btn.textContent = storedWeatherData[i].toUpperCase();
    li.append(btn);
    weatherUl.append(li);

    btn.classList.add("history-button");
    li.classList.add("search-history-li");
  }
};

weatherUl.addEventListener("click", function (e) {
  const cityClick = e.target.innerHTML;
  console.log(cityClick);

  currentWeatherDiv.innerHTML = "";
  forcast.innerHTML = "";
  cityName.innerHTML = "";
  aside.classList.add("aside-style");
  weatherSection.classList.add("weather-container");

  getWeather(cityClick);
});

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  // here we want to make sure we cpture the user input (city_name)
  currentWeatherDiv.innerHTML = "";
  forcast.innerHTML = "";
  cityName.innerHTML = "";
  aside.classList.add("aside-style");
  weatherSection.classList.add("weather-container");

  // we want to tpass that user value to our storeWeather function
  // showWeatherList();
  const searchValue = searchForm.elements.query.value;
  storeWeatherList();
  getWeather(searchValue);
});

const showCurrentCity = function (name, state) {
  const cityNameP = document.createElement("p");
  // const currentWeatherCity = document.createElement("p");
  // currentWeatherCity.textContent = "Current";
  // currentWeatherDiv.append(currentWeatherCity);
  cityNameP.textContent = `Weather for ${name}, ${state}`;
  cityNameP.classList.add("city-name");
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
};

function getWeather(searchLocation) {
  // const searchLocation = searchForm.elements.query.value;
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${searchLocation}&limit=5&appid=${apiKey}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const name = data[0].name;
      const state = data[0].state;
      const lat = data[0].lat;
      const lon = data[0].lon;
      showCurrentCity(name, state);
      console.log(data);
      fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely,alerts&appid=${apiKey}`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          showCurrentWeather(data);
          showDailyWeather(data);
          showWeatherList();
          return console.log(data);
        });
      return;
    })
    .catch((e) => {
      console.log(e);
    });
}

initalizeData(); // --> this function call initializes our empty dataset
