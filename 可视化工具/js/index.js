$(function() {
	$('.switch').click(function() {
		$(this).toggleClass('activeIcon');
		
		if ($(this).hasClass('group')) {
			$(this).siblings('.group').removeClass('activeIcon');
			$(this).parents('.ksh_small_box').siblings('.ksh_small_box').find('.group').removeClass('activeIcon');
		}
	});
	
	$('.rotate-box').hover(function() {
		$(this).removeClass('active2').addClass('active')
	}, function() {
		$(this).addClass('active2').removeClass('active')
	});
	
	$('.factor-tag-span').click(function() {
		$(this).toggleClass('select').siblings().removeClass('select');
	});

	$('.function-button').click(function () {
	    $(this).parents('.huan-box').css("display", "none");
	});

	$('#statusSwitch').click(function () {
	    $(this).parent().siblings().toggleClass('status-hidde');
	    
	    var innerHtml = $(this).html();
	    if (innerHtml === "&gt;") {
	        $(this).html("&lt;");
	    }
	    else {
	        $(this).html("&gt;");
	    }
        

	});
})