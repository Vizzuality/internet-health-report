<?php 
	global $hostString, $eff_settings_page,$mye_ver; 
	$sname="";
	
	$eff_details = getMyEffectoPluginDetails("0");

	if($eff_details!=null){
		foreach($eff_details as $detail) {
			$sname=$detail -> shortname;
		}
	}

	$prev_link = getRandomLink();
	$eff_user_email = get_option("effecto_user_email");

	$frameLink =  $hostString.'/wp_login.jsp?l='.get_site_url().'&lang='.get_bloginfo("language");

	if(isset($eff_user_email) && !empty($eff_user_email)){

		$showPrev = "0";
		if(isset($prev_link)){
			$showPrev="1";
		}

		


		if($sname==null || !isset($sname)){
			$sname = createDefaultPlugin(false, $eff_user_email);
		}

		$frameLink = $hostString."/wp_admin.jsp?email=".$eff_user_email."&l=".get_site_url()."&s=".$sname."&lang=".get_bloginfo("language")."&showPreview=".$showPrev."&v=".$mye_ver;
		
	}

	

	$siteurl = admin_url( 'options-general.php?page='.$eff_settings_page);
	
	$baseUrl = $siteurl.'&postURL='.$_SERVER['REQUEST_URI'];

	$support_link = $hostString.'/support_mail?site='.urlencode(get_site_url()).'&sname='.$sname;
?><div id='load'></div>
<iframe id="mye_admin" onload="delLoad()" src="<?php echo $frameLink?>" width="100%" frameborder="0" scrolling="no" style="min-height:500px;width: 100%; border: 0px; overflow: hidden; clear: both; margin: 0px; background: transparent;"></iframe>
<style>#mye_report{position:fixed;top:52%;z-index:99999999999;transform:rotate(-90deg);-webkit-transform:rotate(-90deg);-moz-transform:rotate(-90deg);-o-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);right:0;height:0;width:75px}#mye_report a{padding-left: 10px;padding-right: 25px !important;display:block;background:rgba(195, 90, 79, 0.86);width:60px;padding:10px 16px 8px;color:#fff;font-family:Arial,sans-serif;font-size:17px;font-weight:700;text-decoration:none;letter-spacing:.06em}#mye_report a:hover{background:#06c}</style>
<div id="mye_report"><a id="mye_rpt_a" target="_blank" href="<?php echo $support_link;?>">Support</a></div>';
<script type="text/javascript">
var hostUrl = "<?php echo $hostString?>";
var baseUrl = "<?php echo $baseUrl?>";
var prev_link = "<?php echo $prev_link?>";
</script>
<script type="text/javascript">
	function delLoad(){
		jQuery("#load").css("display","none");
	}
	jQuery(".nav-load").click(function(){
		jQuery("#load").css("display","");
	});
	var eMeth=window.addEventListener ? 'addEventListener':'attachEvent';
	var msgEv = eMeth == 'attachEvent' ? 'onmessage' : 'message';var detect = window[eMeth];
	detect(msgEv,admin_com,false);
	function openTab(url) {
    var a = window.document.createElement("a");a.target = '_blank';a.href = url;var e = window.document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); a.dispatchEvent(e);};
    function saveSname(sn){
    	var data = {'action': 'mye_sname_store','s':sn};
    	jQuery.post(ajaxurl, data, function(response) {
		alert("success (refreshing page)");
		location.reload();	
    	});
    }
	function admin_com(e){
		 var m = e.data;
		 if(e.origin==hostUrl){
		 	var a = m.split("#~#");
		 	if(a[0]=="linkChange"){
		 		if(a[1]=="preview"){
		 			openTab(prev_link);
		 		}
		 		else if(a[1]=="emaild"){
		 			jQuery.post(ajaxurl, {'action': 'mye_wp_userid','userid':a[2]}, function(response) {if(response.trim()=="0"){alert("Failed to update email-id in your Database");} location.href = baseUrl; });
		 		}else{
		 			location.href = baseUrl + a[1];
		 		}
		 	}
		 	else if(a[0]=="height"){
		 		var ht = a[1];
		 		if(ht.indexOf('px')!=-1)ht+='px';
		 		jQuery("#mye_admin").attr("height", ht).css("height", ht);
		 	}
		 	else if(a[0]=="mye_log"){
		 		saveSname(a[1]);
		 	}
		 }
	}
</script>