//map creation
	var map = L.map('map', {
		scrollWheelZoom: false
	}).setView([40.6941, -73.9162], 14);


//basemap creation
	var mainMap = L.tileLayer('http://m.elephant-bird.net/bwtiles/bwtiles/{z}/{x}/{y}.png', {
	    attribution: 'mapz by ziggy'
		}).addTo(map);

	var osmMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: 'open street map'
		});

	var tonerAtt = 	'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' + '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + 'Map data {attribution.OpenStreetMap}';

	var toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
	    attribution: tonerAtt
		});

	var ggl = new L.Google();

//GeoCode
	var osmGeocoder = new L.Control.OSMGeocoder(
		options = {position: 'bottomright'}
		);

	map.addControl(osmGeocoder);

//Land Use Function and PopUp Function
	function LandUse_function(feature) {
		if (feature == '01') {
			return '1 & 2 Family Buildings';	
		} 
		else if (feature == '02') {
			return 'Multi-Family Walkup';
		}
		else if (feature == '03') {
			return 'Multi-Family with Elevator';
		}
		else if (feature == '04') {
			return 'Mixed Residential & Commerical';
		}
		else if (feature == '05') {
			return 'Commerical & Office';
		}
		else if (feature == '06') {
			return 'Industrial & Manufacturing';
		}
		else if (feature == '07') {
			return 'Transport & utility';
		}
		else if (feature == '08') {
			return 'Public Facilities & Insitutions';
		}
		else if (feature == '09') {
			return 'Open Space & Recreation';
		}
		else if (feature == '10') {
			return 'Parking Facilities';
		}
		else if (feature == '11') {
			return 'Vacant Land';
		}
		else {
			return feature;
		}
	}

	function fun_jobType (feature) {
		if (feature == 'A1') { return 'A1: Major Alteration' }
		else if (feature == 'NB') { return 'New Buliding' }
		else if (feature === 'A2' || feature == 'A3') {return 'Minor* Alteration'} 
		else {return feature;}
	}

//POP UP Information
	
	function pop_pluto(feature, layer) {
		var popupContent = '<div style="text-align: center;"><strong>Property information</strong></div><table><tr><td>Address</td><td>' + feature.properties.Address +'</td></tr><tr><td>Owner Name</td><td>' + feature.properties.OwnerName + '</td></tr><tr><td>Lot Area</td><td>' + feature.properties.LotArea +' Sq. Feet' + '</td></tr><tr><td>Floors</td><td>' + feature.properties.NumFloors + '</td></tr><tr><td>Residential Units</td><td>' + '  ' +feature.properties.UnitsRes + '</td></tr><tr><td>Year Built</td><td>' + feature.properties.YearBuilt + '</td></tr><tr><td>Built FAR</td><td>' + feature.properties.BuiltFAR + '</td></tr><tr><td>Max Res FAR</td><td>' + feature.properties.ResidFAR + '<tr><td>Land Use</td><td>' + LandUse_function(feature.properties.LandUse) + '</td></tr></table><p><a target="_blank" href="http://a836-acris.nyc.gov/bblsearch/bblsearch.asp?borough=3&block=' + feature.properties.Block + '&lot=' + feature.properties.Lot + '">Click here for ACRIS information</a>';
				layer.bindPopup(popupContent);
		}


		function pop_alter(feature, layer) {
			var popupContent = '<table><tr><td>Address</td><td>' + feature.properties.Address + '</td></tr><tr><td>Job Type:</td><td>'+ fun_jobType(feature.properties.JobType) + '</td></tr><tr><td>Owner Name</td><td>' + feature.properties.OwnerName + '</td></tr><tr><td>Owner&#39s Business</td><td>' + feature.properties.OwnerBusin + '</td></tr><tr><td>Owner&#39s Phone #</td><td>' + feature.properties.OwnerPhone + '</td></tr><tr><td>Existing Stories:</td><td>' + feature.properties.ExistingSt + '</td></tr><tr><td>Proposed Stories:</td><td>' + feature.properties.ProposedSt + '</td></tr></table><br><a target="_blank" class="popupLink" href="http://a810-bisweb.nyc.gov/bisweb/JobsQueryByNumberServlet?passjobnumber=' + feature.properties.job + '">Click here for detailed information about the DOB permit</a>';

				layer.bindPopup(popupContent);
			}

