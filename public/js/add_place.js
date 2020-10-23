mapboxgl.accessToken = 'pk.eyJ1Ijoia3NhbmthbHBhIiwiYSI6ImNrZ2tuYXVxMjBqNGgycnFwajMyY2Rpb3UifQ.4XEbhyaiL5uCvKFpgMISXA';


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
const place = document.getElementById('place');
var description = document.getElementById('description');
var source = document.getElementById('source');
var date = document.getElementById('date');
var count = document.getElementById('count');

function handleChange() {
    if (place.value === '') {
        place.style.border = '3px solid lightcoral';
    } else {
        place.style.border = 'none';
    }
}

// Send POST to API to add place
async function addPlace(e) {
    e.preventDefault();

    if (place.value === '') {
        place.placeholder = 'Please fill in an address';
        return;
    }
    if (source.value === '') {
        source.placeholder = 'Please fill in an soruce';
        return;
    }

    console.log('description.value');
    console.log(description.value);
    const sendBody = {
        address: place.value,
        descriptiontext:description.value,
        sourcetext:source.value,
        datetext:date.value,
        counttext:count.value
    };

    try {
        place.value = '';
        place.placeholder = 'Loading...';

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
            place.style.border = 'none';
            place.placeholder = 'Succesfully added!';
            
            // Retrieve updated data
            places = await getPlaces();

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
form.addEventListener('submit', addPlace);

