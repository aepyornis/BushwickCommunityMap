/*** Global object that contains the app ***/
var app = app || {};

// keep our map stuff in a part of the app object as to not pollute the global name space
app.map = (function(w,d, $, _){

  /*** local variables for map parts and layers ***/
  var el = {
    map : null,
    styles: null,
    toner : null,
    tonerLite : null,
    satellite : null,
    osmGeocoder : null,
    taxLots : null,
    far : null,
    rentStabilized : null,
    dobPermits : null,
    vacantLand : null,
    yearBuilt : null,
    test : null
  };

  /**** sample CartoCSS for styling tax lot data ****/
  el.styles = {
   // default style, all lots are the same color
    regular : '#exp_132bushwick {' +
                                  'polygon-fill: hsl(200,50%,50%);' +
                                  'polygon-opacity: 0.5;' +
                                  'line-color: #FFF;' +
                                  'line-width: 0.5;' +
                                  'line-opacity: 1;' +
                                '}',
    
    // category style based on zoning
    zoning : "#exp_132bushwick {" +
                                     "polygon-opacity: 0.8;" +
                                     "line-color: #FFF;" +
                                     "line-width: 0.3;" +
                                     "line-opacity: 1;" +
                                  "}" +                                
                                  '#exp_132bushwick[zoning_style="R"] { polygon-fill: #A6CEE3;}' +
                                  '#exp_132bushwick[zoning_style="RC"] {polygon-fill: #1F78B4;}' +
                                  '#exp_132bushwick[zoning_style="M"] {polygon-fill: #FFCC00;}' +
                                  '#exp_132bushwick[zoning_style="C"] {polygon-fill: #7B00B4;}' +
                                  '#exp_132bushwick[zoning_style="P"] {polygon-fill: #229A00;}' +
                                  '#exp_132bushwick[zoning_style=""] {polygon-fill: #6b6868;}',
    
    // choropleth style based on Built FAR                                
    builtFAR : "#exp_132bushwick {" +
                               "polygon-fill: #F1EEF6;" +
                               "polygon-opacity: 0.8;" +
                               "line-color: #FFF;" +
                               "line-width: 0.3;" +
                               "line-opacity: 1;" +
                            "}" +                           
                            '#exp_132bushwick[builtfar <= 23.05] { polygon-fill: #91003F;}' +
                            '#exp_132bushwick[builtfar <= 8.59] {polygon-fill: #CE1256;}' +
                            '#exp_132bushwick[builtfar <= 3.95] {polygon-fill: #E7298A;}' +
                            '#exp_132bushwick[builtfar <= 3.53] {polygon-fill: #DF65B0;}' +
                            '#exp_132bushwick[builtfar <= 2.7] {polygon-fill: #C994C7;}' +
                            '#exp_132bushwick[builtfar <= 1.57] {polygon-fill: #D4B9DA;}'+  
                            '#exp_132bushwick[builtfar <= 1.55]{polygon-fill: #F1EEF6;}',

    // choropleth style based on Residential FAR
    residFAR :  "#exp_132bushwick {" +
                               "polygon-fill: #FFFFB2;" +
                               "polygon-opacity: 0.8;" +
                               "line-color: #FFF;" +
                               "line-width: 0.3;" +
                               "line-opacity: 1;" +
                            "}" +                           
                            '#exp_132bushwick[ residfar <= 3.44] { polygon-fill: #BD0026;}' +
                            '#exp_132bushwick[ residfar <= 2.43] {polygon-fill: #F03B20;}' +
                            '#exp_132bushwick[ residfar <= 0.9] {polygon-fill: #FD8D3C;}' +
                            '#exp_132bushwick[ residfar <= 0.9] {polygon-fill: #FECC5C;}' +
                            '#exp_132bushwick[ residfar <= 0.6] {polygon-fill: #FFFFB2;}'                             
  };
                                                                           
  // instantiate the leaflet map object
  var initMap = function() {
    var params = {
      center : [40.6941, -73.9162],
      minZoom : 14,
      maxZoom : 20,
      zoom : 15,
      maxBounds : L.latLngBounds([40.670809,-73.952579],[40.713565,-73.870354])
    }

    el.map = L.map('map', params);
    el.toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' + 
                        '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + 
                        'Map data {attribution.OpenStreetMap}'
    });
    el.tonerLite = new L.StamenTileLayer('toner-lite');
    el.satellite = new L.Google();
    el.osmGeocoder = new L.Control.OSMGeocoder(options = {position:'bottomright'});    
    // add stamen toner layer as default base layer
    el.map.addLayer(el.tonerLite);
    // add the tax lot layer from cartodb
    getTaxLots(el.styles.regular);
  
  } 

  // function to load CartoDB tax lot layer
  var getTaxLots = function(css) {
    // cartodb visualization URL to access Pluto tax lot tiles
    var cdbURL = "http://chenrick.cartodb.com/api/v2/viz/76127e6e-6535-11e4-a4cb-0e853d047bba/viz.json";
    var query = 'SELECT * FROM exp_132bushwick';

    cartodb.createLayer(el.map, cdbURL, {
        cartodb_logo: false, 
        legends: false
      }, 
      function(layer) {
        layer.getSubLayer(0).setCartoCSS(css);
        el.taxLots = layer.getSubLayer(0);
      }).addTo(el.map);    
  };

  // change the cartoCSS of the tax lot layer
  var changeCartoCSS = function(css) {
    el.taxLots.setCartoCSS(css);
  };

  // corresponding cartoCSS changes to buttons
  var taxLotActions = {
    regular : function() {
      changeCartoCSS(el.styles.regular);
      return true;
    },
    zoning : function() {
      changeCartoCSS(el.styles.zoning);
      return true;
    },
    farbuilt : function() {
      changeCartoCSS(el.styles.builtFAR);
      return true;
    },
    farres : function() {
      changeCartoCSS(el.styles.residFAR);
      return true;
    }
  };

  var initButtons = function() {
    $('.button').click(function() {
      $('.button').removeClass('selected');
      $(this).addClass('selected');
      taxLotActions[$(this).attr('id')]();
    });    
  } 

  // get it going!
  var init = function() {
    initMap();
    initButtons();  
  }

  // only return init() and the stuff in the el object
  return {
    init : init,
    el : el
  }

})(window, document, jQuery, _);

// call app.map.init() once the dom is loaded
window.addEventListener('DOMContentLoaded', app.map.init);