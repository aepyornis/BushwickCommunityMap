var app = app || {};

// all odyssey.js related code for the introduction is in here
app.intro = (function(w,d,$,O) {

  // to store the public variables from the main.js file
  var el = null;

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
   $(document).trigger('slideChange');
  });

  // listen for the slideChange event to be triggered
  function listenSlideChange() {
    $(document).on('slideChange', function() {
      console.log('listened to slidechange, story.state: ', el.story.state());
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
        cur = i;  
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
      case 7: console.log('eigth slide'), slideSeven();
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
    el.taxLots.show();
    el.dobPermitsNB.hide();
    el.taxLots.setCartoCSS(el.styles.regular);
    if (el.featureGroup.hasLayer(el.rheingoldPoly)) {
      el.featureGroup.removeLayer(el.rheingoldPoly);
    }
    if (el.featureGroup.hasLayer(el.lindenMarker)) {
      el.featureGroup.removeLayer(el.lindenMarker);
    }
    if (el.featureGroup.hasLayer(el.colonyMarker)) {
      el.featureGroup.removeLayer(el.colonyMarker);
    }        
  }

  function slideOne() {
    if (!el.featureGroup.hasLayer(el.rheingoldPoly)) {
      el.featureGroup.addLayer(el.rheingoldPoly);
      el.map.fitBounds(el.rheingoldPoly, {paddingTopLeft: [125, 35]});  
    }
    if (el.featureGroup.hasLayer(el.lindenMarker)) {
      el.featureGroup.removeLayer(el.lindenMarker);
    }
    if (el.featureGroup.hasLayer(el.colonyMarker)) {
      el.featureGroup.removeLayer(el.colonyMarker);
    }                
    el.taxLots.setCartoCSS(el.styles.landuse);    
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
      el.map.fitBounds(el.rheingoldPoly, {paddingTopLeft: [125, 35]});
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
    if (el.featureGroup.hasLayer(el.lindenMarker)) {
      el.featureGroup.removeLayer(el.lindenMarker);
    }    
    if (!el.featureGroup.hasLayer(el.colonyMarker)) {
      el.featureGroup.addLayer(el.colonyMarker);
    }
  }

  function slideSeven() {
    if (el.featureGroup.hasLayer(el.lindenMarker)) {
      el.featureGroup.removeLayer(el.lindenMarker);
    }    
    if (!el.featureGroup.hasLayer(el.colonyMarker)) {
      el.featureGroup.addLayer(el.colonyMarker);
    }    
  }

  function slideEight() {
    console.log('called eight');
    if (el.featureGroup.hasLayer(el.colonyMarker)) {
      el.featureGroup.removeLayer(el.colonyMarker);
    }    
    if (!el.featureGroup.hasLayer(el.lindenMarker)) {
      el.featureGroup.addLayer(el.lindenMarker);
    }
    el.dobPermitsA1.hide();
    el.dobPermitsA2A3.hide();      
  }

  function slideNine() {
    el.dobPermitsA1.show();
    el.dobPermitsA2A3.show();
    el.taxLots.hide();
  }

  function slideTen() {
    if (el.featureGroup.hasLayer(el.rheingoldPoly)) {
      el.featureGroup.removeLayer(el.rheingoldPoly);
    }
    if (el.featureGroup.hasLayer(el.colonyMarker)) {
      el.featureGroup.removeLayer(el.colonyMarker);
    }
    if (el.featureGroup.hasLayer(el.lindenMarker)) {
      el.featureGroup.removeLayer(el.lindenMarker);
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

    // Sequential() is the method for using click through slides with Odyssey
    var seq = O.Triggers.Sequential();

    // enable left and right arrow keys to move slides
    O.Triggers.Keys().left().then(seq.prev, seq)
    O.Triggers.Keys().right().then(seq.next, seq)

    // set up triggers for slide arrows 
    click(document.querySelectorAll('.next')).then(seq.next, seq);
    click(document.querySelectorAll('.prev')).then(seq.prev, seq);  

    // grab the slides div from the index.html page
    var slides = O.Actions.Slides('slides');

    el.story = new O.Story()
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
          slides.activate(4),
          emitSlideChange
        )
      )                  
      .addState(
        seq.step(5),
        O.Parallel(            
          el.map.actions.panTo(el.colony),                  
          slides.activate(5),          
          emitSlideChange         
        )
      )
      .addState(
        seq.step(6),
        O.Parallel(            
          slides.activate(6),
          emitSlideChange         
        )
      )
      .addState(
        seq.step(7),
        O.Parallel(         
        el.map.actions.panTo(el.colony),   
          slides.activate(7),
          emitSlideChange         
        )
      )                
      .addState(
        seq.step(8),
        O.Parallel(
          el.map.actions.panTo(el.linden),
          slides.activate(8),          
          emitSlideChange 
        )
      )
      .addState(
        seq.step(9),
        O.Parallel(            
          el.map.actions.setView(el.linden, 17),
          slides.activate(9),          
          emitSlideChange 
        )          
      )
      .addState(
        seq.step(10),
        O.Parallel(            
          el.map.actions.setView(el.bushwick, 15),
          slides.activate(10),            
          emitSlideChange 
        )          
      );

    el.story.go(0);

    // Links to the first slide of each story
    function navStories() {
      $('.story').on('click', function(){        
        var i = $(this).data('slide');
        console.log('slide data: ', i);
        el.story.go(i);
        seq.current(i);
        return false;
      });
      $('#map').on('click', '.story', function(){        
        var i = $(this).data('slide');
        console.log('slide data: ', i);
        el.story.go(i);
        seq.current(i);
        return false;
      });        
    } 

    navStories();    
  }

  // button that hides / shows the intro slides
  function hideShow() {
    $('#toggle_slides a').bind('mouseup', function(){
      
      if($('#slides').css('display') != 'none'){
        
        $('#slides, #navButtons, #navStories').css({
          display: 'none'
        });
        if($(this).hasClass('en')){
          $(this).html('Show intro');
        }else{
          $(this).html('Muestra intro');
        }

      }else{

        $('#slides, #navButtons, #navStories').css({
          display: 'block'
        });
        if($(this).hasClass('en')){
          $(this).html('Hide intro');   
        }else{
          $(this).html('Sin intro');
        }
        
      }
    });    
  }

   //  we can do this with CSS media queries and should leave ipad as an option anyway
  // function detectMobile(){
  //   $.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
  //   console.log("Mobile: " + $.browser.device);
  //   if($.browser.device){
  //     $('.ui, #map, #slides_container').css('display', 'none');
  //     $('#mobile_alert').css('display', 'block');
  //   }
  // }


  function init() {
    el = app.map.el;      
    initOdyssey(O);
    listenSlideChange();
    hideShow();
    detectMobile();
  } 

  return {
    init : init
  }

})(window, document, jQuery, O);
