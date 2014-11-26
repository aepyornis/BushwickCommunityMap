/*** Global object that contains the app ***/
var app = app || {};

// keep our map stuff in a part of the app object as to not pollute the global name space
app.map = (function(w,d, $, _){

  //  define all local variables for map parts and layers and store in an object called 'el' 
  var el = {
    map : null,
    cdbURL : null,
    styles: null,
    styleCur : null,
    sql : null,
    tonerLite : null,
    satellite : null,
    taxLots : null,
    baseLayers : null,
    rentStabl : null,
    dobPermits : null,
    dobPermitsA1 : null,
    dobPermitsA2A3 : null,
    dobPermitsNB : null,
    template : null,
    geocoder : null,
    geocoderMarker : null
  };

  // reference cartocss styles from mapStyles.js
  el.styles = app.mapStyles;
  // url to cartodb bushwick community map viz json
  el.cdbURL = "http://bushwick.cartodb.com/api/v2/viz/64ceb582-71e2-11e4-b052-0e018d66dc29/viz.json";

  // queries for map pluto tax lots
  // sent to cartodb when layer buttons clicked
  el.sql = {
    all : "SELECT * FROM bushwick_pluto14v1",
    rentStab : "SELECT a.* FROM bushwick_pluto14v1 a, bushwick_rent_stabl_merge_centroids b where st_intersects(a.the_geom, b.the_geom)",
    vacant : "SELECT * FROM bushwick_pluto14v1 WHERE landuse = '11'",
  };

  // compile the underscore legend template for rendering map legends for choropleth layers
  _.templateSettings.variable = "legend";
  el.template = _.template($("script.template").html());

  // use google maps api geocoder
  el.geocoder = new google.maps.Geocoder();
                                                                           
  // set up the map!
  var initMap = function() {
    // map paramaters to pass to Leaflet
    var params = {
      center : [40.6941, -73.9162],
      minZoom : 14,
      maxZoom : 19,
      zoom : 15,
      maxBounds : L.latLngBounds([40.670809,-73.952579],[40.713565,-73.870354]),
      zoomControl : false
    }

    // instantiate the Leaflet map object
    el.map = L.map('map', params);
    // add stamen toner lite base layer
    el.tonerLite = new L.StamenTileLayer('toner-lite');
    el.map.addLayer(el.tonerLite);    

    // add Bing satelitte imagery layer
    el.satellite = new L.BingLayer('AkuX5_O7AVBpUN7ujcWGCf4uovayfogcNVYhWKjbz2Foggzu8cYBxk6e7wfQyBQW');

    // object to pass Leaflet Control
     el.baseLayers = {
        streets: el.tonerLite,
        satellite: el.satellite
    };

    // inits UI element for toggling base tile layers
    L.control.layers(el.baseLayers, {}, {
          position: 'bottomleft'
      }).addTo(el.map);

    // makes sure base layers stay below the cartodb data
    el.map.on('baselayerchange', function(e){
      e.layer.bringToBack();
    })   

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
        // store the map pluto tax lot sublayer
        layer.getSubLayer(0).setCartoCSS(el.styles.regular);
        layer.getSubLayer(0).setSQL(el.sql.all);
        el.taxLots = layer.getSubLayer(0);

        // create and store the dob permits a1 sublayer
        el.dobPermitsA1 = layer.createSubLayer({
          sql : "SELECT * FROM exp_codedjobs_a1",
          cartocss : '#exp_codedjobs_a1 {marker-width: 10; marker-fill: hsl(0,0%,30%); marker-line-color: white; marker-line-width: 0.8;}'
        });

        // create and store the dob permits a2a3 sublayer
        el.dobPermitsA2A3 = layer.createSubLayer({
          sql : "SELECT * FROM exp_codedjobs_a2a3",
          cartocss : '#exp_codedjobs_a1 {marker-width: 10; marker-fill: hsl(100,0%,50%); marker-line-color: white; marker-line-width: 0.8;}'
        });

        // create and store the dob permits nb sublayer
        el.dobPermitsNB = layer.createSubLayer({
          sql : "SELECT * FROM exp_codedjobs_nb",
          cartocss : '#exp_codedjobs_a1 {marker-width: 10; marker-fill: hsl(350,0%,0%); marker-line-color: white; marker-line-width: 0.8;}'         
        });

        // positions the tool tip in relationship to user's mouse
        // offset it by 5px vertically and horizontally so the mouse arrow won't cover it
        var event = function(e){
              $('#tool-tip').css({
                 left:  e.pageX + 5,
                 top:   e.pageY + 5
              });
          };                                

        // hide and set interactivity on the DOB permit layers
        var num_sublayers = layer.getSubLayerCount();
        for (var i = 1; i < num_sublayers; i++) { 
          // turn on interactivity for mousing events
          layer.getSubLayer(i).setInteraction(true);
          // tell cdb what columns to pass for interactivity
          layer.getSubLayer(i).setInteractivity('address, jt_description, ownername, ownerphone, ownerbusin, existingst, proposedst');                    
          // when the user mouses over the dob permit display html & data in a tool tip
          layer.getSubLayer(i).on('featureOver', function(e, pos, latlng, data) {
            $('#tool-tip').html(
                                // text to display when user hovers on dob permit layers
                                '<h4>DOB Permit Info</h4>' +
                                '<hr>' +
                                '<p><strong>Address:</strong> '  + data.address + '</p>' +
                                '<p><strong>Job Description:</strong> ' + data.jt_description + '</p>' +
                                '<p><strong>Owner Name:</strong> '  + data.ownername + '</p>' +
                                '<p><strong>Owner Business:</strong> '  + data.ownerbusin + '</p>' +
                                '<p><strong>Owner Phone:</strong> '  + data.ownerphone + '</p>' +
                                '<p><strong>Existing Building Stories:</strong> '  + data.existingst + '</p>' +
                                '<p><strong>Proposed Building Stories:</strong> '  + data.proposedst + '</p>'
                                );
            $(document).bind('mousemove', event);
            $('#tool-tip').show();
          });
          
          // when the user mouses out remove the tool tip
          layer.getSubLayer(i).on('featureOut', function(e,pos,latlng,data){           
            $('#tool-tip').hide();
            $(document).unbind('mousemove', event, false);
          });

          // hide the dob permit layers when map loads
          layer.getSubLayer(i).hide();

        } // end sublayer for loop

      // add the cdb layer to the map
      el.map.addLayer(layer, false);
      // make sure the base layer stays below the cdb layer
      el.tonerLite.bringToBack();

      }); // end cartodb.createLayer

  };

  // change the cartoCSS of a layer
  var changeCartoCSS = function(layer, css) {
    layer.setCartoCSS(css);
    // store the current cartocss style for the time range slider
    el.styleCur = css;
  };

  // change SQL query of a layer
  var changeSQL = function(layer, sql) {
    layer.setSQL(sql);
  }

  // corresponding cartoCSS changes to tax lot layer buttons
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

  // add tax lot layer button event listeners
  var initButtons = function() {
    $('.button').click(function() {
      $('.button').removeClass('selected');
      $(this).addClass('selected');
      taxLotActions[$(this).attr('id')]();
    }); 
  }

  // change dob permit layer sql based on check box boolean
  var initCheckboxes = function() {
    // checkboxes for dob permit layer
    var checkboxDOB = $('input.dob:checkbox'),
          $a1 = $('#a1'),
          $a2a3 = $('#a2a3'),
          $nb = $('#nb');

    // toggle A1 major alterations layer
    $a1.change(function(){
      if ($a1.is(':checked')){
        el.dobPermitsA1.show();      
      } else {
        el.dobPermitsA1.hide();
      };
    });

    // toggle A2, A3 minor alterations layer
    $a2a3.change(function(){
      if ($a2a3.is(':checked')){
        el.dobPermitsA2A3.show();        
      } else {
        el.dobPermitsA2A3.hide();
      };
    });    

    // toggle NB new buildings layer
    $nb.change(function(){
      if ($nb.is(':checked')){
        el.dobPermitsNB.show();        
      } else {
        el.dobPermitsNB.hide();
      };
    });        
  }

  // geocode search box text and create a marker on the map
  var geocode = function(address) {
    // reference bounding box for Bushwick to improve geocoder results: 40.678685,-73.942451,40.710247,-73.890266
    var bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(40.678685,-73.942451), // sw
          new google.maps.LatLng(40.710247,-73.890266) // ne
          );    
      el.geocoder.geocode({ 'address': address, 'bounds' : bounds }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var latlng = [results[0].geometry.location.k , results[0].geometry.location.B];
          // console.log('gecoder results: ', results);
          
          // remove geocoded marker if one already exists
          if (el.geocoderMarker) { 
            el.map.removeLayer(el.geocoderMarker);
          }
          // add a marker and pan and zoom the map to it
          el.geocoderMarker = new L.marker(latlng).addTo(el.map);
          el.geocoderMarker.bindPopup("<h4>" + results[0].formatted_address + "</h4>" ).openPopup();
          el.map.setView(latlng, 20);
          };
      });
  }

  // search box ui interaction TO DO: do a check to see if point is outside of Bushwick bounds
  var searchAddress = function() {
    $('#search-box').focus(function(){
      if ($(this).val()==="Search for a Bushwick address") {
        $(this).val("");
      }
    });
    $('#search-box').on('blur',function(){      
      if ($(this).val()!=="") {
        $address = $(this).val()
        geocode($address);  
        $(this).val("");
      } 
    });
  }

  // render choropleth legends
  var renderLegend = function(data) {
    var legendData = {
      title : data.title,
      items : data.items,// array of objects containing color and values
    };    
    $("#ui-legend").html(template(legendData));
    $("#ui-legend").removeClass('.hidden');
  };

  // set up custom zoom buttons
  var initZoomButtons = function(){
    $('#zoom-in').on('click', function(){
      el.map.zoomIn();
    });
    $('#zoom-out').on('click', function(){
      el.map.zoomOut();
    });
  }

  // get it all going!
  var init = function() {
    initMap();
    initButtons();
    initCheckboxes();
    searchAddress();
    initZoomButtons();
  }

  // only return init() and the stuff in the el object
  return {
    init : init,
    el : el
  }

})(window, document, jQuery, _);

// call app.map.init() once the DOM is loaded
window.addEventListener('DOMContentLoaded', function(){
  app.map.init();
  timerangeUI();
});