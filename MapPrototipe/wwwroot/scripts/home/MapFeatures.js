var marker = null;
var defaultCenter = null;
var placeSearch, autocomplete;
var map = null;

function DrawMap() { 
    if (vm.$data.Longitud !== 0 || vm.$data.Latitud !== 0) { 
        defaultCenter = { lat: vm.$data.Latitud, lng: vm.$data.Longitud };
    } else { 
        if (!defaultCenter) {
            defaultCenter = { lng: -64.1943410221038, lat: -31.399427685778598 };//Cordoba  
        }
    }

    map= new google.maps.Map(document.getElementById('map'), {
        center: defaultCenter,
        zoom: 19,
        mapTypeId: 'satellite'
    }); 

    addMarker(defaultCenter); 

    //Click Listener
    map.addListener('click', function (event) {
        addMarker(event.latLng);
    }); 

} 

function addMarker(location) {
    if (marker !== null) {
        marker.setMap(null);
    }
    marker = new google.maps.Marker({
        position: location,
        map: map
    });

    vm.$data.Latitud = typeof location.lat === 'function' ? location.lat() : location.lat;
    vm.$data.Longitud = typeof location.lng === 'function' ? location.lng() : location.lng;

    defaultCenter = { lat: vm.$data.Latitud, lng: vm.$data.Longitud };
} 
 