//FILTERS
	function fun_alter(feature, layer) {
		if (feature.properties.jobtype == "A1" || feature.properties.jobtype == "NB") { return true; } 
			else { return false; }
	}

	function fun_a1(feature, layer) {
		if (feature.properties.jobtype == "A1") { return true; } 
			else { return false; }
	}

	function fun_a2a3(feature, layer) {
		if (feature.properties.jobtype == "A2" || feature.properties.jobtype == "A3") { return true; } 
			else { return false; }
	}

	function fun_NB(feature, layer) {
		if (feature.properties.jobtype == "NB") { return true; } 
			else { return false; }
	}


	function fun_rentStab(feature, layer) {
		if (feature.properties.YearBuilt < 1974) {
			if (feature.properties.UnitsRes >= 6) {
				return true;
			} else {
			return false;
			}
		} else {
		return false;
			}
	}

 	function fun_landuse11(feature, layer) {
		if (feature.properties.LandUse == '11') {
			return true;
		} else {
		return false;
			}
	}

//STYLES
	var myStyle = {
    	color: '#ff7800',
  		weight: 2,
   		opacity: 0.65
	};
	
	var yellow = {
    	fillColor: '#ffff66',
    	fillOpacity: 1,
    	opacity: 1,
    	stroke: false
	};

	var blankPluto = {
		fillOpacity: 0,
		opacity: 0
	};

	var white = {
		fillColor: 'white',
		fillOpacity: 1,
		stroke: false
	};

	var built = {
	};

