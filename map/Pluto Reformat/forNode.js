//Accepts the ArcGIS JSON as 1st argument and output file name as 2nd argument
//based off of https://github.com/odoe/esritogeojson.git

var fs = require('fs');
//arcGIS JSON goes here. **JSON object inside of a string**
var arcGISJSON = fs.readFileSync(process.argv[2]);
console.log("finished reading file");

//output file read and stored
var outputFilename = (process.argv[3]);

var stripJSON = function(str) {
    return str.replace(/\\n/g, "\\n")
              .replace(/\\t/g, "\\t");
};

var jsonToObject = function(stringIn) {
    var data;
    try {
        data = JSON.parse(arcGISJSON);
        //prior code
        // data = JSON.parse(stripJSON(stringIn));
        // console.log("json converted to object");
    } catch(err) {
        data = null;
    }
    return data;
};

// still not sure on how to translate some of these types
var parseGeometryType = function(type) {
    if (type === "esriGeometryPoint") {
        return "Point";
    } else if (type === "esriGeometryMultipoint") {
        return "MultiPoint";
    } else if (type === "esriGeometryPolyline") {
        return "LineString";
    } else if (type === "esriGeometryPolygon") {
        return "Polygon";
    } /* else if (type === "esriGeometryPolygon") {
        return "MultiLineString";
    } else if (type === "esriGeometryPolygon") {
        return "MultiPolygon";
    }*/ else {
        return "Empty";
    }
};

var featureToGeo = function(feature_in, geomType) {
    var geometry = {};
    geometry.type = geomType;
    
    // grab the rings to coordinates
    var geom = feature_in.geometry;
    
    var coordinates;
    if (geomType === "Polygon") {
        coordinates = geom.rings;
    } else if (geomType === "LineString") {
        coordinates = geom.paths;
    } else if (geomType === "Point") {
        coordinates = [geom.x, geom.y];
    }
    
    geometry.coordinates = coordinates;
    
    // convert attributes to properties
    var properties = {};
    var attr = feature_in.attributes;
    for (var field in attr) {
        properties[field] = attr[field];
    }
    
    var feature_out = {};
    feature_out.type = "Feature";
    feature_out.geometry = geometry;
    feature_out.properties = properties;
    
    return feature_out;
};

var deserialize = function(js, callback) {
    console.log("begin parsing json");
    
    var o = jsonToObject(js);
    var result;
    if (null !== o) {
        var geomType;
        geomType = parseGeometryType(o.geometryType);
        
        var features = [];
        for (var i = 0, feature = {}; feature = o.features[i]; i++) {
            // prepare the main parts of the GeoJSON
            var feat = featureToGeo(feature, geomType);
            features.push(feat);
        }
        
        var featColl = {};
        featColl.type = "FeatureCollection";
        featColl.features = features;
        
        result = JSON.stringify(featColl, function(key, value) {
            if (typeof value === 'number' && !isFinite(value)) {
                return String(value);
            }
            return value;
        });
        
        console.log("json parsed, return it");
    } else {
        result = "Sorry, JSON could not be parsed.";
    }

    
    //prior code
    // callback(null, result);

      callback(result);
};

exports.deserialize = deserialize;

deserialize(arcGISJSON, (function (theJSON) { 
        fs.writeFile(outputFilename, theJSON, function(err) {
                    if(err) {
                      console.log(err);
                    } else {
                      console.log("JSON saved to " + outputFilename);
                    }
        }); 
    })  
);

