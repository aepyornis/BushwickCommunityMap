/*** Global object that contains the app ***/
var app = app || {};

// keep our map stuff in a part of the app object as to not pollute the global name space
app.map = (function(w,d, $, _){

  /*** local variables for map parts and layers ***/
  var el = {
    map : null,
    cdbURL : null,
    styles: null,
    sql : null,
    tonerLite : null,
    satellite : null,
    taxLots : null,
    dobPermits : null,
  };

  el.styles = app.mapStyles;
  // url to cartodb bushwick community map viz json
  el.cdbURL = "http://bushwick.cartodb.com/api/v2/viz/64ceb582-71e2-11e4-b052-0e018d66dc29/viz.json";

  el.sql = {
    all : "SELECT * FROM bushwick_pluto14v1;",
    rentStab : "SELECT * FROM bushwick_pluto14v1 WHERE yearbuilt < 1974 AND unitsres > 6;",
    vacant : "SELECT * FROM bushwick_pluto14v1 WHERE landuse = '11';",
    allJobs : "SELECT * FROM exp_codedjobs;",
    a1 : "SELECT * FROM exp_codedjobs WHERE jobtype = 'A1';",
    a2a3 : "SELECT * FROM exp_codedjobs WHERE jobtype in ('A2', 'A3');",
    nb : "SELECT * FROM exp_codedjobs WHERE jobtype = 'NB';",
    a2a3nb : "SELECT * FROM exp_codedjobs WHERE jobtype IN ('A2', 'A3', 'NB');",
    a1nb : "SELECT * FROM exp_codedjobs WHERE jobtype IN ('A1', 'NB');",
    a1a2a3 : "SELECT * FROM exp_codedjobs WHERE jobtype IN ('A1', 'A2', 'A3');"
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
    el.tonerLite = new L.StamenTileLayer('toner-lite');
    // el.satellite = new L.Google();
    // el.osmGeocoder = new L.Control.OSMGeocoder(options = {position:'bottomright'});    
    // add stamen toner layer as default base layer
    el.map.addLayer(el.tonerLite);
    // add the tax lot layer from cartodb
    getCDBData();
  
  } 

  // function to load map pluto tax lot layer and dob permit layer from CartoDB 
  var getCDBData = function() {  
    cartodb.createLayer(el.map, el.cdbURL, {
        cartodb_logo: false, 
        legends: false
      }, 
      function(layer) {
        layer.getSubLayer(0).setCartoCSS(el.styles.regular);
        layer.getSubLayer(0).setSQL(el.sql.all);
        layer.getSubLayer(1).setSQL(el.sql.allJobs);
        layer.createSubLayer({
          sql : "SELECT * FROM exp_codedjobs_a1",
          cartocss : '#exp_codedjobs_a1 {marker-fill: hsl(0,50%,60%);}'
        });
        layer.createSubLayer({
          sql : "SELECT * FROM exp_codedjobs_a2a3",
          cartocss : '#exp_codedjobs_a1 {marker-fill: hsl(100,50%,60%);}'
        });
        layer.createSubLayer({
          sql : "SELECT * FROM exp_codedjobs_nb",
          cartocss : '#exp_codedjobs_a1 {marker-fill: hsl(350,50%,60%);}'
        });                
        el.taxLots = layer.getSubLayer(0);
        el.dobPermits = layer.getSubLayer(1);
        el.dobPermitsA1 = layer.getSubLayer(2);
        el.dobPermitsA2A3 = layer.getSubLayer(3);
        el.dobPermitsNB = layer.getSubLayer(4);

        // hide sublayers for dob permits
        var num_sublayers = layer.getSubLayerCount();
        for (var i = 1; i < num_sublayers; i++) {
          layer.getSubLayer(i).hide();
        }

      }).addTo(el.map);    
  };

  // change the cartoCSS of the tax lot layer
  var changeCartoCSS = function(layer, css) {
    layer.setCartoCSS(css);
  };

  var changeSQL = function(layer, sql) {
    layer.setSQL(sql);
  }

  // corresponding cartoCSS changes to buttons
  var taxLotActions = {
    regular : function() {
      changeCartoCSS(el.taxLots, el.styles.regular);
      changeSQL(el.taxLots, el.sql.all);
      return true;
    },
    zoning : function() {
      changeCartoCSS(el.taxLots, el.styles.zoning);
      changeSQL(el.taxLots, el.sql.all);
      return true;
    },
    availfar : function() {
      changeCartoCSS(el.taxLots, el.styles.availFAR);
      changeSQL(el.taxLots, el.sql.all);
      return true;
    },
    rentstab : function() {
      changeCartoCSS(el.taxLots, el.styles.red);
      changeSQL(el.taxLots, el.sql.rentStab);
      return true;
    },
    vacant : function() {
      changeCartoCSS(el.taxLots, el.styles.red);
      changeSQL(el.taxLots, el.sql.vacant);
    }
  };

  var checkBoxActions = {
    a1 : function() {
      changeSQL(el.dobPermits, el.sql.a1);
    },
    a2a3 : function() {
      changeSQL(el.dobPermits, el.sql.a2a3);
    },
    nb : function() {
      changeSQL(el.dobPermits, el.sql.nb);
    }
  }

  var initButtons = function() {
    $('.button').click(function() {
      $('.button').removeClass('selected');
      $(this).addClass('selected');
      taxLotActions[$(this).attr('id')]();
    });    
  }

  var initCheckboxes = function() {
    $('input:checkbox').click(function() {      
      checkBoxActions[$(this).attr('id')]();
      el.dobPermits.show();
    });
  } 

  // change dob permit layer sql based on check box boolean
  var initCheckboxesTwo = function() {
    // checkboxes for dob permit layer
    var checkboxDOB = $('input.dob:checkbox'),
          $a1 = $('#a1'),
          $a2a3 = $('#a2a3'),
          $nb = $('#nb');

    $a1.change(function(){
      if ($a1.is(':checked')){
        el.dobPermitsA1.show();
      } else {
        el.dobPermitsA1.hide();
      };
    });

    $a2a3.change(function(){
      if ($a2a3.is(':checked')){
        el.dobPermitsA2A3.show();
      } else {
        el.dobPermitsA2A3.hide();
      };
    });    

    $nb.change(function(){
      if ($nb.is(':checked')){
        el.dobPermitsNB.show();
      } else {
        el.dobPermitsNB.hide();
      };
    });        

  }

  // get it going!
  var init = function() {
    initMap();
    initButtons();
    initCheckboxesTwo();  
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