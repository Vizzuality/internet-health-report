<?php
global $eff_settings_page;
	$sname=$_GET['sname'];
	$siteurl = admin_url( 'options-general.php?page='.$eff_settings_page);

	if(!isset($sname ) || empty($sname )){
?><br><br>
<div><strong>Error : Plugin Missing from Database. <br>Redirecting page, Please wait ...</strong></div>
<script type="text/javascript">window.location="<?php echo $siteurl;?>";</script><?php

	}
	else{

global $hostString;




$createPage = $siteurl.'&pluginType=defaultEdit&shortname='.$sname.'&postURL=';
$frameUrl=$hostString."/auth?action=extAcess&from=wp&l=".get_option('siteurl')."&sname=".$sname."&call=edit";

?><div style="position:relative"><div id="load" style="display:none;"></div>
<iframe id="mye_edit" src="<?php echo $frameUrl ?>" width="100%"  seamless="" scrolling="no" frameborder="0" allowtransparency="true" height="600px"></iframe>
<Script>
var eMeth=window.addEventListener ? 'addEventListener':'attachEvent';
var msgEv = eMeth == 'attachEvent' ? 'onmessage' : 'message';var detect = window[eMeth];
detect(msgEv,editMessage,false);
var defaultLink = "<?php echo $siteurl ?>";
var creatPage = "<?php echo $createPage ?>";
function editMessage(e){
 	var m = e.data;
 	if(e.origin=='<?php echo $hostString ?>'){
		if(m.indexOf('mye_edit')>-1){
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
</div><?php
	}
?>