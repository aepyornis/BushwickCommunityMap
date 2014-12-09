var app = app || {};

// all odyssey.js related code for the introduction is in here
app.intro = (function(w,d,$,O) {

  el = null;

  // creates the arrow clicking interaction for the slides
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
      case 0: console.log('first slide!'), slideZero(); 
      break;
      case 1: console.log('second slide!'), slideOne(); 
      break;
      case 2: console.log('third slide!'), slideTwo();
      break;
      case 3: console.log('fourth slide'), slideThree(); 
      break;
      case 4: console.log('fifth slide'), slideFour(); 
      break;
      case 5: console.log('sixth slide'), slideFive();;
      break;
      case 6: console.log('seventh slide');
      break;
      case 7: console.log('eigth slide');
      break;
      case 8: console.log('nineth slide'), slideEight();
      break;
      case 9: console.log('tenth slide'), slideNine();
      break;
      case 10: console.log('elevnth slide'), slideTen();
      break;        
      default: console.log('out of slide counters');  
    }
  }

  function slideZero() {
    el.map.setView(el.bushwick,15);
  }

  function slideOne() {
    if (!el.featureGroup.hasLayer(el.rheingoldPoly)) {
      el.featureGroup.addLayer(el.rheingoldPoly);  
    }
    el.map.fitBounds(el.rheingoldPoly);    
  }

  function slideTwo() {
    if (!el.featureGroup.hasLayer(el.rheingoldPoly)) {
      el.featureGroup.addLayer(el.rheingoldPoly);  
    }          
    el.taxLots.setSQL(el.sql.all);
    el.taxLots.setCartoCSS(el.styles.availFAR);      
    el.taxLots.show();      
  }

  function slideThree() {
    if (!el.featureGroup.hasLayer(el.rheingoldPoly)) {
      el.featureGroup.addLayer(el.rheingoldPoly);  
    }      
    el.taxLots.hide();
    el.dobPermitsNB.show();      
  }

  function slideFour() {
    if (!el.featureGroup.hasLayer(el.rheingoldPoly)) {
      el.featureGroup.addLayer(el.rheingoldPoly);  
    }      
    el.dobPermitsNB.hide();
    el.taxLots.setSQL(el.sql.rentStab);
    el.taxLots.setCartoCSS(el.styles.red);
    el.taxLots.show();
  }

  function slideFive() {
    el.taxLots.hide();      
    if (el.featureGroup.hasLayer(el.rheingoldPoly)) {
      el.featureGroup.removeLayer(el.rheingoldPoly);
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
    if (el.featureGroup.hasLayer(el.rheingoldPoly)) {
      el.featureGroup.removeLayer(el.rheingoldPoly);
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
    el.story = O.Story()
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
          slides.activate(1),
          emitSlideChange
        )
      )
      .addState(
        seq.step(2),
        O.Parallel(
          el.map.actions.setZoom(17),
          slides.activate(2),
          emitSlideChange
        )
      )
      .addState(
        seq.step(3),
        O.Parallel(
          el.map.actions.setZoom(16),            
          slides.activate(3),
          emitSlideChange
        )
      )
      .addState(
        seq.step(4),
        O.Parallel(
          el.map.actions.panTo(el.rheingold),                        
          slides.activate(4),
          emitSlideChange
        )
      )                  
      .addState(
        seq.step(5),
        O.Parallel(            
          el.map.actions.panTo(el.colony),                  
          slides.activate(5),
          L.marker(el.colony).actions.addRemove(el.map),
          emitSlideChange         
        )
      )
      .addState(
        seq.step(6),
        O.Parallel(            
          slides.activate(6),
          L.marker(el.colony).actions.addRemove(el.map),
          emitSlideChange         
        )
      )
      .addState(
        seq.step(7),
        O.Parallel(         
        el.map.actions.panTo(el.colony),   
          slides.activate(7),
          L.marker(el.colony).actions.addRemove(el.map),
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
          el.map.actions.panTo(el.linden),
          slides.activate(9),
          L.marker(el.linden).actions.addRemove(el.map),
          emitSlideChange 
        )          
      )
      .addState(
        seq.step(10),
        O.Parallel(            
          el.map.actions.panTo(el.bushwick),
          el.map.actions.setZoom(15),
          slides.activate(10),            
          emitSlideChange 
        )          
      );

    el.story.go(0);
  }

  // init button that hides / shows the intro slides
  function hideShow() {
    $('#toggle_slides a').bind('mouseup', function(){
      if($('#slides').css('display') != 'none'){
        $('#slides').css({
          display: 'none'
        });
        $('#navButtons').css({
          display: 'none'
        }); 
        $(this).html('Show intro');
      }else{
        $('#slides').css({
          display: 'block'
        });
        $('#navButtons').css({
          display: 'block'
        }); 
        $(this).html('Hide intro');   
      }
    });    
  }

  function init() {
    el = app.map.el;      
    initOdyssey(O);
    listenSlideChange();
    hideShow();            
  } 

  return {
    init : init
  }

})(window, document, jQuery, O);
