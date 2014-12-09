Bushwick Community Map
------

The Bushwick Community Map is a mapping project that will provide local residents and community organizers with housing an urban planning data of our neighborhood to help track the changes happening in Bushwick, particularly the urban vices of gentrification and displacement.

El Mapa de la Comunidad de Bushwick es un proyecto de mapa que proveerá datos sobre la vivienda y la planificación urbana a los residentes locales y a los organizadores de la comunidad para ayudar a seguir los cambios que ocurren en Bushwick, en particular los vicios urbanos de gentrificación y desplazamiento.


See it in action here: [BushwickCommunityMap.org](http://www.bushwickcommunitymap.org)

## Installation

### Dependencies

The interactive map runs on:  

- Leaflet.js
- Cartodb.js
- Odyssey.js
- Mapbox.js
- Google Maps API geocoder
- Bing Maps satellite imagery
- JQuery
- Underscore.js

You can install dependencies using by [Bower](http://bower.io) and running `bower install` in the root directory to download all dependencies locally. 

Install the files and folders in this folder in the public directory of your server. Or run locally using a local server such as [Python's SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html) and doing `python -m SimpleHTTPServer 8000`. Then go to `localhost:8000` on your favorite web browser.

## Map Data Layers

The Following open datasets are being utilized:

- [NYC Map Pluto](http://www.nyc.gov/html/dcp/html/bytes/dwn_pluto_mappluto.shtml)
- [NYC Department of Buildings (DOB) permits](https://data.cityofnewyork.us/Housing-Development/DOB-Permit-Issuance/ipu4-2q9a)
- Likely Rent Stabilized tax lot data via an analysis of [DHCR 2012 rent stabilized buildings](https://github.com/clhenrick/dhcr-rent-stabilized-data) list & Map Pluto data sets.


### Details:
- Most map data layers are being hosted on [CartoDB](http://cartodb.com) under the username `Bushwick` and loaded using `CartoDB.js`.

- When updating these data layers such as the tax lots, DOB permits, etc. import new data into CartoDB and follow instructions and run the scripts as described in the files within the `sql` folder.

- Other data such as the sites of gentrification are being loaded as `L.Markers` in the main.js file.


- The Rheingold boundary is a `GeoJSON` vector overlay being loaded through an `$.getJSON` call via `AJAX` and `Leaflet.js` and is stored in the `data` directory.

## Browser Compatibility
Tested successfully on modern versions of the following browsers:

- Chrome
- Safari
- Firefox

Have not yet tested on Internet Explorer.


**note:** the Chrome extension `HTTPS Everywhere` will break the map.