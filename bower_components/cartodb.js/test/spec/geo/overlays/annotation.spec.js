describe("cdb.geo.ui.Annotation", function() {

  var data, view, map, mapView;

  describe("Annotation unbinding", function() {

    var spy;

    beforeEach(function() {

      map = new cdb.geo.Map();

      container = $('<div>').css('height', '200px');

      mapView = new cdb.geo.GoogleMapsMapView({
        el: container,
        map: map
      });

      spy = spyOn(cdb.geo.ui.Annotation.prototype, '_place');

      view = new cdb.geo.ui.Annotation({
        text: "You are <strong>here</strong>",
        latlng: [40, 2],
        mapView: mapView,
        minZoom: 0,
        maxZoom: 40,
      });

      mapView.$el.append(view.render().$el);

    });

    afterEach(function() {
      view.clean();
      container.remove();
    });

    it("should unbind from the map", function() {

      mapView.map.bind('change', spy, view);

      view.clean();

      mapView.map.set('center', [10, 10]);

      waits(500);

      runs(function(){
        expect(spy.wasCalled).toEqual(true);
        expect(spy.callCount).toEqual(1);
      });

    });

  });

  describe("Annotation movement", function() {

    var spy;

    beforeEach(function() {

      map = new cdb.geo.Map();

      container = $('<div>').css('height', '200px');

      mapView = new cdb.geo.GoogleMapsMapView({
        el: container,
        map: map
      });

      spy = spyOn(cdb.geo.ui.Annotation.prototype, '_place');

      view = new cdb.geo.ui.Annotation({
        text: "You are <strong>here</strong>",
        latlng: [40, 2],
        mapView: mapView,
        minZoom: 0,
        maxZoom: 40,
      });

      mapView.$el.append(view.render().$el);

    });

    afterEach(function() {
      view.clean();
      container.remove();
    });

    it("should move when the map moves", function() {

      mapView.map.bind('change', spy);
      mapView.map.set('center', [10, 10]);

      waits(200);

      runs(function(){
        expect(spy.wasCalled).toEqual(true);
        expect(spy.callCount).toEqual(2);
      });

    });


  });

  describe("Annotation setters", function() {

    beforeEach(function() {

      map = new cdb.geo.Map();

      container = $('<div>').css('height', '200px');

      mapView = new cdb.geo.GoogleMapsMapView({
        el: container,
        map: map
      });

      view = new cdb.geo.ui.Annotation({
        text: "You are <strong>here</strong>",
        latlng: [40, 2],
        mapView: mapView,
        minZoom: 0,
        maxZoom: 40,
        style: {
          textAlign: "left",
          zIndex: 1000,
          textAlign: "right",
          "font-size": "13",
          fontFamilyName: "Helvetica",
          "box-color": "#F84F40",
          boxOpacity: 0.7,
          boxPadding: 10,
          "line-width": 50
        }
      });

      mapView.$el.append(view.render().$el);

    });

    afterEach(function() {
      view.clean();
      container.remove();
    });

    it("should render", function() {
      waits(700);
      runs(function() {
        expect(view.$el.find(".text").html()).toEqual("You are <strong>here</strong>");
        expect(view.$el.css("background-color")).toEqual('rgba(248, 79, 64, 0.701961)');
        expect(view.$el.find(".stick").css("background-color")).toEqual('rgb(51, 51, 51)');
        expect(view.$el.find(".text").css("color")).toEqual('rgb(255, 255, 255)');
      });
    });

    it("should allow to change the text", function() {
      expect(view.model.set("text", "Now you are here"));
      expect(view.$el.find(".text").html()).toEqual("Now you are here");
    });

    it("should allow to change the text", function() {
      expect(view.setText("I'm here"));
      expect(view.$el.find(".text").text()).toEqual("I'm here");
    });

    it("should allow to change the style", function() {
      expect(view.setStyle("color", "#000000"));
      expect(view.$el.find(".text").css("color")).toEqual('rgb(0, 0, 0)');
    });


  });


});
