var fs = require('fs');
var ArcGIS = require('terraformer-arcgis-parser');

// parse ArcGIS JSON, convert it to a Terraformer.Primitive (GeoJSON)
var primitive = ArcGIS.parse({
    x:"-122.6764",
    y:"45.5165",
    spatialReference: {
      wkid: 4326
    }
  });

// take a Terraformer.Primitive or GeoJSON and convert it back to ArcGIS JSON
var point = ArcGIS.convert({
  "type": "Point",
  "coordinates": [45.5165, -122.6764]
});



fs.writeFile("testJSON.json", JSON.stringify(primitive, null, 4), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
});

