// Language toggle
function languageToggle() {
  $('#language').bind('mouseup', function(){
    
    if($('.en').css('display') == 'none'){
      console.log('English');  
      $('.en').css({
        display: 'inline-block'
      });
      $('.es').css({
        display: 'none'
      });        
      
      $(this).html('en Español'); 

    }else{
      console.log('Spanish');
      $('.en').css({
        display: 'none'
      });
      $('.es').css({
        display: 'inline-block'
      });        
      
      $(this).html('in English');
    }
  });    
}

var initNavBarButtons = function() {
  var currentPage = document.URL.substring(document.URL.lastIndexOf('/') + 1, document.URL.lastIndexOf('.'));
  var buttons = [];

  $.each($('.button'), function(index, value){
    var label = $(value).html();
    label = label.toLowerCase().replace(' ', '_');
    // buttons.push(label);
    if(label == currentPage){
      $(value).addClass('selected');
    }
  });
}

languageToggle();
initNavBarButtons();