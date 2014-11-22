function timerangeUI(){

  // Storing the values so we can compare and see which handle is being dragged
  var prevValues = [2000, 2014];
  var offset = {x: 50, y: 16}

  $( "#slider-range" ).slider({
    range: true,
    min: 2000,
    max: 2014,
    values: [ 2000, 2014 ],
    
    slide: function( event, ui ) {
      
      //Update values
      $("#year-min").html(ui.values[0]);
      $("#year-max").html(ui.values[1]);
      // console.log($(ui.handle.nextSibling)[0].style.left);
      // console.log($(ui.handle)[0].style.left);

      //Update position
      if(prevValues[0] != ui.values[0]){
        // A bit of a hack here...
        // Takes a millisecond for jQuery to update the handle position
        // That's why we need the setTimeout
        setTimeout(function(){
          $('#year-min').css('left', $(ui.handle)[0].style.left);
        }, 10);

      } else if (prevValues[1] != ui.values[1]){
        // console.log('right');
        setTimeout(function(){
          $('#year-max').css('left', $(ui.handle)[0].style.left);
        }, 10);
      }

      //Updating values for comparison
      prevValues[0] = ui.values[0];
      prevValues[1] = ui.values[1];
    }
  });

  // Writing the initial values
  $("#year-min").html($( "#slider-range" ).slider("values", 0));
  $("#year-max").html($( "#slider-range" ).slider("values", 1));

  // setTimeout(function(){
    $('#year-min').css({
      'left': $("#slider-range").children()[1].style.left,
      'top': offset.y
    });
    $('#year-max').css({
      'left': $("#slider-range").children()[2].style.left,
      'top': offset.y
    });  
}