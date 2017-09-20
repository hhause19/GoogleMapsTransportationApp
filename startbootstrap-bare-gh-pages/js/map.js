//hold the points added 
var wayPoints = [];
var ways = []; 

function initMap() {
    
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.391157, lng: -72.526712},
        zoom: 14
                                  
    });
    
    //only create one to avoid dupe routes.
    var directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: true,
            preserveViewport: true,
            suppressMarkers: false, //false if you want new marker
            polylineOptions: {
                strokeColor: 'green',
                strokeColor: 1.0,
                strokeWeight: 3
            }
        });
    
    //directions service obj. 
    var directionsService = new google.maps.DirectionsService();
    
    //var infoWindow = new google.maps.InfoWindow();
    
    //waits for some input frome the user
    map.addListener('click', function(e) {
        //to place marker
        placeMarker(e.latLng, map);        

        //push first point to array
        wayPoints.push({
            location:e.latLng,
            stopover:true
        });
        
        //if the size greater two, convert waypoints
        if(wayPoints.length>2) {
            ways = [];
            for(var i = 1; i <= wayPoints.length - 2 ; i++) {
                ways.push({
                    location:wayPoints[i].location,
                    stopover:true
                });
            }
        }
        
        //draw the route
        makeRoute(wayPoints);
    });
    
    //if a marker is dragged then recalculate the distance
    directionsDisplay.addListener('directions_changed', function(e) {
        computeTotalDistance(directionsDisplay.getDirections());
        //also need to push it to the array or something so when adding a new point it doesnt repo. 
    });
        
    <!-- *******************route between markers***********-->
        
    function makeRoute(wayPoints) {
        
        var start = wayPoints[0].location;
        var end = wayPoints[wayPoints.length-1].location;
        
        
        if(wayPoints.length>1) {
            var request = {
                unitSystem: google.maps.UnitSystem.IMPERIAL,// : google.maps.UnitSystem.IMPERIAL,
                origin: start, 
                destination: end,
                waypoints: ways, 
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            directionsService.route(request, function(response, status) {
                if(status == google.maps.DirectionsStatus.OK) {
                    
                    directionsDisplay.setDirections(response);
                    
                    //compute the total distance of the route
                    computeTotalDistance(response);
                    
                    
                }
            });
                    
            directionsDisplay.setMap(map);
            google.maps.event.addDomListener(window, 'load', initMap);
        }
    }
    
    document.getElementById('end').addEventListener('click', function() {
          //change the state of the panel
    });
}


function placeMarker(position, map) {
    var marker = new google.maps.Marker({
        position: position,
    });
    
    map.addListener(marker, 'dragend', function(e) {
        marker.setPosition(e);
    });
}

function addInfoWindow(marker, distance) {

    var infoWindow = new google.maps.InfoWindow({
        content: message
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
    });
}

//takes the result of the directions and calcs total distance. 
function computeTotalDistance(result) {
    var total = 0; 
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total /= 1609.344; 
    total = parseFloat(Math.round(total * 100) / 100).toFixed(2);
    document.getElementById('total-distance').innerHTML = total + ' miles';
}

google.maps.event.addDomListener(window, 'load', initMap);
