// Language toggle
function languageToggle() {
  console.log('hey');
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

languageToggle();