//FAR Stuff
	var info;
	info = new L.control( {position: 'bottomleft'} );

		info.onAdd = function (map) {
				this._div = L.DomUtil.create('div', 'info');
				this.update();
				return this._div;
			};

			info.update = function (props) {

				this._div.innerHTML = '<div class="center"><h4>Available Residential FAR: </h4></div>' +  (props ?
					'<div class="center"><b><p>' + (props.ResidFAR - props.BuiltFAR).toFixed(2) + '</b></p></div>'
					: 'Hover over a property');
			};

		

	function far_color(d) {
				return  d > 2.0 ? '#0A428F' :
						d > 1.20 ? '#3061A4' : 
						d > 0.80 ? '#5680BA' :
						d > 0.60 ? '#7DA0D0' :
						d > 0.30 ? '#A3BFE6' :
						d > 0 ? '#CADFFC' :
				                  '#000000';
			}
	function far_style(feature) {
				
				var potFAR = (feature.properties.ResidFAR - feature.properties.BuiltFAR);

				return {
					opacity: 0.4,
					weight: 0.1,
					color: 'white',
					fillOpacity: 0.6,
					fillColor: far_color(potFAR)
				};
			}

	function highlightFeature(e) {
				var layer = e.target;

				layer.setStyle({
					weight: 2.5,
					color: '#000000',
					dashArray: '',
					fillOpacity: 0.7,
					fillColor: '#a7320c'
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					layer.bringToFront();
				}

				info.update(layer.feature.properties);
			}

	var FAR;

	function resetHighlight(e) {
				FAR.resetStyle(e.target);
				info.update();
				}

	function far_onEachFeature(feature, layer) {
				
				var potFAR = (feature.properties.ResidFAR - feature.properties.BuiltFAR);
				var potFAR_display = potFAR.toFixed(2);
				var content_FAR = '<table><tr><th>attribute</th><th>value</th></tr><tr><td>Address</td><td>' + feature.properties.Address +'</td></tr><tr><td>Owner Name</td><td>' + feature.properties.OwnerName + '</td></tr><tr><td>Lot Area</td><td>' + feature.properties.LotArea +' Sq. Feet' + '</td></tr><tr><td>Floors</td><td>' + feature.properties.NumFloors + '</td></tr><tr><td>Residential Units</td><td>' + '  ' +feature.properties.UnitsRes + '</td></tr><tr><td>Year Built</td><td>' + feature.properties.YearBuilt + '</td></tr><tr><td>Current built FAR</td><td>' + feature.properties.BuiltFAR + '</td></tr><tr><td>Land Use</td><td>' + LandUse_function(feature.properties.LandUse) + '</td></tr></table>' + '<b>Available FAR: </b><p>' + potFAR_display + '</p><p><a target="_blank" href="http://a836-acris.nyc.gov/bblsearch/bblsearch.asp?borough=3&block=' + feature.properties.Block + '&lot=' + feature.properties.Lot + '">Click here for ACRIS information</a>';
					
				layer.on({
					mouseover: highlightFeature,
					mouseout: resetHighlight,
				});
				
				layer.bindPopup(content_FAR);
			}

	FAR = new L.geoJson(bushwickJSON, {
		style: far_style,
		onEachFeature: far_onEachFeature
	});

	var legend = new L.control({position: 'bottomright'});

			legend.onAdd = function (map) {

				var div = L.DomUtil.create('div', 'info legend'),
					grades = [0, 0.30, 0.60, 0.80, 1.20, 2.0],
					labels = [],
					from, to;

				for (var i = 0; i < grades.length; i++) {
					from = grades[i];
					to = grades[i + 1];

					labels.push(
						'<i style="background:' + far_color(from + .1) + '"></i> ' +
						from + (to ? '&ndash;' + to : '+'));
				}

				div.innerHTML = labels.join('<br>');
				return div;
			};

//layers
	var likelyRentStab = new L.geoJson(bushwickJSON, {
		style: myStyle,
		filter: fun_rentStab,
	});

	// var julyJobs= new L.geoJson(exp_julySHP,{
	// 				onEachFeature: pop_alter,
	// 				filter: fun_alter,
	// 				pointToLayer: function (feature, latlng) {  
	// 					return L.circleMarker(latlng, {
	// 						radius: feature.properties.radius_qgis2leaf,
	// 						fillColor: feature.properties.color_qgis2leaf,
	// 						color: '#000',
	// 						weight: 1,
	// 						opacity: feature.properties.transp_qgis2leaf,
	// 						fillOpacity: feature.properties.transp_fill_qgis2leaf
	// 						})
	// 					}
	// 				});





	var landuse11 = new L.geoJson(bushwickJSON,{
				style: white,
				onEachFeature: pop_pluto,
				filter: fun_landuse11,
				pointToLayer: function (feature, latlng) {
				return L.marker(latlng);}
		});

//blank pluto popup
	var exp_pluto = new L.geoJson(bushwickJSON,{
				style: blankPluto,
				onEachFeature: pop_pluto,
				pointToLayer: function (feature, latlng) {
				return L.marker(latlng);}
					});
	exp_pluto.addTo(map);

//Basemap control
	var baseMaps = {
		"Tax Lots": mainMap,
		"Open Street Map": osmMap,
		"Black and White": toner,
		"Google Satellite": ggl
	};
	var overLays = {
	};

	L.control.layers(baseMaps, overLays, {collapsed: false}).addTo(map);

//check boxes
	//inputed ID must be in "" like "farButton"
	//to disable, put "disable" for layer
	var createButton = function (id, layer) {
		
		$( '#' + id).button();

			$(document).ready(function() {

	   		$( '#' + id).click(function(){
		      var isChecked = $( '#' + id).prop('checked');
			      if (isChecked == true) { 
			      	
			      	map.addLayer(layer);

			  		} else {
			  			map.removeLayer(layer);
			   		}
	   		});
		});	
	};

	createButton("rentStabButton", likelyRentStab);
	// createButton("permitsButton", julyJobs);
	createButton("vacantLand", landuse11);
	//disabled buttons: DOB violations, evictions
	$( "#violationsButton" ).button();
	$( "#evictButton" ).button();
	$( "#violationsButton" ).button( "disable" );
	$( "#evictButton" ).button( "disable" );

	//can't use createButton for FAR...it's has extra stuff
	$( "#farButton" ).button();
	$(document).ready(function() {
	   $('#farButton').click(function(){
	      var isChecked = $('#farButton').prop('checked');
	      if (isChecked == true) { 
	      		map.addLayer(FAR);
	      		legend.addTo(map);
				info.addTo(map);
	  		} else {
	  			map.removeLayer(FAR);
				legend.removeFrom(map);
				if (info != undefined) {
	   			 info.removeFrom(map);
	    		} else {}
	   		}
	   });
	});

//Sites of Gentrification Markers 

	var g1 = L.marker([40.695875, -73.928266]).bindPopup("The Colony 1209");
	var g2 = L.marker([40.700852, -73.936285]).bindPopup("Rheingold Rezoning");
	var g3 = L.marker([40.700082, -73.913740]).bindPopup("358 Grove St. Condos");	

	var gentriLayer = new L.layerGroup([g1, g2, g3])

	createButton("gentriLayer", gentriLayer);

//Year Slider
	//abstracted previous process; but now there's a delay because it's recreating layers and filtering each time
	//Orignal can be found here: age_layers_original.js	
	
	(function yearLayers() {
		var lowValue = 2010;
		var highValue = 2014;
		var ageLayerGroup = L.layerGroup();

	 	$(document).ready(function(){ 

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

						ageLayerGroup.clearLayers();
						yearLayersCreate(lowValue, highValue);
		  		
		  			}
				}

			});

			$( "#yearRange" ).val( $( "#yearSlider" ).slider( "values", 0 ) +
						"   -   " + $( "#yearSlider" ).slider( "values", 1 ) );

			$( "#buildingYear" ).button();
			
			$('#buildingYear').click(function(){
				var isChecked = $('#buildingYear').prop('checked');
				if (isChecked == true) { 
				    	yearLayersCreate(lowValue, highValue)

				  	} else {
				  		
				  		ageLayerGroup.clearLayers();

				   		}
				   });
		});


		function yearLayersCreate (start, end) {
				var yellow = {
			    	fillColor: '#ffff66',
			    	fillOpacity: 1,
			    	opacity: 1,
			    	stroke: false
				};

				function age(feature, layer) {
						if ( (feature.properties.YearBuilt >= start && feature.properties.YearBuilt <= end) == true) {
							return true;

						} else { return false; }
				}	

			for (var i = start; i <= end; i++) {
					var ageLayer = new L.geoJson(bushwickJSON,{
					style: yellow,
					onEachFeature: pop_pluto,
					filter: age,
					pointToLayer: function (feature, latlng) {
					return L.marker(latlng);}
					});
					ageLayerGroup.addLayer(ageLayer);
			}

			ageLayerGroup.addTo(map);

		}

	})(); 

