$(function(){
		$('.imgIcon').click(function(){
			if($(this).hasClass('aaa')){
				$('.left').animate({'left':'0'});
					$(this).removeClass('aaa');
					$(this).find('img.aa').attr('src','images/aa.png');
					$('.double_1').animate({'margin-left':'170px'})
					$('.kongJian').animate({'margin-left':'170px'})

				}
				else{
					$('.left').animate({'left':'-170px'});
					$(this).addClass('aaa');

					$(this).find('img.aa').attr('src','images/bb.png');
					
					$('.double_1').animate({'margin-left':'0'});
					$('.kongJian').animate({'margin-left':'0'});
				}
				
		})
		$('.toggle').click(function(){
			// if($(this).hasClass('plus')){
			// 	$(this).parents('p').siblings('.contentRight_con_con').slideDown();
			// 	$(this).text('-').removeClass('plus');
			// }
			// 	else{
			// 		$(this).parents('p').siblings('.contentRight_con_con').slideUp();
			// 		$(this).text('+').addClass('plus');
			// 	}
			$(this).parents('.contentRight').animate({'right':'-200px'});
			$('.rightIcon').show();
			$('html,body').css('overflow','hidden');

		})
		$('.rightIcon').click(function(){
			$(this).parents('.contentRight').animate({'right':'0'});
			$(this).hide();
		})
		// $('.selects a').hover(function(){
		// 	$(this).children('.childMenu').stop().slideDown();
		// 	$(this).addClass('activeIcon');
		// 	$(this).css('opacity','1').siblings('a').css('opacity','0.5');

		// },function(){
		// 	$(this).children('.childMenu').stop().slideUp()
		// 	$(this).removeClass('activeIcon');
		// 	$(this).css('opacity','1').siblings('a').css('opacity','1');


		// })
		// $('.single a').click(function(){
		// 	$(this).toggleClass('activeIcon')
		// })
		// $('.selects').click(function(){
			
		// 	$(this).find('i').end().siblings('.selects').find('i').slideUp();
		// })
		// $('.selects a').click(function(){
		// 	$(this).children('.childMenu').slideToggle();

		// })
		// $('.single').click(function(){
			
		// 	$(this).toggleClass('activeIcon');
		// 	$(this).addClass('activeIcon').siblings('.selects').removeClass('activeIcon');
		// 	$(this).siblings('.double').find('a').removeClass('activeIcon');

		// })
		$('.slidess').hover(function(){
			$(this).find('.childMenu').stop().slideDown();
			$(this).addClass('activeIcon');
		},function(){
			$(this).find('.childMenu').stop().slideUp();
			$(this).removeClass('activeIcon');

		})
		$('.noSlide').click(function(){
			$(this).toggleClass('activeIcon');
		})

		$('.double a').click(function(){
			 // $(this).toggleClass('activeIcon');
			 // $(this).addClass('activeIcon').parents('.double').siblings('.selects').removeClass('activeIcon');
			 // $(this).addClass('activeIcon').parents('.double').siblings('.selects').find('a').removeClass('activeIcon');
			 // $(this).parents('.double').siblings('.double').find('i').slideUp();
			 // $(this).siblings('a').find('i').slideUp();
			$(this).css('opacity','1').siblings('a').css('opacity','0.5');
			// $(this).addClass('activeIcon').siblings('a').removeClass('activeIcon');
		})

	})