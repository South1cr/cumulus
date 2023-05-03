const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config()

//const User = require('../models/User.model');
const Location = require('../models/Location.model');

const { isLoggedIn } = require('../middleware/route-guard.js');

const getDate = (daysPlus) => {
  let date = new Date();
  date.setDate(date.getDate() + daysPlus);
  return date;
}

const getWeatherImage = (weatherNode) => {
  const { weather } = weatherNode;
  //console.log(weather)
  const src = `/images/${weather[0].icon}.png`;
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
      console.log(user)
      locations.forEach((location) => {
        const uri = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&units=${user.units}&exclude=minutely,hourly,daily,alerts&appid=${process.env.API_KEY}&sauce=${Math.random()}`
        promises.push(axios.get(uri))
      })

      Promise.all(promises)
        .then((fulfilled) => {
          let weather = fulfilled.map(v => v.data);
          weather.forEach((elem, i) => {
            elem._location = locations[i];
            elem._units = user.units;
            elem.current._imgUrl = getWeatherImage(elem.current);
          });
          res.render('index.hbs', { weather });
        })
        .catch((err) => {
          console.log('error in weather api', err)
        })
    })
});

router.get('/details/:id', isLoggedIn, function (req, res, next) {
  const user = req.session.user;
  const id = req.params.id;
  Location.findById(id)
    .then((location) => {
      const uri = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&units=${user.units}&exclude=minutely,hourly&appid=${process.env.API_KEY}&sauce=${Math.random()}`
      console.log(uri);
      axios.get(uri)
        .then((result) => {
          weather = result.data;
          weather._location = location;
          weather.current._imgUrl = getWeatherImage(weather.current);
          weather.daily.forEach((elem, i) => {
            elem._imgUrl = getWeatherImage(elem);
            elem._date = getDate(i);
            elem._units = user.units;
          })
          res.render('details.hbs', { weather });
        })
        .catch((err) => {
          console.log('error in details weather api', err)
        })
    })


});

module.exports = router;
