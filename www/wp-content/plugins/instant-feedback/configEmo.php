<?php
global $hostString;
global $eff_settings_page;
global $mye_ver;
$shortname = null;
if (isset($_GET['shortname'])) {
	$shortname = $_GET['shortname'];
}
$globalPostID = null;
if (isset($_GET['postID'])) {
	$globalPostID = $_GET['postID'];
}
$postname = null;
if (isset($_GET['postName'])) {
	$postname = $_GET['postName'];
}
echo '<script type="text/javascript">
var mye_host="'.$hostString.'";var mye_ver="'.$mye_ver.'";
var shortname = "'.$shortname.'";
var effecto_identifier = "'.$globalPostID.'";
var postTitle="'.$postname.'";
var siteUrl="'.get_option('siteurl').'";
var admin_email="'.get_option('effecto_user_email').'";
var blogName="'.get_option('blogname').'";
var setting_page="'.$eff_settings_page.'";
</script>';
?>
<style>
#mye_cancel{font-size: 16px; line-height: 28px; padding: 5px 18px 33px; margin-right: 15px;}
.generate{font-size: 16px !important; line-height: 28px !important; padding: 5px 18px 33px !important; margin-right: 15px !important;}
@media (max-width :780px) {
#mye_cancel{padding-bottom: 8px !important;}	
}
</style>
<form id="submitForm" action="" method="post" style="display:none;">
	<input name="isToInsert" value="true" id="isToInsert" type="hidden"/>
	<input name="dataToSend" id="dataToSend" type="hidden"/>
	<input name="eff_shortname" id="eff_shortname" type="hidden"/>
	<input type='submit'/>
</form>
<form id="submitWidgetForm" action="" method="post" style="display:none;"><input name="url" value="" id="url" type="hidden"/></form>
<form id="reloadForm" action="" method="post" style="display:none;"><input type='submit'/></form>
	
<script type="text/javascript" src="<?php echo plugins_url( '/js/config.js' , __FILE__ );?>"></script>
<div id="load" style="display:none;"></div>
<iframe id="effectoFrame" width="100%" height="500"  seamless scrolling="no" frameborder="0" allowtransparency="true"/>