//DOB Permits + Month Slider
	
var permitsStuff = function() {
	var value1 = 5;
	var value2 = 6;
	var a1Layer;
	var a2Layer;
	var NBLayer;  

		function numToMonth(x) {
		      var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
		      return months[x];
		}
		function monthMove() {
		      var value1 = $( '#monthSlider' ).slider ( "values", 0 );
		      var value2 = $( '#monthSlider' ).slider ( "values", 1 );
		     $( "#monthText" ).val ( numToMonth(value1) + "  -  " + numToMonth(value2) );
		}
		


	//update functions create layer and update them to filter according to the current state of the slider     
	
	var update_a1 = function() {
			function fun_a1(feature, layer) {
				 
				  if (feature.properties.JobType == "A1") {
				  		if 	( feature.properties.NumMonth >= value1 && feature.properties.NumMonth <= value2) { 
				  			return true;
				  		} else { return false; }

				  	} else { return false; }
			}


			a1Layer = L.geoJson(exp_CodedJobs,{
		          onEachFeature: pop_alter,
		          filter: fun_a1,
		          pointToLayer: function (feature, latlng) {  
		            return L.circleMarker(latlng, {
		              radius: 4.0,
		              fillColor: '#237f9d',
		              color: '#000',
		              weight: 1,
		              opacity: 1.0,
		              fillOpacity: 1.0
		              })
		            }
		    });
	};
		

	
	var update_a2 = function() {
			function fun_a2(feature, layer) {
			 
			  if (feature.properties.JobType == "A2" || feature.properties.JobType == "A3") {
			  		if 	( feature.properties.NumMonth >= value1 && feature.properties.NumMonth <= value2) { 
			  			return true;
			  		} else { return false; }

			  	} else { return false; }
			}


			a2Layer = L.geoJson(exp_CodedJobs,{
			          onEachFeature: pop_alter,
			          filter: fun_a2,
			          pointToLayer: function (feature, latlng) {  
			            return L.circleMarker(latlng, {
			              radius: 4.0,
			              fillColor: '#3aadd3',
			              color: '#000',
			              weight: 1,
			              opacity: 1.0,
			              fillOpacity: 1.0
			              })
			            }
			          });
	};
	
	var update_NB = function() {
			function fun_NB(feature, layer) {
			 
			  if (feature.properties.JobType == "NB") {
			  		if 	( feature.properties.NumMonth >= value1 && feature.properties.NumMonth <= value2) { 
			  			return true;
			  		} else { return false; }

			  	} else { return false; }
			}


			NBLayer = L.geoJson(exp_CodedJobs,{
			          onEachFeature: pop_alter,
			          filter: fun_NB,
			          pointToLayer: function (feature, latlng) {  
			            return L.circleMarker(latlng, {
			              radius: 5.0,
			              fillColor: '#1a5d73',
			              color: '#000',
			              weight: 1,
			              opacity: 1.0,
			              fillOpacity: 1.0
			              })
			            }
			          });
	};

	
	update_a1();
	update_a2();
	update_NB();
	createButton("a1", a1Layer);
	createButton("a2a3", a2Layer);
	createButton("newBuild", NBLayer);

	$( "#monthSlider" ).slider({
					range: true,
					min: 0,
					max: 6,
					values: [ 5, 6 ],
					slide: function( event, ui ) {
						$( "#monthText" ).val( numToMonth(ui.values[ 0 ]) + "  -  " + numToMonth(ui.values[ 1 ]) );
					},
					change: function ( event, ui ) {
						map.removeLayer(a1Layer);
						map.removeLayer(a2Layer);
						map.removeLayer(NBLayer);
						value1 = $( '#monthSlider' ).slider ( "values", 0 );
						value2 = $( '#monthSlider' ).slider ( "values", 1 );
						update_a1();
						update_a2();
						update_NB();
						var isA1Checked = $('#a1').prop('checked');
						var isA2Checked = $('#a2a3').prop('checked');
						var isNBChecked = $('#newBuild').prop('checked');
						if (isA1Checked == true) {
	              			map.addLayer(a1Layer);
	              		}
	              		if (isA2Checked == true) {
	              			map.addLayer(a2Layer);
	              		}
	              		if (isNBChecked == true) {
	              			map.addLayer(NBLayer);
	              		}

					}
	});
	// monthMove();	
					
	};

	permitsStuff();

