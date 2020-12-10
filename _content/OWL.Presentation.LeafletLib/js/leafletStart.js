var OWLLeaflet = OWLLeaflet || {};
OWLLeaflet.parent = this;
OWLLeaflet.loadMap = async function loadMap(el, _dotNetRef) {

    var map = L.map(el, {maxZoom: 17.5});
    // map.setView([51.98991, 8.76867], 9);

    map.on('zoom', function(){_dotNetRef.invokeMethodAsync('OnZoomEvent',map.getZoom());})
    map.on('move', function(){var center=map.getCenter();_dotNetRef.invokeMethodAsync('OnMoveEvent',center.lat,center.lng);})

    var scale = L.control.scale({imperial:false});
    scale.addTo(map);
    // OWLLeaflet.addCustomControl(map,document.getElementById('travelSelectors'),'topright');

    var attr = document.getElementsByClassName( 'leaflet-control-attribution' )[0];
    L.DomUtil.addClass(attr, 'row row--no-wrap');

    return OWLUtils.storeObjectRef(map);
}

OWLLeaflet.loadScene = function loadScene(_map, _hereAPIKey){
    var owlLightLayer = Tangram.leafletLayer({
        scene: '_content/OWL.Presentation.LeafletLib/map/owlLight.yaml',
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; HERE'
    }),
        owlDarkLayer = Tangram.leafletLayer({
        scene: '_content/OWL.Presentation.LeafletLib/map/owlDark.yaml',
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; HERE'
    });

    // Inject Here API key on load or update
    owlLightLayer.scene.subscribe({
        load: function (msg) {
            injectAPIKey(msg.config);
        },
        update: function (msg) {
            injectAPIKey(msg.config);
        },
        view_complete: function (msg) {
            // new set of map tiles was rendered
            var event = new CustomEvent("view_complete", { "detail": msg });
            document.dispatchEvent(event);
        }
    });

    owlDarkLayer.scene.subscribe({
        load: function (msg) {
            injectAPIKey(msg.config);
        },
        update: function (msg) {
            injectAPIKey(msg.config);
        },
        view_complete: function (msg) {
            // new set of map tiles was rendered
            var event = new CustomEvent("view_complete", { "detail": msg });
            document.dispatchEvent(event);
        }
    });

    function injectAPIKey(config) {
        for (var name in config.sources) {
            var source = config.sources[name];
            if (typeof source.url === 'string' && source.url.indexOf('hereapi.com') > -1) {
                source.url_params = source.url_params || {};
                source.url_params.apikey = _hereAPIKey;
            }
        }
    }

    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    if (prefersDarkScheme.matches) {
        owlDarkLayer.addTo(_map);
        owlLightLayer.remove(_map);
    } else {
        owlLightLayer.addTo(_map);
        owlDarkLayer.remove(_map);
    }

    owlDarkLayer.on('add', (e)=>{
        document.documentElement.style
        .setProperty('--border-color', 'white');
    });

    owlLightLayer.on('add', (e)=>{
        document.documentElement.style
        .setProperty('--border-color', 'black');
    });
}

OWLLeaflet.addMarker = function addMarker(mapRef,lat,lng){
    var marker = L.marker([lat,lng]);
    marker.addTo(mapRef);
    return OWLUtils.storeObjectRef(marker);
}

OWLLeaflet.addPositionMarker = function addPositionMarker(mapRef,_dotNetRef,lat,lng,nearestStartingPoint){
    var yellowIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
        shadowUrl: '../_content/OWL.Presentation.LeafletLib/img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
        });
    
    mapRef.positionMarker = L.marker([lat,lng],
    {
        icon: yellowIcon,
        draggable: 'true',
        autoPan: 'true',
        zIndexOffset: 500
    }).addTo(mapRef);
    
    mapRef.positionMarker.on('dragend', function(event) {
        var marker = event.target;
        var position = marker.getLatLng();
        if(!!nearestStartingPoint){
            var url = nearestStartingPoint.replace("$lat",position.lat).replace("$lng",position.lng);
            fetch(url)
            .then(res => res.json())
            .then((out) => {
                markerLatLng = L.latLng(out[0],out[1]);
                marker.setLatLng(markerLatLng);
                _dotNetRef.invokeMethodAsync('OnDragEnd',markerLatLng.lat,markerLatLng.lng);
            })
            .catch(err => { throw err });
        }
        else{
            _dotNetRef.invokeMethodAsync('OnDragEnd',position.lat,position.lng);
        }
    });

    return OWLUtils.storeObjectRef(mapRef.positionMarker);
}

