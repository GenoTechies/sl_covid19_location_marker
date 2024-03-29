const Place = require('../models/Place');

// Add a plce
// Route: /api
exports.addPlace = async (req, res, next) => {
    try {
        const place = await Place.create(req.body);
        console.log('write');
        console.log(place);
        return res.status(200).json({
            success: true,
            data: place
        });
    } catch (err) {
        console.log(err);
        res.status(500);
    }
};

// Get all places
// Route: /api
exports.getPlaces = async (req, res, next) => {
    console.log('get method');
    try {
        const places = await Place.find().limit(700);
        return res.status(200).json({
            succes: true,
            count: places.length,
            data: places
        })
    } catch (err) {
        console.log(err);
        res.status(500);
    }
};



exports.getPlacesByDate = async (req, res, next) => {
   // console.log('getPlacesByDate method');
    const startdate = req.query.startdate;
    const enddate = req.query.enddate;
   // console.log(startdate,enddate);
    try {
        //const places = await Place.find().limit(700);
        const places = await Place.find({
            datetext: {
                $gte:startdate,
                $lt: enddate
            }
        })
        return res.status(200).json({
            succes: true,
            count: places.length,
            data: places
        })
    } catch (err) {
        console.log(err);
        res.status(500);
    }
};