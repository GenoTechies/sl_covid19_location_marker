const mongoose = require('mongoose');
const geoCoder = require('../utils/geocoder');

const PlaceSchema = new mongoose.Schema({
    descriptiontext:String,
    datetext:String,
    sourcetext:String,
    counttext:Number,
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    properties: {
        description:String,
        source:String,
        orignateddate:Date,
        count:Number,
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
    //const loc = await geoCoder.geocode(this.address);
    console.log('this.address');
    console.log(this.address);
   
    this.properties= {
        description:this.descriptiontext,
        orignateddate:new Date(this.datetext),
        source:this.sourcetext,
        count:this.counttext,
        icon:'bar'
    };
      // Do not save address
    this.address = undefined;
    next();
});

module.exports = mongoose.model('Place', PlaceSchema);