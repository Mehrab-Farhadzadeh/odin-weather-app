function processData(data) {
   return {
      address: data.address,
      currentTemp: data.currentConditions.temp,
      currentCondition: data.currentConditions.conditions,
   };
}

async function getGif(searchTerm) {
   const API_KEY = "MYz5hujNezc7jKzm6F5zAX8N04cbGmcD";
   const BASE_URL = "https://api.giphy.com/v1/gifs/translate";
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
   output.innerHTML = "";
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
      getWeather(e.target["location"].value, e.target["units"].value);
   });
}

submitForm();
