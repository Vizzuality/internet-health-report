<?php
	global $eff_settings_page;

	$eff_user_email = get_option("effecto_user_email");
	$siteurl = admin_url( 'options-general.php?page='.$eff_settings_page);

	
	$redirect = false;

	$redirect_msg = "Authentication Failed. Redirecting page, Please wait ...";
	if(!isset($eff_user_email ) || empty($eff_user_email )){
		$redirect = true;
	}

	$sname=getThisPageShortName();
	if(!isset($sname ) || empty($sname )){
		$redirect = true;
		$redirect_msg = "Error : Plugin Missing from Database. <br>Redirecting page, Please wait ...";

	}

	if($redirect){
?>

<br><br>
<div><strong><?php echo $redirect_msg;?></strong></div>
<script type="text/javascript">window.location="<?php echo $siteurl;?>";</script

<?php
	}
	else{
		global $hostString;






$createPage = $siteurl.'&pluginType=defaultEdit&shortname='.$sname.'&postURL=';

$mye_plugin_visib = get_option('mye_plugin_visib');
$wp_login = "false";
if ($mye_plugin_visib!=null && isset($mye_plugin_visib)) {
	$mye_plugin_visib = json_decode($mye_plugin_visib, true);
	if(isset($mye_plugin_visib['isWpLogin']) && $mye_plugin_visib['isWpLogin']){$wp_login = "true";}
}


$frameUrl=$hostString."/auth?action=extAcess&from=wp&l=".get_option('siteurl')."&sname=".$sname."&call=prop&lang=".get_bloginfo("language")."&data=wplog_".$wp_login ;


?>

<div style="position:relative"><div id="load" style=""></div>
<iframe onload="jQuery('#load').hide()" id="mye_edit" src="<?php echo $frameUrl ?>" width="100%"  seamless="" scrolling="no" frameborder="0" allowtransparency="true" height="600px"></iframe>
<Script>
jQuery(".nav-load").click(function(){
jQuery('#load').show();
});
var eMeth=window.addEventListener ? 'addEventListener':'attachEvent';
var msgEv = eMeth == 'attachEvent' ? 'onmessage' : 'message';var detect = window[eMeth];
detect(msgEv,editMessage,false);
var defaultLink = "<?php echo $siteurl ?>";
var creatPage = "<?php echo $createPage ?>";
function setProp(wplog){
	wplog = wplog.split("_");
	jQuery.post(ajaxurl, {'action': 'mye_wp_prop','wplogin':wplog[1]}, function(response) { });
}
function editMessage(e){
 	var m = e.data;
 	if(e.origin=='<?php echo $hostString ?>'){
 		if(m.indexOf('wpprop')>-1){
 			m = m.split("#");
 			if(m.length>1){
 				setProp(m[1]);	
 			}
		}else if(m.indexOf('mye_edit')>-1){
			jQuery("#load").css("display","");
 			window.location=defaultLink;
		}
		else if(m.indexOf('create')>-1){
			window.location=creatPage+encodeURI(defaultLink);
		}	
		else if(m.indexOf('setHt')>-1){
			m = m.split("#");
			jQuery("#mye_edit").css("height",m[1]);
			jQuery("#mye_edit").attr("height",m[1]);
		}
	}
}
</script>
</div>
	
<?php 
} ?>

