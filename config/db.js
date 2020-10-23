const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

       
        mongoose.connection
                .once("open", function () {
                    //console.log("DB Connected!");
                    console.log(`MongoDB connected: ${conn.connection.host}`);
                })
                .on("error", function (error) {
                    console.log("Error is: ", error);
                });
                
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;