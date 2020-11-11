const mongoose = require('mongoose');
const geoCoder = require('../utils/geocoder');

const MCenterSchema = new mongoose.Schema({
    name:String,
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// Before saving, convert address to geoCode
MCenterSchema.pre('save', async function(next) {
    //const loc = await geoCoder.geocode(this.address);
    console.log('this.save');
   
    this.properties= {
        name:this.name,
        icon:'bar'
    };
      // Do not save address
    this.address = undefined;
    next();
});

module.exports = mongoose.model('MCenter', MCenterSchema);