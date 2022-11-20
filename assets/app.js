const searchForm = document.querySelector("#searchForm");
const apiKey = "5a937f93e610e1adbf4727fe4992bad9";

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  getWeather();
});

function getWeather() {
  const searchLocation = searchForm.elements.query.value;
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${searchLocation}&limit=5&appid=${apiKey}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      const lat = data[0].lat;
      const lon = data[0].lon;
      fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          return console.log(data);
        });
      // const div = document.createElement("div");
      // const span = document.createElement("span");
      // div.textContent = data[0].lat;
      // span.textContent = data[0].lon;
      // searchForm.append(div);
      // searchForm.append(span);
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
