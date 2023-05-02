const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config()

//const User = require('../models/User.model');
const Location = require('../models/Location.model');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/* GET home page. */
router.get('/city-search', isLoggedIn, function (req, res, next) {
    res.render('locations/city-search.hbs');
});

router.post('/city-search', isLoggedIn, function (req, res, next) {
    const { city } = req.body;
    if(!city) {
        res.render('locations/city-search.hbs', { errorMessage: 'Please provide a valid city name.' });
    }
    const uri = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=100&appid=${process.env.API_KEY}`;
    axios.get(uri)
        .then((results) => {
            if (results.data.length) {
                res.render('locations/location-select', { locations: results.data });
            } else {
                res.render('locations/city-search.hbs', { errorMessage: 'No locations found.' });
            }
        })
        .catch((err) => {
            console.log(err)
            res.render('locations/city-search.hbs', { errorMessage: '500.' });
        })
});

router.get('/add-location', isLoggedIn, function (req, res, next) {
    const { lat, lon, name, state, country } = req.query;

    Location.find({
        name,
        state,
        country,
        user: req.session.user._id
    }).then((results) => {
        if(results.length){
            res.render('locations/city-search.hbs', { errorMessage: 'City already in your selection.' });
        } else {
            return Location.create({
                lat,
                lon,
                name,
                state,
                country,
                user: req.session.user._id
            }).then((result) => {
                res.redirect(`/`);
            })
        }
    })
});

router.get('/remove-location/:id', isLoggedIn, function (req, res, next) {
    const id = req.params.id;
    Location.findByIdAndDelete(id).then((result) => {
        res.redirect(`/`);
    })
});

module.exports = router;