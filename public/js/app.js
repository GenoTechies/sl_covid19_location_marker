mapboxgl.accessToken = 'pk.eyJ1Ijoia3NhbmthbHBhIiwiYSI6ImNrZ2tuYXVxMjBqNGgycnFwajMyY2Rpb3UifQ.4XEbhyaiL5uCvKFpgMISXA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [ 80.77,7.87], // starting position
zoom: 7 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

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
                city: place.location.city,
                description:place.properties.description,
                orignateddate:place.properties.orignateddate,
                source:place.properties.source,
                icon:place.properties.icon
            }
        }
    ));

    return places;
};

// Show places on map
async function showMap() {
    let places = await getPlaces();

    map.on('load', () => {

        map.addSource('api', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: places
            }
        });



        map.addLayer({
            id: 'api',
            type: 'symbol',
            minzoom: 0,
            source: 'api',
            layout: {
                'icon-image': 'marker-15',
                'icon-allow-overlap': false,
                'text-allow-overlap': false,
                'icon-size': 3,
                'text-field': '{city}',
                'text-offset': [0, 0.9],
                'text-anchor': 'top'
            },
            paint: {
                "text-color": "red"
            },
        });
        //map.setMaxBounds(bounds);

        // Retrieving API data every second
        // window.setInterval(async () => {
        //     places = await getPlaces();

        //     map.getSource('api').setData({
        //         type: 'FeatureCollection',
        //         features: places
        //     });

        // }, 1000);


        // When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
    map.on('click', 'api', function (e) {
        console.log('click');
        console.log(e)
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;
    var source = e.features[0].properties.source;
    var date = e.features[0].properties.orignateddate;
     
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description+'<br/>'+source+'<br/>'+date)
    .addTo(map);
    });
     
    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'api', function () {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'api', function () {
    map.getCanvas().style.cursor = '';
    });

    });
};


// Render places
showMap();