//Tell your own story

	function onMapClick(e) {

		var popHTML = '<div class="userPopUp"><form action="#"><label>Your Name:</label><div class="userBox"><input type="text" name="name" /></div><label>Your Email or phone:</label><div class="userBox"><input type="text" name="Email" class="email" /><label>Your story:</label><TEXTAREA rows="12" cols="60" class="story" name="story" placeholder="Write your story here..."></TEXTAREA></div><div class="userBox"><fieldset><label for="storyType">Type of story</label><select name="storyType" class="storyType"><option>Neighborhood Change</option><option>Landlord Abuse</option><option>Eviction</option><option>Rent</option><option>This place needs help</option><option>Success story</option><option>Other</option></select></fieldset></div><div class="userBox"><input type="submit" value="Submit"><input type="button" value="Delete this marker" class="marker-delete-button"/></div></form></div>';

		    var geojsonFeature = {
		        "type": "Feature",
		            "properties": {},
		            "geometry": {
		             "type": "Point",
		             "coordinates": [e.latlng.lat, e.latlng.lng]
		        }
		    }
		    var marker;
		    L.geoJson(geojsonFeature, {
		        
		        pointToLayer: function(feature, latlng){
		            
		            marker = L.marker(e.latlng, {
		                
		                title: "Your story",
		                alt: "Your story",
		                riseOnHover: true,
		                draggable: true,

		            }).bindPopup(popHTML);

		            marker.on("popupopen", onPopupOpen);
		       
		            return marker;
		        }
		    }).addTo(map);
		}


		// Function to handle delete as well as other events on marker popup open
		function onPopupOpen() {

		$( document ).ready(function() {
			$( ".storyType" ).selectmenu();
			});
		    var tempMarker = this;

		    //var tempMarkerGeoJSON = this.toGeoJSON();
		    //var lID = tempMarker._leaflet_id; // Getting Leaflet ID of this marker
		    //To remove marker on click of delete
		    $(".marker-delete-button:visible").click(function () {
		        map.removeLayer(tempMarker);
		    });
		}

	$( '#userButton'  ).button();
	$(document).ready(function() {
		   $('#userButton').click(function(){
		      var isChecked = $('#userButton').prop('checked');
		      if (isChecked == true) { 

		      		map.removeLayer(exp_pluto);
		      		map.on('click', onMapClick);

		  		} else {
		  			
		  			map.off('click', onMapClick);
		  			map.addLayer(exp_pluto); 

		   		}
		   });
		});

