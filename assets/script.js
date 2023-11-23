var searchButton = document.getElementById("searchButton");
var searchHistory = document.getElementById("searchHistory");
var cityName = document.querySelector(".cityName");
var temp = document.querySelector('.temp');
var wind = document.querySelector('wind');
var humidty = document.querySelector('humidty');
var cardContainer = document.getElementById("fiveDayCards");
var cityToSearch = document.getElementById('searchForm');
var apiKey = "53a5d7cd95056d4670ee8a21a7e50e28";
var lat;
var lon;

function searchHandler(event) {
    let value = cityToSearch.value.trim();
    getCoordinates(value);
    console.log(lat, lon);

    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(response => {
        if(!response.ok) {
            throw new Error("Failed HTTP code " + response.status);
        }
        return response;
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        
    })
    .catch(err => {
        console.error(err);
    })
}

function getCoordinates(city) {
    let value = city;

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=1&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {

        lat = data[0].lat.toFixed(2);
        lon = data[0].lon.toFixed(2);
    });
}

searchButton.addEventListener("click", searchHandler);