$('#toggle_slides').bind('mouseup', function(){
	$('#slides').css({
		display: 'none'
	});
	$(this).html('Show intro');
});