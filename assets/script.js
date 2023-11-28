var searchButton = document.getElementById("searchButton");
var searchHistory = document.getElementById("searchHistory");
var cityName = document.querySelector(".cityName");
var iconSpan = document.querySelector(".iconSpan");
var currentDate = document.querySelector(".currentDate");
var temp = document.querySelector('.temp');
var wind = document.querySelector('.wind');
var humidity = document.querySelector('.humidity');
var cardContainer = document.getElementById("fiveDayCards");
var cityToSearch = document.getElementById('searchForm');
var clearHistory = document.getElementById("clearHistory");
var pastSearches = [];
var apiKey = "53a5d7cd95056d4670ee8a21a7e50e28";
var lat;
var lon;
let value;

function getCoordinates(event) {
    if(event.target.matches(".past")) {
        value = event.target.textContent;
    } else {
        value = cityToSearch.value.trim();
    }
    

    // call api to find latitude and longitude of user search  
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=1&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {

        if (data) {
            lat = data[0].lat;
            lon = data[0].lon;
            searchHandler();
        }
    })
    .catch(err => {
        console.error(err);
    })
}

function searchHandler() {
        // call both APIs for current weather and 5-day forecast using below lat and lon values
        Promise.all([
            fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`),
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        ])
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then((data) => {
                console.log(data);
                
                
                let unixDate = data[1].dt;
                let date = new Date(unixDate * 1000);

                // Updating onscreen values for currentCity
                let hiddenValues = document.querySelectorAll(".hidden");
                for (let i = 0; i < hiddenValues.length; i++) {
                    hiddenValues[i].style.visibility = "visible";
                }

                currentDate.textContent = date;
                cityName.textContent = data[1].name;
                iconSpan.innerHTML = `
                        <span class="currentCityImage">
                            <img src="https://openweathermap.org/img/wn/${data[1].weather[0].icon}@2x.png"><img>
                        </span>
                    `
                temp.textContent = data[1].main.temp;
                wind.textContent = data[1].wind.speed;
                humidity.textContent = data[1].main.humidity;

                // create 5-day forecast cards and append onscreen
                createCards(data);
                searchHistoryHandler(data[1].name);
            })
            .catch(err => {
                console.error(err);
            });
}

function createCards(data) {
    cardContainer.innerHTML = "";
    var index = 2;

    for (let i = 0; i < 5; i++) {

        let unixDate = data[0].list[index].dt;
        let date = new Date(unixDate * 1000);

        // create individual cards
        const forecastCard = document.createElement("div");
        forecastCard.setAttribute("class", "card col border border-primary mx-1");
        forecastCard.innerHTML = `
            <div class="card-header">${date.toLocaleDateString("en-US")}</div>
            <div class="card-body">
                <span class="cardImage">
                    <img src="https://openweathermap.org/img/wn/${data[0].list[index].weather[0].icon}@2x.png"><img>
                </span>

                <p>Temp: ${data[0].list[index].main.temp}°F</p>

                <p>Wind: ${data[0].list[index].wind.speed} MPH</p>

                <p>Humidity: ${data[0].list[index].main.humidity}%</p>
            </div>
        `;

        // append to container
        cardContainer.append(forecastCard);
        // data returns in 3-hour intervals, so every 8 indexes marks a 24 hour cycle
        index += 8;
    }
}

function searchHistoryHandler(cityName) {
    if(pastSearches.includes(cityName)) {
        return;
    } else {
        const newButton = document.createElement("button");
        newButton.setAttribute("class", "btn btn-primary btn-lg mb-3 past");
        newButton.textContent = cityName;

        searchHistory.prepend(newButton);
        pastSearches.unshift(cityName);
        storeSearched();
    }
}

function storeSearched() {
    localStorage.setItem("pastSearches", JSON.stringify(pastSearches));
}

function init() {
    var storedSearches = JSON.parse(localStorage.getItem("pastSearches"));

    if(storedSearches !== null) {
        pastSearches = storedSearches;
        clearHistory.style.visibility = "visible"; 
    }
    for (let i = 0; i < pastSearches.length; i++) {
        const newButton = document.createElement("button");
        newButton.setAttribute("class", "btn btn-primary btn-lg mb-3 past");
        newButton.textContent = pastSearches[i];

        searchHistory.append(newButton);
    }
}

function clear() {
    window.localStorage.clear();

    searchHistory.innerHTML = "";
    clearHistory.style.visibility = "hidden";

    pastSearches = [];
} 


searchButton.addEventListener("click", getCoordinates);
searchHistory.addEventListener("click", getCoordinates);
clearHistory.addEventListener("click", clear);

init();