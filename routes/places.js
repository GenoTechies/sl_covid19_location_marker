const express = require('express');
const { getPlaces, addPlace } = require('../controllers/places');
const { getCenters, addCenter} = require('../controllers/medical_centers');

const router = express.Router();

router
    .route('/')
    .get(getPlaces)
    .post(addPlace);

router
    .route('/medical')
    .get(getCenters)
    .post(addCenter);

module.exports = router;