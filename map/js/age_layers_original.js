
	var yellow = {
    	fillColor: '#ffff66',
    	fillOpacity: 1,
    	opacity: 1,
    	stroke: false
	};


//age filters

	function age2000(feature, layer) {
			if (feature.properties.YearBuilt == 2000) {
				return true;
			} else {
			return false;
				}
		}
	function age2001(feature, layer) {
			if (feature.properties.YearBuilt == 2001) {
				return true;
			} else {
			return false;
				}
		}
	function age2002(feature, layer) {
			if (feature.properties.YearBuilt == 2002) {
				return true;
			} else {
			return false;
				}
		}
	function age2003(feature, layer) {
			if (feature.properties.YearBuilt == 2003) {
				return true;
			} else {
			return false;
				}
		}
	function age2004(feature, layer) {
			if (feature.properties.YearBuilt == 2004) {
				return true;
			} else {
			return false;
				}
		}
	function age2005(feature, layer) {
			if (feature.properties.YearBuilt == 2005) {
				return true;
			} else {
			return false;
				}
		}
	function age2006(feature, layer) {
			if (feature.properties.YearBuilt == 2006) {
				return true;
			} else {
			return false;
				}
		}
	function age2007(feature, layer) {
			if (feature.properties.YearBuilt == 2007) {
				return true;
			} else {
			return false;
				}
		}
	function age2008(feature, layer) {
			if (feature.properties.YearBuilt == 2008) {
				return true;
			} else {
			return false;
				}
		}
	function age2009(feature, layer) {
			if (feature.properties.YearBuilt == 2009) {
				return true;
			} else {
			return false;
				}
		}
	function age2010(feature, layer) {
			if (feature.properties.YearBuilt == 2010) {
				return true;
			} else {
			return false;
				}
		}
	function age2011(feature, layer) {
			if (feature.properties.YearBuilt == 2011) {
				return true;
			} else {
			return false;
				}
		}
	function age2012(feature, layer) {
			if (feature.properties.YearBuilt == 2012) {
				return true;
			} else {
			return false;
				}
		}
	function age2013(feature, layer) {
			if (feature.properties.YearBuilt == 2013) {
				return true;
			} else {
			return false;
				}
		}
	function age2014(feature, layer) {
			if (feature.properties.YearBuilt == 2014) {
				return true;
			} else {
			return false;
				}
		} 

//Year Slider
	(function() {

		//age layers
		var layer2000 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2000,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2001 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2001,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2002 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2002,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2003 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2003,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2004 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2004,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2005 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2005,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2006 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2006,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2007 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2007,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2008 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2008,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2009 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2009,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2010 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2010,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2011 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2011,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2012 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2012,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2013 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2013,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});

		var layer2014 = L.geoJson(exp_PLUTO132bushwick,{
			style: yellow,
			onEachFeature: pop_pluto,
			filter: age2014,
			pointToLayer: function (feature, latlng) {
			return L.marker(latlng);}
		});




	var lowValue = 2010;
	var highValue = 2014;
	var layerTest;
	var layerArray = [layer2000, layer2001, layer2002, layer2003, layer2004, layer2005, layer2006, layer2007, layer2008, layer2009, layer2010, layer2011, layer2012, layer2013, layer2014];

	var yearAdd = function (x, y) {
		var lowLimit = (x - 2000); 
		var highLimit = (y - 2000);
		
		for (var i = lowLimit; i <= highLimit; i++) {
			map.addLayer(layerArray[i]);
			console.log(i);
		}
	};

	var yearRemove = function (x, y) {
		var lowLimit = (x - 2000); 
		var highLimit = (y - 2000);
		for (var i = 0; i < layerArray.length; i++) {
			 map.removeLayer(layerArray[i]); 
		}

	}

	$( "#buildingYear" ).button();
	$(document).ready(function() {
	   $('#buildingYear').click(function(){
	      var isChecked = $('#buildingYear').prop('checked');
	      if (isChecked == true) { 
	      	yearAdd(lowValue, highValue);

	  		} else {
	  			yearRemove(lowValue, highValue);
	   		}
	   });
	});


	$(function() {
			$( "#yearSlider" ).slider({
				range: true,
				min: 2000,
				max: 2014,
				values: [ 2010, 2014 ],
				slide: function( event, ui ) {
					$( "#yearRange" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
				},
				change: function( event, ui ) {
					lowValue = $( "#yearSlider" ).slider( "values", 0 );
					highValue = $( "#yearSlider" ).slider( "values", 1 );
					var isChecked = $('#buildingYear').prop('checked');
	      			
					if (isChecked == true) {
	      			yearRemove(lowValue, highValue);
	      			yearAdd(lowValue, highValue);
	      			}

	   			}});

		$( "#yearRange" ).val( $( "#yearSlider" ).slider( "values", 0 ) +
				"   -   " + $( "#yearSlider" ).slider( "values", 1 ) )
	});

	})();
