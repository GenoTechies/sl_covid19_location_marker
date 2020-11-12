const Place = require('../models/MCenter');

// Add a plce
// Route: /api
exports.addCenter = async (req, res, next) => {
    try {
        const place = await Place.create(req.body);
        console.log('post method centers');
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
exports.getCenters = async (req, res, next) => {
    console.log('get method centers');
    try {
        const places = await Place.find();
        //res.type('json');
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