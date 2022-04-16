// Reusable DOM elements

let city = document.querySelector(".city");
let iconCurrent = document.querySelector(".icon");
let warderobe = document.querySelector(".clothes");
let timeText = document.querySelector(".time");
let dateText = document.querySelector(".date");
let feelsLike = document.querySelector(".feels");
let mainTemp = document.querySelector(".temp");
let speed = document.querySelector(".wind--speed");
let humidityText = document.querySelector(".humidity");
let iconText = document.querySelector(".icon-text");
let topIcon = document.querySelector(".top");
let bottomIcon = document.querySelector(".bottom");
let accesoriesIcon = document.querySelector(".accesories");
let shoesIcon = document.querySelector(".shoes");
let link = "https://img.icons8.com/plumpy/96/000000/";
let warderobeDesc = document.querySelector(".warderobe-desc");
let topText;
let bottomText;
let accesText;
let shoesText;
let cityInput = document.querySelector(".city-input");
let cityBtn = document.querySelector(".city-button");
let main = document.querySelector(".main");
let errorState = document.querySelector(".error-state");
// Clothes icons
let clothes = {
  coat: "suit.png",
  hat: "beanie.png",
  jumper: "jumper.png",
  jacket: "jacket.png",
  jeans: "jeans.png",
  shorts: "shorts.png",
  raincoat: "doctors-laboratory-coat.png",
  scarf: "scarf.png",
  vest: "vest.png",
  shirt: "t-shirt.png",
  sunglasses: "sun-glasses.png",
  umbrella: "umbrella.png",
  winterBoots: "winter-boots.png",
  sneakers: "sneakers.png",
  flopFlops: "flip-flops.png",
  cap: "baseball-cap.png",
};

// Upper clothes part rules
const warderobeTop = function (feels, desc) {
  if (desc.includes("rain" || "Rain" || "storm" || "Storm")) {
    topIcon.src = link + clothes.raincoat;
    topText = "Raincoat";
  } else if (feels > 5 && feels < 8) {
    topIcon.src = link + clothes.jacket;
    topText = "Jacket";
  } else if (feels > 8 && feels < 16) {
    topIcon.src = link + clothes.jumper;
    topText = "Jumper";
  } else if (feels > 16) {
    topIcon.src = link + clothes.shirt;
    topText = "Shirt";
  } else if (feels < 5) {
    topIcon.src = link + clothes.coat;
    topText = "Coat";
  }
  return topText;
};

// Bottom clothes part rules
const warderobeBottom = function (feels, desc) {
  if (desc.includes("rain" || "Rain" || "storm" || "Storm") || feels < 15) {
    bottomIcon.src = link + clothes.jeans;
    bottomText = "Long trousers";
  } else {
    bottomIcon.src = link + clothes.shorts;
    bottomText = "Shorts";
  }
  return bottomText;
};

// Accessories rules
const warderobeAcess = function (feels, desc, time, rise, set) {
  if (desc.includes("rain" || "Rain" || "storm" || "Storm")) {
    accesoriesIcon.src = link + clothes.umbrella;
    accesText = " and Umbrella";
  } else if (feels < 5) {
    accesoriesIcon.src = link + clothes.hat;
    accesText = " and Hat";
  } else if (desc.includes("clear" || "Clear") && rise < time && time < set) {
    accesoriesIcon.src = link + clothes.sunglasses;
    accesText = " and Sun Glasses";
  } else {
    // accesoriesIcon.src = link + clothes.cap;
    accesText = "";
  }
  return accesText;
};

// Shoes rules
const shoes = function (feels, desc) {
  if (feels < 3) {
    shoesIcon.src = link + clothes.winterBoots;
    shoesText = "Winter Boots";
  } else if (3 < feels < 22) {
    shoesIcon.src = link + clothes.sneakers;
    shoesText = "Sneakers";
  } else if (
    feels > 22 &&
    !desc.includes("rain" || "Rain" || "storm" || "Storm")
  ) {
    shoesIcon.src = link + clothes.flopFlops;
    shoesText = "Flip flops";
  }
  return shoesText;
};

// Daily and Hourly forecast cards
const div = function () {
  for (let i = 0; i < 8; i++) {
    document.querySelector(".daily").insertAdjacentHTML(
      "afterbegin",
      `<div class="daily-info center">
              <p class="date-daily"></p>
              <img class="icon-daily" alt="weather icon"/>
              <p class="temp-daily"></p>
            </div>`
    );
    document.querySelector(".hourly").insertAdjacentHTML(
      "afterbegin",
      `<div class="hourly-detail center">
              <img
                class="icon-hourly" alt="weather icon"
              />
              <p class="time-hourly" alt="weather icon"></p>
              <p class="temp-hourly" alt="weather icon"></p>
            </div>`
    );
  }
};
div();

