var app = app || {};

app.intro = (function(w,d,$,O) {

  el = null;
  // var el = {
  //   map : app.map.el.map,
  //   sql : app.map.el.sql,
  //   styles : app.mapStyles,
  //   tileLayer : app.map.el.mapboxTiles,
  //   bushwick : app.map.el.bushwick,
  //   rheingold : app.map.el.rheingold,
  //   colony : app.map.el.colony,
  //   linden : app.map.el.linden,
  //   featureGroup : app.map.el.featureGroup,
  //   rheingoldJson : app.map.el.rheingoldJson,
  //   taxLots: app.map.el.taxLots,
  //   dobPermitsNB : app.map.el.dobPermitsNB,
  //   dobPermitsA1: app.map.el.dobPermitsA1,
  //   dobPermitsA2A3: app.map.el.dobPermitsA2A3    
  // };

  function click(el) {
    var element = O.Core.getElement(el);
    var t = O.Trigger();
    function click() {
      // console.log(el);
      t.trigger();
    }
    if (element) element.onclick = click;
    return t;
  }

  // trigger a custom event called SlideChange
  var emitSlideChange = O.Action( function() {
   $(document).trigger('slideChange', function() {
    console.log(seq.current())
   });
  });

  // listen for the slideChange event to be triggered
  function listenSlideChange() {
    $(document).on('slideChange', function() {
      console.log('listened to slidechange');
      trackCurrentSlide();
    });
  }    

  // fire this each time the user changes a slide
  function trackCurrentSlide() {
    slides = $('#slides').children(); // creates an array of slides                 
    slides.each(function(i){
      if ($(this).hasClass('selected')) {
        console.log('index: ', i);
        checkIndex(i);
      }
    }); 
  }

  // check the index being returned by trackCurrentSlide()
  function checkIndex(index) {
    switch(index){
      case 0: console.log('first slide!'), slideOne(); 
      break;
      case 1: console.log('second slide!'), slideTwo();
      break;
      case 2: console.log('third slide!'), slideThree();
      break;
      case 3: console.log('fourth slide'), slideFour();
      break;
      case 4: console.log('fifth slide'), slideFive();
      break;
      case 5: console.log('sixth slide');
      break;
      case 6: console.log('seventh slide');
      break;
      case 7: console.log('eigth slide'), slideEight();
      break;
      case 8: console.log('nineth slide'), slideNine();
      break;
      case 9: console.log('tenth slide'), slideTen();
      break;        
      default: console.log('out of slide counters');  
    }
  }

  function slideOne() {
    if (!el.featureGroup.hasLayer(el.rheingoldJson)) {
      el.featureGroup.addLayer(el.rheingoldJson);  
    }
    el.map.fitBounds(el.rheingoldJson);
    el.taxLots.hide();                    
    el.dobPermitsA1.hide();
    el.dobPermitsA2A3.hide();
  }

  function slideTwo() {
    if (!el.featureGroup.hasLayer(el.rheingoldJson)) {
      el.featureGroup.addLayer(el.rheingoldJson);  
    }          
    el.taxLots.setSQL(el.sql.all);
    el.taxLots.setCartoCSS(el.styles.availFAR);      
    el.taxLots.show();      
  }

  function slideThree() {
    if (!el.featureGroup.hasLayer(el.rheingoldJson)) {
      el.featureGroup.addLayer(el.rheingoldJson);  
    }      
    el.taxLots.hide();
    el.dobPermitsNB.show();      
  }

  function slideFour() {
    if (!el.featureGroup.hasLayer(el.rheingoldJson)) {
      el.featureGroup.addLayer(el.rheingoldJson);  
    }      
    el.dobPermitsNB.hide();
    el.taxLots.setSQL(el.sql.rentStab);
    el.taxLots.setCartoCSS(el.styles.red);
    el.taxLots.show();
  }

  function slideFive() {
    el.taxLots.hide();      
    if (el.featureGroup.hasLayer(el.rheingoldJson)) {
      el.featureGroup.removeLayer(el.rheingoldJson);
    }
  }

  function slideEight() {
    el.dobPermitsA1.hide();
    el.dobPermitsA2A3.hide();      
  }

  function slideNine() {
    el.dobPermitsA1.show();
    el.dobPermitsA2A3.show();
  }

  function slideTen() {
    if (el.featureGroup.hasLayer(el.rheingoldJson)) {
      el.featureGroup.removeLayer(el.rheingoldJson);
    }
    el.dobPermitsNB.hide();      
    el.dobPermitsA1.hide();
    el.dobPermitsA2A3.hide();
    el.taxLots.setSQL(el.sql.all);
    el.taxLots.setCartoCSS(el.styles.regular);
    el.taxLots.show();  
  }   

  function initOdyssey(O) {
    var map = el.map;

    var seq = O.Triggers.Sequential();

    // enable keys to move slides
    O.Triggers.Keys().left().then(seq.prev, seq)
    O.Triggers.Keys().right().then(seq.next, seq)
    // set up triggers for slide arrows 
    click(document.querySelectorAll('.next')).then(seq.next, seq)
    click(document.querySelectorAll('.prev')).then(seq.prev, seq)  

    var slides = O.Actions.Slides('slides');
    var story = O.Story()
      .addState(
        seq.step(0),
        O.Parallel(                        
          slides.activate(0),
          emitSlideChange
        )
      )
      .addState(
        seq.step(1),
        O.Parallel(
          el.map.actions.setZoom(17),
          slides.activate(1),
          emitSlideChange
        )
      )
      .addState(
        seq.step(2),
        O.Parallel(
          el.map.actions.setZoom(16),            
          slides.activate(2),
          emitSlideChange
        )
      )
      .addState(
        seq.step(3),
        O.Parallel(
          el.map.actions.panTo(el.rheingold),                        
          slides.activate(3),
          emitSlideChange
        )
      )                  
      .addState(
        seq.step(4),
        O.Parallel(            
          el.map.actions.panTo(el.colony),                  
          slides.activate(4),
          L.marker(el.colony).actions.addRemove(el.map),
          emitSlideChange         
        )
      )
      .addState(
        seq.step(5),
        O.Parallel(            
          slides.activate(5),
          L.marker(el.colony).actions.addRemove(el.map),
          emitSlideChange         
        )
      )
      .addState(
        seq.step(6),
        O.Parallel(         
        el.map.actions.panTo(el.colony),   
          slides.activate(6),
          L.marker(el.colony).actions.addRemove(el.map),
          emitSlideChange         
        )
      )                
      .addState(
        seq.step(7),
        O.Parallel(
          el.map.actions.panTo(el.linden),
          slides.activate(7),
          L.marker(el.linden).actions.addRemove(el.map),
          emitSlideChange 
        )
      )
      .addState(
        seq.step(8),
        O.Parallel(            
          el.map.actions.panTo(el.linden),
          slides.activate(8),
          L.marker(el.linden).actions.addRemove(el.map),
          emitSlideChange 
        )          
      )
      .addState(
        seq.step(9),
        O.Parallel(            
          el.map.actions.panTo(el.bushwick),
          el.map.actions.setZoom(15),
          slides.activate(9),            
          emitSlideChange 
        )          
      );

    story.go(0);
  }

  function init() {
    el = app.map.el;      
    initOdyssey(O);
    listenSlideChange();            
  } 

  return {
    init : init,
    el : el
  }

})(window, document, jQuery, O);

// call app.intro.init() once the DOM is loaded
window.addEventListener('DOMContentLoaded', function(){
  // app.intro.init();  
});