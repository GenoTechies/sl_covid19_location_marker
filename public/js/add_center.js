mapboxgl.accessToken = '';
var map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
  center: [130.8456, -12.4634], // Starting position [lng, lat]
  zoom: 10, // Starting zoom level
});
// Add zoom and rotation controls to the map.
//map.addControl(new mapboxgl.NavigationControl());

var marker = new mapboxgl.Marker() // Initialize a new marker
  .setLngLat([130.8456, -12.4634]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

var geocoder = new MapboxGeocoder({ // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: 'Search for places in Nothern Territory', // Placeholder text for the search bar
  bbox: [129.0000, -26.0000, 138.0000,-12.0000 ], // Boundary for Berkeley
  proximity: {
    longitude: 130.8456,
    latitude: -12.4634
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
var place = document.getElementById('place');


function handleChange() {
    if (place.value === '') {
      place.style.border = '3px solid lightcoral';
    } else {
      place.style.border = 'none';
    }
}

// Send POST to API to add place
async function addMCenter(e) {
    e.preventDefault();

  if (place.value === '') {
        place.placeholder = 'Please fill in an address';
      return;
    }
   

    var cordinateObject = localStorage.getItem('cordinateObject');
    console.log('cordinateObject geometry');
    console.log(JSON.parse(cordinateObject));
    console.log(place.value);
    const sendBody = {
        name: place.value,
        address: place.value,
        location: {
            type: 'Point',
            //coordinates: [JSON.parse(cordinateObject).coordinates[0], JSON.parse(cordinateObject).coordinates[1]],
            coordinates: [(JSON.parse(cordinateObject).coordinates[0]+(((Math.random() * 5) - 5)/100000)).toFixed(6), (JSON.parse(cordinateObject).coordinates[1]+(((Math.random() * 2) - 2)/100000)).toFixed(6)],
            city: place.value,
            formattedAddress: JSON.parse(localStorage.getItem('addressObject'))
        }
    };

    try {
      place.value = '';
        place.placeholder = 'Loading...';

        const res = await fetch('/api/medical', {
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
          place.style.border = 'none';
            place.placeholder = 'Succesfully added!';
            
            // Retrieve updated data
            //places = await getPlaces();

           // map.getSource('api').setData({
             //   type: 'FeatureCollection',
               // features: places
            //});
        }
    } catch (err) {
      place.placeholder = err;
        return;
    }
};

place.addEventListener('keyup', handleChange);
form.addEventListener('submit', addMCenter);

