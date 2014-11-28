var googleMap;
var oldLat = null;
var oldLng = null;

$(function() {
        if(navigator.geolocation) {
                //initialise la map
                googleMap = new google.maps.Map($("#googleMap").get(0), {
                        zoom: 17,
                        center: new google.maps.LatLng(48.9021450, 2.46992090),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                });
               
                startLocalisation();   
        } else {
                alert('Votre navigateur ne supporte pas la géolocalisation HTML5');
        }
});

function startLocalisation() {
        //active le GPS
        var userPosition = navigator.geolocation.watchPosition(callbackSuccess, callbackError, {enableHighAccuracy: true});
}

function callbackSuccess(position) {
        //récupère la latitude et la longitude
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
       
        //trace un marqueur
        var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map: googleMap
        });
       
        //centre la map aux coordonnées voulue
                googleMap.panTo(new google.maps.LatLng(latitude, longitude));
       
        //trace une ligne entre lancienne position et la nouvelle
        if(oldLat) {
       
                var lines = [
                                new google.maps.LatLng(oldLat, oldLng),
                                new google.maps.LatLng(latitude, longitude)
                ];
               
                //dessine les lignes
                var line = new google.maps.Polyline({
                                path: lines,
                                strokeColor: "red",
                                strokeOpacity: 1.0,
                                strokeWeight: 3,
                                map: googleMap
                });
        }
       
        //actualise les anciennes positions
        oldLat = latitude;
        oldLng = longitude;
}

function callbackError(error) {
        switch(error.code) {
                case error.UNKNOWN_ERROR:
                                alert("La géolocalisation a rencontré une erreur.");
                break;
                case error.PERMISSION_DENIED:
                                alert("L'utilisateur n'a pas voulu donner sa position.");
                break;
                case error.POSITION_UNAVAILABLE:
                                alert("Les coordonnées de l'utilisateur n'ont pas pu être trouvées.");
                break;
                case error.TIMEOUT:
                                alert("La géolocalisation prend trop de temps.");
                break;
        }
}

function stopGeolocalisation(){
        navigator.geolocation.clearWatch(userPosition);
}