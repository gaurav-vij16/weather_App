const usertab = document.querySelector("[userWeather]");
const searchtab = document.querySelector("[searchweather]");

const grantlocation = document.getElementsByClassName("grant-location-container")[0];
const searchForm = document.getElementsByClassName("searchForm-conatiner")[0];
const loadingScreen = document.getElementsByClassName("loadingScreen")[0];
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(".grant-location-container");

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

let currentTab = usertab;
currentTab.classList.add("current-Tab");

usertab.addEventListener('click' , function() {
    console.log(index);
    switchTab(usertab);
});

searchtab.addEventListener('click' , function() {
    switchTab(searchtab);
});

function switchTab(newTab) {
    if(currentTab != newTab) {
        currentTab.classList.remove("current-Tab");
        currentTab = newTab;
        currentTab.classList.add("current-Tab");

        if(!searchForm.classList.contains("active")) {
            grantlocation.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active"); 
        } else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            checkLocalCoords();
        }  
    }
}

function checkLocalCoords() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantlocation.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat , lon} = coordinates;

    grantlocation.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        showWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        grantlocation.classList.add("active");
    }
}

function showWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") return;
    else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        showWeatherInfo(data);
    } catch(err) {
        // Handle error
    }
}
