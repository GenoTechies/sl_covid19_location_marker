const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
var bodyParser = require('body-parser');

const fs = require('fs');
let rawdata = fs.readFileSync('sinhala_songs_corpus.json');
let student = JSON.parse(jsonEscape(rawdata));
var lyrics_list = ""
for(var attributename in student){
   //console.log(student[attributename].lyrics);
   var single_lyrics= student[attributename].lyrics;
   lyrics_list=lyrics_list+"\\n"+single_lyrics
   //fs.writeFileSync('message.txt', single_lyrics.join(""));
}

fs.writeFileSync('student-2.txt', lyrics_list);

function jsonEscape(str)  {
   return str.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}

// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
//app.use(express.json());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
   extended: true
}));


// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', require('./routes/places'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

