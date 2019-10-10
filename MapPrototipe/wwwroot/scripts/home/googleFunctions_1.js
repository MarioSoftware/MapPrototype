var map=null;
var marker = null;
var defaultCenter = null; 
var placeSearch, autocomplete;

var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name' 
};



function initAutocomplete() {
    geolocate(); 
    if (vm.$data.Longitud !== 0 || vm.$data.Latitud !== 0) {
       
        defaultCenter = { lat: vm.$data.Latitud, lng: vm.$data.Longitud }; 
    } else {

        if (!defaultCenter) {
            defaultCenter = { lng: -64.1943410221038, lat: -31.399427685778598 };//Cordoba  
        }
    } 
    
    var map = new google.maps.Map(document.getElementById('map'), {
        center: defaultCenter,
        zoom: 12,
        mapTypeId: 'satellite'
    }); 

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
   
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
         
        searchBox.setBounds(map.getBounds());
       

    });


    // Detectamos cuando hacen click para agregar el marker
    map.addListener('click', function (event) {
        addMarker(event.latLng);
    });

    // Agregamos el marker en la posicion por defecto
    addMarker(defaultCenter); 

    //Defino el input como autocomplete
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('pac-input'),{ types: ['geocode'] });

    //Escucho por cambios en el input para llenar textboxes y actualizar mapa
    autocomplete.addListener('place_changed', fillInAddress);
     
    function geolocate() { 
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                autocomplete.setBounds(circle.getBounds());
            }); 
        } 
    } 
 
    function actualizarMapa() { 
        // Recupero Lugar del Input
        var place = autocomplete.getPlace();
        //Asigno el lugar como Bound
        var bounds = new google.maps.LatLngBounds();
         
        
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            } 
        
        //Dibujo lugar 
            map.fitBounds(bounds);
        addMarker(bounds.getCenter()); 
    }
       
    function addMarker(location) {
        if (marker  !== null) {
            marker .setMap(null);
        }
        marker  = new google.maps.Marker({
            position: location,
            map: map
        });
       
        vm.$data.Latitud = typeof location.lat === 'function' ? location.lat() : location.lat;
        vm.$data.Longitud = typeof location.lng === 'function' ? location.lng() : location.lng;
        
        defaultCenter = { lat: vm.$data.Latitud, lng: vm.$data.Longitud };

        
    } 

    function fillInAddress() {
        actualizarMapa(); 
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();

        //for (var component in componentForm) {
        //    document.getElementById(component).value = '';
        //    document.getElementById(component).disabled = false;
        //}

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        //for (var i = 0; i < place.address_components.length; i++) {
        //    var addressType = place.address_components[i].types[0];
        //    if (componentForm[addressType]) {
        //        var val = place.address_components[i][componentForm[addressType]];
        //        document.getElementById(addressType).value = val;
              
        //    }
        //}
        vm.refreshVuePorperties();
    }
}

 
 