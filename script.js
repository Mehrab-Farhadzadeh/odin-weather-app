function processData(data) {
   return {
      address: data.address,
      currentTemp: data.currentConditions.temp,
      currentCondition: data.currentConditions.conditions,
   };
}

async function getGif(searchTerm) {
   const API_KEY = "MYz5hujNezc7jKzm6F5zAX8N04cbGmcD";
   const BASE_URL = "https://api.giphy.com/v1/stickers/translate";
   const url = BASE_URL + "?api_key=" + API_KEY + "&s=" + searchTerm;
   try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(response.status);
      const json = await response.json();
      return json.data.images.original.url;
   } catch (e) {
      (e) => addToDom();
   }
}

async function addToDom(processedData) {
   const output = document.querySelector("output");
   const dataEl = document.createElement("p");
   const imgEl = document.createElement("img");

   if (processedData === undefined) {
      dataEl.textContent = "Bad request!";
      imgEl.src = await getGif("Bad request!");
   } else {
      dataEl.textContent =
         processedData.address +
         ": " +
         processedData.currentTemp +
         " " +
         processedData.currentCondition;
      // add gif src
      imgEl.src = await getGif(processedData.currentCondition);
   }
   output.innerHTML = "";
   output.appendChild(dataEl);
   output.append(imgEl);
}

function getWeather(location, unitGroup) {
   if (!location) return;

   const API_KEY = "YJSERCWKDFQ4WZPR5BAH4SQN9";
   const BASE_URL =
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
   const UNIT_GROUP = {
      centigrade: "metric",
      fahrenheit: "us",
   };
   const url =
      BASE_URL +
      location +
      "?unitGroup=" +
      UNIT_GROUP[unitGroup] +
      "&key=" +
      API_KEY +
      "&contentType=json";
   fetch(url)
      .then((response) => {
         if (!response.ok) throw new Error(response.status);
         return response.json();
      })
      .then(processData)
      .then(addToDom)
      .catch((e) => addToDom());
}

function submitForm() {
   const formEl = document.querySelector("form");
   formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      document.querySelector("output p").textContent = "Loading...";
      const LOADING_GIF_URL =
         "https://media4.giphy.com/media/v1.Y2lkPWI5MzkyODBlNmY0cHo1bjJnaWtjcmcxYXduNTJ1cWc2b3owOW5kMWtib2F0bnEzYyZlcD12MV9zdGlja2Vyc190cmFuc2xhdGUmY3Q9cw/cvSf28B7CM3aPuCMDC/giphy.gif";
      document.querySelector("output img").src = LOADING_GIF_URL;
      getWeather(e.target["location"].value, e.target["units"].value);
   });
}

submitForm();
