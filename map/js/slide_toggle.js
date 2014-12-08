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