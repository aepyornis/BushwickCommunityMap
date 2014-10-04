var Terraformer = require('terraformer');
var ArcGIS = require('terraformer-arcgis-parser');



var polygon = new Terraformer.Primitive({
  "type": "Polygon",
  "coordinates": [
    [
      [-122.66589403152467, 45.52290150862236],
      [-122.66926288604736, 45.52291654238294],
      [-122.67115116119385, 45.518406234030586],
      [-122.67325401306151, 45.514000817199715],
      [-122.6684260368347, 45.5127377671934],
      [-122.66765356063841, 45.51694782364431],
      [-122.66589403152467, 45.52290150862236 ]
    ]
  ]
});

var point = new Terraformer.Primitive({
  "type": "Point",
  "coordinates": [-122.66947746276854, 45.51775972687403]
});