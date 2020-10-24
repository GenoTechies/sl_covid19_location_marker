mapboxgl.accessToken = 'pk.eyJ1Ijoia3NhbmthbHBhIiwiYSI6ImNrZ2tuYXVxMjBqNGgycnFwajMyY2Rpb3UifQ.4XEbhyaiL5uCvKFpgMISXA';
var map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
  center: [80.632416, 7.29163], // Starting position [lng, lat]
  zoom: 7, // Starting zoom level
});

var marker = new mapboxgl.Marker() // Initialize a new marker
  .setLngLat([80.632416, 7.29163]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

var geocoder = new MapboxGeocoder({ // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: 'Search for places in Sri Lanka', // Placeholder text for the search bar
  bbox: [79.0000, 5.0000, 82.0000, 10.0000], // Boundary for Berkeley
  proximity: {
    longitude: -122.25948,
    latitude: 37.87221
  } // Coordinates of UC Berkeley
});

// Add the geocoder to the map
map.addControl(geocoder);

// After the map style has loaded on the page,
// add a source layer and default styling for a single point
map.on('load', function() {
  map.addSource('single-point', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addLayer({
    id: 'point',
    source: 'single-point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#448ee4'
    }
  });

//var placeValue = document.getElementById('place').value ;

var geometry;

  // Listen for the `result` event from the Geocoder
  // `result` event is triggered when a user makes a selection
  // Add a marker at the result's coordinates
  geocoder.on('result', function(ev) {
      console.log(ev.result);
      console.log(ev.result.text);
      //placeValue = ev.result;
      localStorage.setItem('cordinateObject', JSON.stringify(ev.result.geometry));
      localStorage.setItem('addressObject', JSON.stringify(ev.result.place_name));
      geometry =ev.result.geometry;
    map.getSource('single-point').setData(ev.result.geometry);
    document.getElementById('place').value= ev.result.text;
    //document.getElementById('place').innerHTML = ev.result.text;
  });
});
// Get places from API
async function getPlaces() {
    const res = await fetch('/api');
    const data = await res.json();

    let places = data.data.map(place => (
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [place.location.coordinates[0], place.location.coordinates[1]]
            },
            properties: {
                city: place.location.city
            }
        }
    ));

    return places;
};


// Handle user input
const form = document.getElementById('form');
var placeData = document.getElementById('place');
var description = document.getElementById('description');
var source = document.getElementById('source');
var date = document.getElementById('date');
var count = document.getElementById('count');

function handleChange() {
    if (source.value === '') {
        source.style.border = '3px solid lightcoral';
    } else {
        source.style.border = 'none';
    }
}

// Send POST to API to add place
async function addPlace(e) {
    e.preventDefault();

    //if (place.value === '') {
      //  place.placeholder = 'Please fill in an address';
        //return;
    //}
    if (source.value === '') {
        source.placeholder = 'Please fill in an soruce';
        return;
    }

    var cordinateObject = localStorage.getItem('cordinateObject');
    console.log('cordinateObject geometry');
    console.log(JSON.parse(cordinateObject));
    console.log(placeData.value);
    const sendBody = {
        address: placeData.value,
        descriptiontext:description.value,
        sourcetext:source.value,
        datetext:date.value,
        counttext:count.value,
        location: {
            type: 'Point',
            //coordinates: [JSON.parse(cordinateObject).coordinates[0], JSON.parse(cordinateObject).coordinates[1]],
            coordinates: [(JSON.parse(cordinateObject).coordinates[0]+(((Math.random() * 100) - 100)/10000)).toFixed(6), (JSON.parse(cordinateObject).coordinates[1]+(((Math.random() * 50) - 50)/10000)).toFixed(6)],
            city: placeData.value,
            formattedAddress: JSON.parse(localStorage.getItem('addressObject'))
        }
    };

    try {
        source.value = '';
        source.placeholder = 'Loading...';

        const res = await fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendBody)
        });

        if (res.status === 400) {
            throw Error;
        }
        
        if (res.status === 200) {
            source.style.border = 'none';
            source.placeholder = 'Succesfully added!';
            
            // Retrieve updated data
            //places = await getPlaces();

           // map.getSource('api').setData({
             //   type: 'FeatureCollection',
               // features: places
            //});
        }
    } catch (err) {
        source.placeholder = err;
        return;
    }
};

source.addEventListener('keyup', handleChange);
form.addEventListener('submit', addPlace);

