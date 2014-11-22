/*** Global object that contains the app ***/
var app = app || {};

// keep our map stuff in a part of the app object as to not pollute the global name space
app.map = (function(w,d, $, _){

  /*** local variables for map parts and layers ***/
  var el = {
    map : null,
    styles: null,
    sql : null,
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

  el.styles = app.mapStyles;

  el.sql = {
    all : "SELECT * FROM bushwick_pluto14v1;",
    rentStab : "SELECT * FROM bushwick_pluto14v1 WHERE yearbuilt < 1974 AND unitsres > 6;",
    vacant : "SELECT * FROM bushwick_pluto14v1 WHERE landuse = '11';"
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
    // el.satellite = new L.Google();
    // el.osmGeocoder = new L.Control.OSMGeocoder(options = {position:'bottomright'});    
    // add stamen toner layer as default base layer
    el.map.addLayer(el.tonerLite);
    // add the tax lot layer from cartodb
    getTaxLots(el.styles.regular);
  
  } 

  // function to load CartoDB tax lot layer
  var getTaxLots = function(css) {
    // cartodb visualization URL to access Pluto tax lot tiles
    var cdbURL = "http://bushwick.cartodb.com/api/v2/viz/64ceb582-71e2-11e4-b052-0e018d66dc29/viz.json";
    var query = 'SELECT * FROM bushwick_pluto14v1';

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

  var changeSQL = function(sql) {
    el.taxLots.setSQL(sql);
  }

  // corresponding cartoCSS changes to buttons
  var taxLotActions = {
    regular : function() {
      changeCartoCSS(el.styles.regular);
      changeSQL(el.sql.all);
      return true;
    },
    zoning : function() {
      changeCartoCSS(el.styles.zoning);
      changeSQL(el.sql.all);
      return true;
    },
    availfar : function() {
      changeCartoCSS(el.styles.availFAR);
      changeSQL(el.sql.all);
      return true;
    },
    rentstab : function() {
      changeCartoCSS(el.styles.red);
      changeSQL(el.sql.rentStab);
      return true;
    },
    vacant : function() {
      changeCartoCSS(el.styles.red);
      changeSQL(el.sql.vacant);
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
    // console.log('styles: ', el.styles.styles.regular);
  }

  // only return init() and the stuff in the el object
  return {
    init : init,
    el : el
  }

})(window, document, jQuery, _);

// call app.map.init() once the dom is loaded
window.addEventListener('DOMContentLoaded', function(){
  app.map.init();
  timerangeUI();
});