/**** CartoCSS for styling tax lot data ****/
var app = app || {};

app.mapStyles = (function(){
  return {
  // default style, all lots are the same color
  regular : '#bushwick_pluto14v1 {' +
                                'polygon-fill: hsl(200,50%,50%);' +
                                'polygon-opacity: 0.75;' +
                                'line-color: #000;' +
                                'line-width: 0.2;' +
                                'line-opacity: 0.5;' +
                              '}',
  // red highlight                            
  red : '#bushwick_pluto14v1 {' +
                                'polygon-fill: hsl(0,100%,30%);' +
                                'polygon-opacity: 0.75;' +
                                'line-color: #000;' +
                                'line-width: 0.2;' +
                                'line-opacity: 0.5;' +
                              '}',

  // category style based on zoning
  zoning : "#bushwick_pluto14v1 {" +
                                   "polygon-opacity: 0.75;" +
                                   "line-color: #000;" +
                                   "line-width: 0.2;" +
                                   "line-opacity: 0.5;" +
                                "}" +                                
                                '#bushwick_pluto14v1[zoning_style="R"] { polygon-fill: #A6CEE3;}' +
                                '#bushwick_pluto14v1[zoning_style="RC"] {polygon-fill: #1F78B4;}' +
                                '#bushwick_pluto14v1[zoning_style="M"] {polygon-fill: #FFCC00;}' +
                                '#bushwick_pluto14v1[zoning_style="C"] {polygon-fill: #7B00B4;}' +
                                '#bushwick_pluto14v1[zoning_style="P"] {polygon-fill: #229A00;}' +
                                '#bushwick_pluto14v1[zoning_style=""] {polygon-fill: #6b6868;}',

  // choropleth style based on Built FAR                                
  builtFAR : "#bushwick_pluto14v1 {" +
                             "polygon-fill: #F1EEF6;" +
                             "polygon-opacity: 0.8;" +
                             "line-color: #000;" +
                             "line-width: 0.2;" +
                             "line-opacity: 0.5;" +
                          "}" +                           
                          '#bushwick_pluto14v1[builtfar <= 23.05] { polygon-fill: #91003F;}' +
                          '#bushwick_pluto14v1[builtfar <= 8.59] {polygon-fill: #CE1256;}' +
                          '#bushwick_pluto14v1[builtfar <= 3.95] {polygon-fill: #E7298A;}' +
                          '#bushwick_pluto14v1[builtfar <= 3.53] {polygon-fill: #DF65B0;}' +
                          '#bushwick_pluto14v1[builtfar <= 2.7] {polygon-fill: #C994C7;}' +
                          '#bushwick_pluto14v1[builtfar <= 1.57] {polygon-fill: #D4B9DA;}'+  
                          '#bushwick_pluto14v1[builtfar <= 1.55]{polygon-fill: #F1EEF6;}',

  // choropleth style based on Residential FAR
  residFAR :  "#bushwick_pluto14v1 {" +
                             "polygon-fill: #FFFFB2;" +
                             "polygon-opacity: 0.8;" +
                             "line-color: #000;" +
                             "line-width: 0.2;" +
                             "line-opacity: 0.5;" +
                          "}" +                           
                          '#bushwick_pluto14v1[ residfar <= 3.44] { polygon-fill: #BD0026;}' +
                          '#bushwick_pluto14v1[ residfar <= 2.43] {polygon-fill: #F03B20;}' +
                          '#bushwick_pluto14v1[ residfar <= 0.9] {polygon-fill: #FD8D3C;}' +
                          '#bushwick_pluto14v1[ residfar <= 0.9] {polygon-fill: #FECC5C;}' +
                          '#bushwick_pluto14v1[ residfar <= 0.6] {polygon-fill: #FFFFB2;}',                             
  // choropleth style for available FAR
  availFAR : "#bushwick_pluto14v1{" +
                    "polygon-fill: #FFFFB2;" +
                    "polygon-opacity: 0.8;" +
                    "line-color: #000;" +
                    "line-width: 0.2;" +
                    "line-opacity: 0.5;" +
                    "}" +
                    "#bushwick_pluto14v1 [ availablefar <= 4] {" +
                    "polygon-fill: #BD0026;" +
                    "}" +
                    "#bushwick_pluto14v1 [ availablefar <= 3.2] {" +
                    "polygon-fill: #F03B20;" +
                    "}" +
                    "#bushwick_pluto14v1 [ availablefar <= 2.4000000000000004] {" +
                    "polygon-fill: #FD8D3C;" +
                    "}" +
                    "#bushwick_pluto14v1 [ availablefar <= 1.6] {" +
                    "polygon-fill: #FECC5C;" +
                    "}" +
                    "#bushwick_pluto14v1 [ availablefar <= 0.8] {" +
                    "polygon-fill: #FFFFB2;" +
                    "}",

  landuse : "#bushwick_pluto14v1 {" +
                     "polygon-opacity: 0.7;" +
                     "line-color: #000000;"+
                     "line-width: 0.2;"+
                     "line-opacity: 0.5;"+
                  "}"+
                  
                  '#bushwick_pluto14v1[lu_descript="Multi-Family Walkup"] {'+
                     'polygon-fill: #A6CEE3;'+
                  '}'+
                  '#bushwick_pluto14v1[lu_descript="One and Two Family Buildings"] {'+
                     'polygon-fill: #1F78B4;'+
                  '}'+
                  '#bushwick_pluto14v1[lu_descript="Mixed Residential & Commerical"] {'+
                     'polygon-fill: #B2DF8A;'+
                  '}'+
                  '#bushwick_pluto14v1[lu_descript="Parking Facilities"] {'+
                     'polygon-fill: #33A02C;'+
                  '}'+
                  '#bushwick_pluto14v1[lu_descript="Vacant Land"] {'+
                     'polygon-fill: #FB9A99;'+
                  '}'+
                  '#bushwick_pluto14v1[lu_descript="Commerical & Office"] {'+
                     'polygon-fill: #E31A1C;'+
                  '}'+
                  '#bushwick_pluto14v1[lu_descript="Industrial & Manufacturing"] {'+
                     'polygon-fill: #FDBF6F;'+
                  '}'+
                  '#bushwick_pluto14v1[lu_descript="Public Facilities & Insitutions"] {'+
                     'polygon-fill: #FF7F00;'+
                  '}'+
                  '#bushwick_pluto14v1[lu_descript="N/A"] {'+
                     'polygon-fill: #CAB2D6;'+
                  '}'+
                  '#bushwick_pluto14v1[lu_descript="Open Space & Recreation"] {'+
                     'polygon-fill: #6A3D9A;'+
                  '}'+
                  '#bushwick_pluto14v1 {'+
                     'polygon-fill: #DDDDDD;'+
                  "}"                      
  };
})();