//Glossary PopUP
	(function() {

		var far = "FAR stands for Floor Area Ratio. It's a zoning regulation that determines the maximum floor area (total sq. feet) that a building is allowed to have. The FAR, combined with other regulations, limits how high and how many units a building may have.<br> Buildings can be built or renovated to contain up to the maximum allowable FAR 'as of right', meaning they do not need special permission to do so. An owner with a property far below the maximum might decide to evict his/her tenants and rebuild with more units in order to collect more rent.";

		var rent = "New York City has a complex array of Rent Stabilization Laws and regulations. The buildings highlighted in this layer we are calling “Likely Rent-Stabilized”. They are buildings built before 1974 and contain 6 or more units. However, some of these buildings might no longer be rent-stabilized.  There is a process where older buildings can become deregulated, meaning they are no longer are legally rent-stabilized. The rent of a rent stabilized unit can only be raised a certain percentage every year and the tenant must be offered a lease renewal.";

		var permits = "Permits issued for major alterations and new buildings. Click on the circles to find out the owner information and a link to the full permit application.";

		var violations = "DOB Violations: data comming soon";

		var evictions = "Evictions: data comming soon";

		var vacant = "This is land without a building. It could be vacant for any number of reasons. Who owns it will provide a clue as to why. Perhaps it's owned by a utility company or the government who are holding it for some reason. Or it could be owned by an absentee owner. Or an owner might be holding on it waiting for building permits or to re-sell it.";

		var age = "Use the slider to explore the newest buildings of bushwick over the past 15 years. There are 1124 buildings built since 2000, representing about 10% of Bushwick";

		var start = "Hover over a layer!";

		var glossary = function(inputID, text) {

			$(document).ready(function() {


			$( '.' + inputID ).hover( 
				function() { 
					$("#infoBox p").html(text);
					$("#infoBox p").css("text-align", "left");

				},
				function() { 
					$("#infoBox p").html(start);
					$("#infoBox p").css("text-align", "center");
					}
				);

			});
		};

		glossary("farButton", far);
		glossary("rentStabButton", rent);
		glossary("permitsButton", permits);
		glossary("violationsButton", violations);
		glossary("evictButton", evictions);
		glossary("vacantLand", vacant);
		glossary("buildingYear", age);



	})();


