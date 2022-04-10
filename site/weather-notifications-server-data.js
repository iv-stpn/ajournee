import fetch from 'node-fetch';

const getWeatherData = (city) =>
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_WEATHER_API_KEY`
    ).then((response) =>
        response.json().then((responseContent) => ({
            maxTemperature: responseContent.main.temp_max,
            minTemperature: responseContent.main.temp_min,
            temperature: responseContent.main.temp,
            weatherIcon: `http://openweathermap.org/img/w/${responseContent.weather[0].icon}.png`,
            weatherName: responseContent.weather[0].main,
            windSpeed: responseContent.wind.speed
        }))
    );