jQuery(document).ready(function($){
	var $container = $('#manson');
	// initialize
	$container.imagesLoaded( function() {
		$container.masonry({
		  columnWidth: '.item',
		  itemSelector: '.item'
		});
	});
	
	
	
	$("#search-button").click(function(){
			$(".serch-form-coantainer").animate({
            width: 'toggle'
        });
		$( ".top-bar .search-top" ).focus();
    });

	$('.sticky-post .sticky-wrapper').hover(function(){     
        $(this).find('.entry-header').fadeIn(500); 
    },     
    function(){    
        $(this).find('.entry-header').fadeOut(500);
    });
	

});