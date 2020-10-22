const mongoose = require('mongoose');
const geoCoder = require('../utils/geocoder');

const PlaceSchema = new mongoose.Schema({
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    properties: {
        description:String,
        icon: String
        },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        city: String
    },
    
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// Before saving, convert address to geoCode
PlaceSchema.pre('save', async function(next) {
    const loc = await geoCoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        city: loc[0].city,
        formattedAddress: loc[0].formattedAddress
    };
    this.properties= {
        description:'<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a <a href="http://tallulaeatbar.ticketleap.com/2012beachblanket/" target="_blank" title="Opens in a new window">Big Backyard Beach Bash and Wine Fest</a> on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.grill hot dogs.</p>',
        icon:'bar'
    };
      // Do not save address
    this.address = undefined;
    next();
});

module.exports = mongoose.model('Place', PlaceSchema);