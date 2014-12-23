/*** Global object that contains the app ***/
var app = app || {};

// keep our map stuff in a part of the app object as to not pollute the global name space
app.map = (function(w,d, $, _){

  //  define all local variables for map parts and layers 
  //  store in an object called 'el' that can be accessed elsewhere
  var el = {
    map : null,
    cdbURL : null,
    styles: null,
    styleCur : null,
    sql : null,
    mapboxTiles : null,
    satellite : null,
    taxLots : null,
    baseLayers : null,
    dobPermitsA1 : null,
    dobPermitsA2A3 : null,
    dobPermitsNB : null,
    rheingoldPoly : null,
    bushwick : null,
    rheingold : null,
    colony : null,
    linden : null,
    groveSt : null,
    featureGroup : null,
    template : null,
    geocoder : null,
    geocoderMarker : null, 
    legend : null,
    taxLotActions : null,
    story : null
  };

  // reference cartocss styles from mapStyles.js
  el.styles = app.mapStyles;
  // url to cartodb bushwick community map viz json
  el.cdbURL = "https://bushwick.cartodb.com/api/v2/viz/64ceb582-71e2-11e4-b052-0e018d66dc29/viz.json";

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

  el.legend = $('#ui-legend');
                                                                           
  // set up the map and map layers!
  var initMap = function() {
    // map paramaters to pass to Leaflet
    var params = {
      center : [40.694631,-73.925028],
      minZoom : 14,
      maxZoom : 19,
      zoom : 15,
      maxBounds : L.latLngBounds([40.675496,-73.957987],[40.714216,-73.877306]), 
      zoomControl : false,
      infoControl: false,
      attributionControl: true
    }

    // coerce Leaflet into allowing multiple popups to be open simultaneously
    L.Map = L.Map.extend({
        openPopup: function(popup) {
            //this.closePopup();
            this._popup = popup;

            return this.addLayer(popup).fire('popupopen', {
                popup: this._popup
            });
        }
    });

    var gentIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/clhenrick/BushwickCommunityMap/gh-pages/images/gentrification.png',
      iconRetinaUrl: 'https://raw.githubusercontent.com/clhenrick/BushwickCommunityMap/gh-pages/images/gentrification-2x.png',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });    

    // lat lngs for locations of stories
    el.bushwick = new L.LatLng(40.694631,-73.925028);
    el.rheingold = new L.LatLng(40.700740, -73.934209);
    el.colony = new L.LatLng(40.695867,-73.928153);
    el.linden = new L.LatLng(40.692776,-73.919756);
    el.groveSt = new L.LatLng(40.700082, -73.913740);

    el.colonyMarker = new L.marker(el.colony, {icon: gentIcon}).bindPopup('<a class="colony1209 story" href="#" data-slide="5">Colony 1209</a>');
    el.groveStMarker = new L.marker(el.groveSt, {icon: gentIcon}).bindPopup('358 Grove St. Condos');
    el.rheingoldMarker = new L.marker(el.rheingold, {icon: gentIcon}).bindPopup('<a class="rheingold story" href="#" data-slide="1">Rheingold Rezoning</a>');
    el.lindenMarker = new L.marker(el.linden, {icon: gentIcon}).bindPopup('<a class="98linden story" href="#" data-slide="8">98 Linden</a>' );
    
    // array to store sites of gentrification
    el.sitesGent = [
        el.colonyMarker,
        el.groveStMarker,
        el.rheingoldMarker,
        el.lindenMarker
      ];
    
    // instantiate the Leaflet map object
    el.map = new L.map('map', params);
    
    // api key for mapbox tiles
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2hlbnJpY2siLCJhIjoiLVhZMUZZZyJ9.HcNi26J3P-MiOmBKYHIbxw';

    // tileLayer for mapbox basemap
    el.mapboxTiles = L.mapbox.tileLayer('chenrick.map-3gzk4pem');
    el.map.addLayer(el.mapboxTiles); 

    // add mapbox and osm attribution
    var attr = "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a>"
    el.map.attributionControl.addAttribution(attr);

    // feature group to store rheingold geoJSON
    el.featureGroup = L.featureGroup().addTo(el.map);    
    
    // add Bing satelitte imagery layer
    el.satellite = new L.BingLayer('AkuX5_O7AVBpUN7ujcWGCf4uovayfogcNVYhWKjbz2Foggzu8cYBxk6e7wfQyBQW');

    // object to pass Leaflet Control
     el.baseLayers = {
        streets: el.mapboxTiles,
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

    // load the rheingold GeoJSON layer
    loadRheingold();
    // add the tax lot layer from cartodb
    getCDBData();
  }

  // load the geoJSON boundary for the Rheingold development
  function loadRheingold() {
    $.getJSON('./data/rheingold_rezoning_area.geojson', function(json, textStatus) {
        el.rheingoldPoly = L.geoJson(json, {
          style: function(feature){
            return { color: '#000', fill: false, fillOpacity: 0.2, dashArray: '5,10', lineCap: 'square' }
          }
        });
    });
  } 

  // function to load map pluto tax lot layer and dob permit layer from CartoDB
  var getCDBData = function() {  
    cartodb.createLayer(el.map, el.cdbURL, {
        cartodb_logo: false, 
        legends: false,
        https: true 
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
      el.mapboxTiles.bringToBack();

      }).on('done', function() {
        
      }); // end cartodb.createLayer!      
  };

  // change the cartoCSS of a layer
  var changeCartoCSS = function(layer, css) {
    layer.setCartoCSS(css);
  };

  // change SQL query of a layer
  var changeSQL = function(layer, sql) {
    layer.setSQL(sql);
  }

  // corresponding cartoCSS & SQL changes to tax lot layer buttons
  // legends are displayed or hidden as needed
  el.taxLotActions = {
    regular : function() {
      changeCartoCSS(el.taxLots, el.styles.regular);
      changeSQL(el.taxLots, el.sql.all);
      renderLegend(null);
      return true;
    },
    landuse : function() {
      changeCartoCSS(el.taxLots, el.styles.landuse);
      changeSQL(el.taxLots, el.sql.all);
      renderLegend(el.legendData.landuse);
      return true;
    },
    availfar : function() {
      changeCartoCSS(el.taxLots, el.styles.availFAR);
      changeSQL(el.taxLots, el.sql.all);
      renderLegend(el.legendData.availFAR);
      return true;
    },
    rentstab : function() {
      changeCartoCSS(el.taxLots, el.styles.red);
      changeSQL(el.taxLots, el.sql.rentStab);
      renderLegend(null);
      return true;
    },
    vacant : function() {
      changeCartoCSS(el.taxLots, el.styles.red);
      changeSQL(el.taxLots, el.sql.vacant);
      renderLegend(null);
      return true;
    },
    yearbuilt : function(){
      changeCartoCSS(el.taxLots, el.styles.yearbuilt);
      changeSQL(el.taxLots, el.sql.all);
      renderLegend(el.legendData.yearBuilt);
      return true;
    }
  };

  // add tax lot layer button event listeners
  var initButtons = function() {
    $('.button').click(function(e) {
      // e.preventDefault(); 
      $('.button').removeClass('selected');
      $(this).addClass('selected');
      el.taxLotActions[$(this).attr('id')]();
      el.taxLots.show();
    }); 
  }

  // toggle additional layers based on check box boolean value
  var initCheckboxes = function() {
    // checkboxes for dob permit layer & stories
    var checkboxDOB = $('input.dob:checkbox'),
          $a1 = $('#a1'),
          $a2a3 = $('#a2a3'),
          $nb = $('#nb'),
          $sg = $('#sites-of-gentrification'),
          $ps = $('#personal-stories');

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

    // toggle sites of gentrification
    $sg.change(function(){
      if ($sg.is(':checked')) {
        for (i=0; i<el.sitesGent.length; i++) {
          el.featureGroup.addLayer(el.sitesGent[i]);  
        }
        el.featureGroup.addLayer(el.rheingoldPoly);
        el.map.fitBounds(el.featureGroup, {padding: [200, 200]});

        // open popups of markers on load
        el.featureGroup.eachLayer(function(layer) {          
          layer.openPopup();
        });
        
      } else {
        for (i=0; i<el.sitesGent.length; i++) {
          el.featureGroup.removeLayer(el.sitesGent[i]);  
        }
        el.featureGroup.removeLayer(el.rheingoldPoly);
      };
    });        

    // toggle personal stories
    // to do: add stories!
    $ps.change(function(){
      if ($ps.is(':checked')) {
        console.log('show stories');
      } else {
        console.log('hide stories');
      }
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
          var latlng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
          console.log('gecoder results: ', results, ' latlng: ', latlng);
          
          // remove geocoded marker if one already exists
          if (el.geocoderMarker) { 
            el.map.removeLayer(el.geocoderMarker);
          }
          // add a marker and pan and zoom the map to it
          el.geocoderMarker = new L.marker(latlng).addTo(el.map);
          el.geocoderMarker.bindPopup("<h4>" + results[0].formatted_address + "</h4>" ).openPopup();
          el.map.setView(latlng, 20);          
          } else {
            console.log('geocode unsuccesful: ', status);
          }
      });
  }

  // search box ui interaction TO DO: check to see if point is outside of Bushwick bounds
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

  // function to render choropleth legends
  var renderLegend = function(data) {
    if (data === null) { 
      el.legend.addClass('hidden');
      return;
    }
    var legendData = {
      title : data.title,
      items : data.items,// array of objects containing color and values
    };    
    el.legend.html(el.template(legendData));
    if (el.legend.hasClass('hidden')) el.legend.removeClass('hidden');
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

  // data passed to renderLegend();
  // to do: generate this dynamically from cartocss
  el.legendData = {
    availFAR : {
      title : "Available FAR",
      items : [
        {
          color : "#BD0026",
          label : "3.3 - 4"        
        },
        {
          color : "#F03B20",
          label : "2.5 - 3.2"
        },
        {
          color : "#FD8D3C",
          label : "1.7 - 2.4"
        },
        {
          color: "#FECC5C",
          label : "0.9 - 1.6"
        },
        {
          color : "#FFFFB2",
          label : "0 - 0.8"
        }
      ]
    },
    yearBuilt : {
      title : "Year Built",
      items : [
      {
        color : "#7a0177",
        label : "2005-2014"
      },
      {
        color : "#ae017e",
        label : "2001-2004"
      },
      {
        color : "#dd3497",
        label : "1991-2000"
      },
      {
        color : "#f768a1;",
        label : "1974-1990"
      },
      {
        color : "#fa9fb5",
        label : "1934-1973"
      },
      {
        color : "#fcc5c0",
        label : "1901-1933"
      },
      {
        color : "#feebe2",
        label : "1800-1900"
      },                                    
      ]
    },
    landuse: {
      title: "Land Use",
      items: [
      {
        color: "#A6CEE3",
        label: "Multi-Family Walkup"
      },
      {
        color: "#1F78B4",
        label: "1 & 2 Family Bldgs"
      },
      {
        color: "#B2DF8A",
        label: "Mixed Resid & Comm"
      },
      {
        color: "#33A02C",
        label: "Parking Facilities"
      },
      {
        color: "#FB9A99",
        label: "Vacant Land"
      },
      {
        color: "#E31A1C",
        label: "Commerical & Office"
      },
      {
        color: "#FDBF6F",
        label: "Industrial & Mfg"
      },
      {
        color: "#FF7F00",
        label: "Public Facil & Instns"
      },
      {
        color: "#6A3D9A;",
        label: "Open Space & Rec"
      },
      {
        color: "#CAB2D6",
        label: "N/A"
      },                                                        
      ]
    }    
  };

  // get it all going!
  var init = function() {
    initMap();
    initButtons();
    initCheckboxes();
    searchAddress();
    initZoomButtons();
    app.intro.init();    
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
});