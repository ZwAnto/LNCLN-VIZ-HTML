function getColor(d) {
    return d > 0.9 ? colors[9] :
            d > 0.8 ? colors[8] :
            d > 0.7 ? colors[7] :
            d > 0.6 ? colors[6] :
            d > 0.5 ? colors[5] :
            d > 0.4 ? colors[4] :
            d > 0.3 ? colors[3] :
            d > 0.2 ? colors[2] :
            d > 0.1 ? colors[1] :
            colors[0];
}
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#42576c',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}
function resetHighlight(e) {
    map_arr_arr_layer.resetStyle(e.target);
    info.update();
}
function zoomToFeature(e) {
    map_arr.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.index_p13_pop_m),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}

// Color array
colors = genColorGradient('#70A9A1', 10);

// Map initialization
window.map_arr = L.map('map_arr').setView([40.747133, -73.927887], 10);

// CartoDB
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(map_arr);

// Moving zoom control
map_arr.zoomControl.setPosition('bottomleft');

// Removing credits
$('.leaflet-control-attribution').remove();

// Adding arr bounding to map
map_arr_arr_layer = L.geoJSON(arr_geo, {onEachFeature: onEachFeature, style: style}).addTo(map_arr);

// Set map focus on paris
map_arr.fitBounds(map_arr_arr_layer.getBounds());

// Map limitation
map_arr.setMaxBounds(map_arr_arr_layer.getBounds());
map_arr.setMinZoom(11);

// Info container
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' + (props ?
            '<b>' + props.p13_pop + '</b><br />' + props.area + ' people / mi<sup>2</sup>'
            : 'Hover over a state');
};
info.addTo(map_arr);

// Change color scheme on variable selection
$('#map_arr_select').change(function () {
    var varName = 'index_' + $('#map_arr_select').val();

    function style(feature) {
        return {
            fillColor: getColor(feature.properties[varName]),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '',
            fillOpacity: 0.7
        };
    }

    map_arr_arr_layer = L.geoJSON(arr_geo, {onEachFeature: onEachFeature, style: style}).addTo(map_arr);
});