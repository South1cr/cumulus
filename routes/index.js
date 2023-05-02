const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config()

//const User = require('../models/User.model');
const Location = require('../models/Location.model');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

const getWeatherImage = (weatherNode) => {
  const { weather, rain } = weatherNode.current;
  console.log(rain);
  const src = `images/${weather[0].icon}.png`;
  return src;
}

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  const user = req.session.user;
  Location.find({
    user: user._id
  })
    .then((locations) => {
      let promises = [];
      locations.forEach((location) => {
        const uri = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&units=imperial&exclude=minutely,hourly,daily,alerts&appid=${process.env.API_KEY}`
        promises.push(axios.get(uri))
      })

      Promise.all(promises)
        .then((fulfilled) => {
          let weather = fulfilled.map(v => v.data);
          weather.forEach((elem, i) => {
            elem._location = locations[i];
            elem._imgUrl = getWeatherImage(elem);
          });
          console.log(weather)
          res.render('index.hbs', { locations: weather })
        });
    })
});

router.get('/details/:id', isLoggedIn, function (req, res, next) {
  const id = req.params.id;
  Location.findById(id)
    .then((location) => {
      const uri = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&units=imperial&appid=${process.env.API_KEY}`
      axios.get(uri)
        .then((result) => {
          weather = result.data;
          weather._location = location;
          weather._imgUrl = getWeatherImage(weather);
          console.log(weather);
          res.render('details.hbs', { weather })
        })
        .catch()
    })


});

module.exports = router;
