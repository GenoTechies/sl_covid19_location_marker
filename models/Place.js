const mongoose = require('mongoose');
const geoCoder = require('../utils/geocoder');

const PlaceSchema = new mongoose.Schema({
    descriptiontext:String,
    datetext:String,
    sourcetext:String,
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    properties: {
        description:String,
        source:String,
        orignateddate:Date,
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
    console.log('this.descriptiontext');
    console.log(this.descriptiontext);
    this.location = {
        type: 'Point',
        coordinates: [(loc[0].longitude+(((Math.random() * 5) - 5)/1000)).toFixed(6), (loc[0].latitude+(((Math.random() * 2) - 2)/1000)).toFixed(6)],
        city: loc[0].city,
        formattedAddress: loc[0].formattedAddress
    };
    this.properties= {
        description:this.descriptiontext,
        orignateddate:new Date(this.datetext),
        source:this.sourcetext,
        icon:'bar'
    };
      // Do not save address
    this.address = undefined;
    next();
});

module.exports = mongoose.model('Place', PlaceSchema);