OWLLeaflet.addCustomControl = function addCustomControl(mapRef, element, position){
    if(position==='topleft'){
        if(!!mapRef.TopLeftControl){mapRef.TopLeftControl.remove(mapRef)}
        mapRef.TopLeftControl = L.Control.extend({
            onAdd: function(map) {
                element.remove();
                return element;
            },
        
            onRemove: function(map) {
                // Nothing to do here
            }    
        });
        if(!!element){(new mapRef.TopLeftControl({ position: 'topleft'})).addTo(mapRef)};
    } else if(position==='topright') {
        if(!!mapRef.TopRightControl){mapRef.TopRightControl.remove(mapRef)}
        mapRef.TopRightControl = L.Control.extend({
            onAdd: function(map) {
                element.remove();
                return element;
            },
        
            onRemove: function(map) {
                // Nothing to do here
            }    
        });
        if(!!element){(new mapRef.TopRightControl({ position: 'topright'})).addTo(mapRef);}
    } else if(position==='bottomleft') {
        if(!!mapRef.BottomLeftControl){mapRef.BottomLeftControl.remove(mapRef)}
        mapRef.BottomLeftControl = L.Control.extend({
            onAdd: function(map) {
                element.remove();
                return element;
            },
        
            onRemove: function(map) {
                // Nothing to do here
            }    
        });
        if(!!element){(new mapRef.BottomLeftControl({ position: 'bottomleft'})).addTo(mapRef);}
    } else if(position==='bottomright') {
        if(!!mapRef.BottomRightControl){mapRef.BottomRightControl.remove(mapRef)}
        mapRef.BottomRightControl = L.Control.extend({
            onAdd: function(map) {
                element.remove();
                return element;
            },
        
            onRemove: function(map) {
                // Nothing to do here
            }    
        });
        if(!!element){(new mapRef.BottomRightControl({ position: 'bottomright'})).addTo(mapRef);}
    }
}

OWLLeaflet.addGeoJsonPoints = function addGeoJsonPoints(mapRef, url){
    var markers = L.markerClusterGroup();
    this.updateGeoJsonPoints(mapRef, markers,url);
    mapRef.addLayer(markers);
    return OWLUtils.storeObjectRef(markers);
}

OWLLeaflet.updateGeoJsonPoints = function updateGeoJsonPoints(mapRef, markerRef, url){
    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties) {
            layer.bindPopup('<a href="/e/'+feature.properties.id_str+'"><h5>'+feature.properties.name+'</h5></a>');
        }
    }

    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    
    fetch(url)
    .then(res => res.json())
    .then((out) => {
        if(!!markerRef.geoJSONLayer){
            markerRef.geoJSONLayer.removeFrom(markerRef);
        }
        markerRef.geoJSONLayer = L.geoJSON(out, {
            style: function(feature) {
                switch (feature.properties.primaryEventCategory) {
                    case 'Celebrations': return {color: "#00FFFF"};
                    case 'Democrat':   return {color: "#0000ff"};
                }
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: onEachFeature
        });
        markerRef.geoJSONLayer.addTo(markerRef);
        markerRef.refreshClusters();
    })
    .catch(err => { throw err });    
}

OWLLeaflet.addCurrentIsochrone = function addCurrentIsochrone(mapRef, uri, lat, lng, transportMode, timeLimit){
    mapRef.currentIsochroneLayer = L.layerGroup();
    mapRef.createPane('currentIsochrone');
    mapRef.isochroneUri = uri;
    // 
    var url = mapRef.isochroneUri.replace("$lat",lat).replace("$lng",lng).replace("$transportMode",transportMode).replace("$timeLimit",timeLimit);
    fetch(url)
    .then(res => res.json())
    .then((out) => {
        if(!!mapRef.currentIsochrone)
        {
            mapRef.currentIsochrone.remove(mapRef.currentIsochroneLayer);
        }
        mapRef.currentIsochrone = L.geoJSON(out, { interactive: false, pane:'currentIsochrone', weight: 2 }).addTo(mapRef.currentIsochroneLayer);
        // mapRef.flyToBounds(mapRef.currentIsochrone.getBounds());
    })
    .catch(err => { throw err });
    mapRef.currentIsochroneLayer.addTo(mapRef);
}

OWLLeaflet.updateCurrentIsochrone = function updateCurrentIsochrone(mapRef, lat, lng, transportMode, timeLimit) {
    if(!!mapRef.currentIsochroneLayer)
    {
        var url = mapRef.isochroneUri.replace("$lat",lat).replace("$lng",lng).replace("$transportMode",transportMode).replace("$timeLimit",timeLimit);
        fetch(url)
        .then(res => res.json())
        .then((out) => {
            if(!!mapRef.currentIsochrone)
            {
                mapRef.currentIsochrone.remove(mapRef.currentIsochroneLayer);
            }
            mapRef.currentIsochrone = L.geoJSON(out, { interactive: false, pane:'currentIsochrone', weight: 2 }).addTo(mapRef.currentIsochroneLayer);
            // mapRef.fitBounds(mapRef.currentIsochrone.getBounds());
        })
        .catch(err => { throw err });
    }
}

OWLLeaflet.addBorders  =  function addBorders(mapRef, url){
    var borderStyle = {
        "color": "var(--border-color)",
        "fillColor": 'transparent',
        "weight": 1,
        "fillOpacity": 0
    };

    fetch(url)
    .then(res => res.json())
    .then((out) => {
        L.geoJSON(out, { interactive: false, style: borderStyle }).addTo(mapRef);
    })
    .catch(err => { throw err });
}