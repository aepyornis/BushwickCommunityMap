// Language toggle
function languageToggle(language) {

  var currentLanguage;

  if(typeof language === 'undefined'){
    currentLanguage = document.URL.substring(document.URL.lastIndexOf('=') + 1, document.URL.length);
  }else{
    currentLanguage = language;
  }
  
  // console.log(currentLanguage);
  if(currentLanguage == 'es'){
      console.log('Spanish');
      $('.en').css({
        display: 'none'
      });
      $('.es').css({
        display: 'inline-block'
      });        
      
      $(this).html('in English');

      // Add language parameter to buttons href
      $.each($('.button'), function(index, value){      
        $(value).attr('href', $(value).attr('href') + '?language=es');
      });

      // Toggle bt
      $('#language').bind('mouseup', function(){
        $(this).html('en Español');
        languageToggle('en');
      });           

    }else{
      console.log('English');  
      currentLanguage = 'en';

      $('.en').css({
        display: 'inline-block'
      });
      $('.es').css({
        display: 'none'
      });        

      // Add language parameter to buttons href
      $.each($('.button'), function(index, value){      
        $(value).attr('href', $(value).attr('href') + '?language=en');
      });    

      // Toggle bt
      $('#language').bind('mouseup', function(){
        $(this).html('in English');
        languageToggle('es');
      });          
    }
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