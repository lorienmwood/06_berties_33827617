// Create a new router
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const request = require("request");

// use the global db defined in index.js
const db = global.db;


// routes/weather.js
router.get('/', function (req, res, next) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const city = req.query.city || 'London'; // default London for now
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if (err) {
      return res.render('weather', { error: 'Error contacting weather service', weather: null });
    }

    let data;
    try {
      data = JSON.parse(body);
    } catch (e) {
      return res.render('weather', { error: 'Error parsing weather data', weather: null });
    }

    if (data && data.main) {
      const weather = {
        name: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind && data.wind.speed,
        description: data.weather && data.weather[0] && data.weather[0].description,
      };

      res.render('weather', { error: null, weather });
    } else {
      res.render('weather', { error: 'No data found for that city.', weather: null });
    }
  });
});


// Export the router object so index.js can access it
module.exports = router;
