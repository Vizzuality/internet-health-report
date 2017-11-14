var onload_eff_isHome = jQuery("#home").is(":checked");
jQuery("#eff_visib").click(function() {
	var eff_isPost = jQuery("#posts").is(":checked");
	var eff_isPage = jQuery("#pages").is(":checked");
	var eff_isHome = jQuery("#home").is(":checked");
	var eff_isCustom = jQuery("#custom").is(":checked");
	var eff_plist = jQuery("#plist").is(":checked");
	var eff_mob = jQuery("#mob").is(":checked");
	var eff_secure = jQuery("#secure_p").is(":checked");
	var lod_on=jQuery(".m_lod:checked").val();
	var eff_custom_list = {};
	if (eff_isCustom) {
		jQuery("input[class=eff_customPostList]:checked").each(function() {
			eff_custom_list[jQuery(this).attr('c-name')] = true;
		});
		jQuery("input[class=eff_customPostList]:not(:checked)").each(function() {
			eff_custom_list[jQuery(this).attr('c-name')] = false;
		});
	}
	//alert(JSON.stringify(eff_custom_list));
	
	eff_custom_list = JSON.stringify(eff_custom_list);
	
	var eff_msg_ele = jQuery("#eff_msg");
	// console.log(eff_isPost + ", " + eff_isPage);

	eff_msg_ele.show();
	
	eff_msg_ele.html("Saving......");
	var data = {'action': 'mye_update_view',
		'isPost': eff_isPost,
		'isPage': eff_isPage,
		'isHome': eff_isHome,
		'isCustom': eff_isCustom,
		'eff_custom_list': eff_custom_list,
		'mye_load_on':lod_on,
		'plist':eff_plist,
		'secure_p':eff_secure,
		'mob_b':eff_mob
	};
	var flag=false;
	var custFlag=jQuery("#custom").prop('checked');
	jQuery(".eff_customPostList").each(function(){
		var f=jQuery(this).prop('checked');
		if(f){
			flag=true;
			return;
		}
	});
	// since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
	if(!flag && custFlag){
		alert("Please select atleast one post type OR uncheck custom post");
		return;
	}
	jQuery.post(ajaxurl, data, function(response) {
		eff_msg_ele.html("Settings Saved");
		eff_msg_ele.fadeOut(5000);
		if (eff_isHome) {	if(!onload_eff_isHome){jQuery("#eff_shCode").show();}} else {jQuery("#eff_shCode").hide();}
		onload_eff_isHome=eff_isHome;
	});

});

jQuery("#custom").click(function() {
	if (jQuery(this).is(":checked")) {
		jQuery("#eff_customPostList").show();
	} else {
		jQuery("#eff_customPostList").hide();
	}
});