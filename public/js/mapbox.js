const locations = JSON.parse(document.getElementById("map").dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1Ijoia2hhcnNoNzI1OCIsImEiOiJjbHJ0Ym9ma2owNWd6Mml0ZXRsZTNvYmVnIn0.qm-wf2MuPZwWI8nrz4-GFA';

var map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/kharsh7258/clrtee5dl00ki01o33rdmhp2j', // style URL
	// center: [-74.5, 40], // starting position [lng, lat]
	// zoom: 7, // starting zoom
    scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker 
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    // Add popup
    new mapboxgl.Popup({
        offset: 30
    }).setLngLat(loc.coordinates).setHTML(`<p>${loc.day} Day: ${loc.description}</p>`).addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});