// APIs calls
const place = function () {
  // Geolocation - have to make rule if visitor refuses to use geolocatio on theirs device
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // API call for dispaling correct city
      let location = {
        apiKey: "7c40ec576dbe7ad4bc0e5885e1f82fb6",
        fetchLocation: function () {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
          )
            .then((response) => response.json())
            .then((data) => this.displayLocation(data));
        },
        displayLocation: function (data) {
          let { name } = data;
          let { lon, lat } = data.coord;
          // console.log(lon, lat);
          city.innerHTML = name;
        },
      };

      // Weather API call
      let weather = {
        apiKey: "7c40ec576dbe7ad4bc0e5885e1f82fb6",
        fetchWeather: function () {
          fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
          )
            .then((response) => response.json())
            .then(
              (data) =>
                this.displayHourly(data) ||
                this.displayCurrent(data) ||
                this.displayDaily(data)
            );
        },

        // Data call for second and third card
        displayCurrent: function (data) {
          let { feels_like, temp, wind_speed, dt, sunrise, sunset, humidity } =
            data.current;
          let { main, description, icon } = data.current.weather[0];
          iconCurrent.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
          feelsLike.innerHTML = `Feels like ${Math.round(feels_like)}°C`;
          mainTemp.innerHTML = `Real temprature is ${Math.round(temp)}°C`;
          speed.innerHTML = `Wind speed is ${wind_speed} km/h`;
          humidityText.innerHTML = `Humidity is ${humidity}%`;
          warderobeTop(feels_like, description);
          warderobeBottom(feels_like, description);
          warderobeAcess(feels_like, description, dt, sunrise, sunset);
          shoes(feels_like, description);
          warderobeDesc.innerHTML = `We would recoment to wear ${topText}, ${bottomText}, ${shoesText}${accesText}.`;
          function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
          iconText.innerHTML = capitalizeFirstLetter(description);
        },

        // Data call for hourly (inside first card) forecast cards
        displayHourly: function (data) {
          for (let i = 0; i < 8; i++) {
            let { temp } = data.hourly[i];
            let { icon } = data.hourly[i].weather[0];
            let tempHourly = document.querySelectorAll(".temp-hourly");
            let iconHourly = document.querySelectorAll(".icon-hourly");
            tempHourly[i].innerHTML = `${Math.round(temp)}°C`;
            iconHourly[
              i
            ].src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
          }
        },

        // Data call for daily (bottom) forecast cards
        displayDaily: function (data) {
          for (let i = 0; i < 8; i++) {
            let { icon } = data.daily[i].weather[0];
            let { day } = data.daily[i].temp;
            let tempDaily = document.querySelectorAll(".temp-daily");
            tempDaily[i].innerHTML = `${Math.round(day)}°C`;
            let iconDaily = document.querySelectorAll(".icon-daily");
            iconDaily[
              i
            ].src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
          }
        },
      };
      weather.fetchWeather();
      location.fetchLocation();
    },
    function (error) {
      if (error.code == error.PERMISSION_DENIED) {
        main.classList.add("hidden");
        errorState.classList.remove("hidden");
      }
    }
  );
};
place();

// Functions and data calls for displaing day info
const timeDisplay = function () {
  const today = new Date();

  let date = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();

  let hours = today.getHours().toString();
  if (hours.length < 2) hours = `0${hours}`;
  let minutes = today.getMinutes().toString();
  if (minutes.length < 2) minutes = `0${minutes}`;
  let seconds = today.getSeconds().toString();
  if (seconds.length < 2) seconds = `0${seconds}`;
  let clock = `${hours}:${minutes}:${seconds}`;
  timeText.innerHTML = clock;
  dateText.innerHTML = `${date}.${month}.${year}`;
};
setInterval(timeDisplay, 1000);

const cardsInfo = function () {
  const todayNew = new Date();

  let dayArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let timeArr = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];
  let hours = todayNew.getHours().toString();
  let day = todayNew.getDay();
  let date = todayNew.getDate();
  let month = todayNew.getMonth() + 1;

  const monthFun = function (num, den, z) {
    if ([1, 3, 5, 7, 8, 10].includes(num) && den + z > 31) {
      num++;
    } else if ([4, 6, 9, 11].includes(num) && den + z > 30) {
      num++;
    } else if (num === 2 && den + z > 28) {
      num++;
    } else if (num === 12 && den + z > 31) {
      num = 1;
    } else {
      num;
    }
    return num;
  };

  const dateFun = function (num, den, z) {
    if ([1, 3, 5, 7, 8, 10, 12].includes(num) && den + z > 31) {
      den = den - 31 + z;
    } else if ([4, 6, 9, 11].includes(num) && den + z > 30) {
      den = den + z - 30;
    } else if (num === 2 && den + z > 28) {
      den = den + z - 28;
    } else {
      den = den + z;
    }
    return den;
  };

  let dateDaily = document.querySelectorAll(".date-daily");
  let timeHourly = document.querySelectorAll(".time-hourly");
  for (let i = 0; i < 8; i++) {
    timeHourly[i].innerHTML = `${timeArr[Number(hours) + i + 1]}`;
    if (`${timeArr[Number(hours) + i + 1]}` === "undefined") {
      timeHourly[i].innerHTML = `${
        timeArr[Number(hours) + i + 1 - timeArr.length]
      }`;
    }
    dateDaily[i].innerHTML =
      `${dayArr[day + i]} ` +
      dateFun(month, date, i) +
      "." +
      monthFun(month, date, i) +
      ".";
    if (`${dayArr[day + i]}` === "undefined") {
      dateDaily[i].innerHTML =
        `${dayArr[i + day - dayArr.length]} ` +
        dateFun(month, date, i) +
        "." +
        monthFun(month, date, i) +
        ".";
    }
  }
};

cardsInfo();
