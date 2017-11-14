<?php
/*
Plugin Name: MyEffecto
Plugin URI: www.myeffecto.com/wordpress
Description: Getting customized and interactive feedback for your blog.
Version: 3.92
Author: MyEffecto
Author URI: http://www.myeffecto.com/about

*/

$mye_ver = "3.92";

require('DBFunctions.php');
require('PostConfiguration.php');

/* ------------------------------------------------------------- */
$hostString="//www.myeffecto.com";
$myeJSLoc="js";
$myeCDN ="//cdn-files.appspot.com";
$mye_script = "https://effecto.azureedge.net/jsc/mye-wp.js";
$mye_script_all = "https://effecto.azureedge.net/jsc/mye-wp-a.js";
$eff_ssl_host = "https://myeffecto.com";


{	
	$eff_secure = get_option("effecto_secure");

	if(is_ssl() || isset($eff_secure) && $eff_secure==="1"){
		$hostString = $eff_ssl_host;
	}	
	else{
		$hostString ="http:".$hostString;

	}
}
	
/* ------------------------------------------------------------- */


/* Add MyEffecto link to Setting Tab. */
add_action('admin_menu', 'myeffecto_admin_actions');
add_filter('the_content', 'echoEndUserPlugin');
add_action('wp_footer', 'echo_eff_plugin_homepage');

add_filter( 'plugin_action_links', 'ttt_wpmdr_add_action_plugin', 5, 10 );
function ttt_wpmdr_add_action_plugin( $actions, $plugin_file ) 
{
	static $plugin;
	if (!isset($plugin))
		$plugin = plugin_basename(__FILE__);
	if ($plugin == $plugin_file) {
		$settings = array('settings' => '<a href="'. admin_url( 'options-general.php?page=eff_conf_nav' ).'" >Settings</a>');
		$site_link = array('support' => '<a href="http://www.myeffecto.com/support_mail?site='.urlencode(get_site_url()).'" target="_blank">Support</a>');
		$actions = array_merge($settings, $actions);
		$actions = array_merge($site_link, $actions);
		
	}	
	return $actions;
}

add_action('admin_init', 'my_plugin_redirect');
function my_plugin_redirect() {
    if (get_option('my_plugin_do_activation_redirect', false)) {
        delete_option('my_plugin_do_activation_redirect');
         wp_redirect("options-general.php?page=eff_conf_nav");
         //wp_redirect() does not exit automatically and should almost always be followed by exit.
         exit;
    }
}


register_activation_hook(__FILE__, 'my_plugin_activate');
function my_plugin_activate() {
    add_option('my_plugin_do_activation_redirect', true);
}

$embedCode = null;


$eff_settings_page = "eff_conf_nav";
$widget_page="";



/* Show plugin on Menu bar */
function myeffecto_admin_actions() {
	global $eff_settings_page;
	add_options_page('MyEffecto', 'MyEffecto', 'manage_options', $eff_settings_page, 'myeffecto_admin', null, '59.5');
}

function effInitScripts($hook) {
	global $eff_settings_page;
	if (is_admin()) {
		if ($hook == "post.php" || $hook == "post-new.php" || $hook == "settings_page_".$eff_settings_page) {
			wp_enqueue_script("jquery");
		}
	}
}
add_action("admin_enqueue_scripts", "effInitScripts");

function myeffecto_get_version() {
	$plugin_data = get_plugin_data( __FILE__ );
	$plugin_version = $plugin_data['Version'];
	return $plugin_version;
}


function myeffecto_admin() {

	 $user_id = get_current_user_id();
	 $data = null;
	if (isset($_POST['dataToSend'])) {
		$data=$_POST['dataToSend'];
	}
        $eff_trending_url=null;
        if (isset($_POST['url'])) {  //for trending widget
            $eff_trending_url=$_POST['url'];
        }
        
	$eff_shortname = null;
	if (isset($_POST['eff_shortname'])) {
		$eff_shortname = $_POST['eff_shortname'];
	}

	$postID = null;
	if (isset($_GET['postID'])) {
		$postID = $_GET['postID'];
	}

	$postName = null;
	if (isset($_GET['postName'])) {
		$postName = $_GET['postName'];
	}

	$postURL = null;
	if (isset($_GET['postURL'])) {
		$postURL = $_GET['postURL'];
	}

	$shortname = null;
	if (isset($_GET['shortname'])) {
		$shortname = $_GET['shortname'];
	}

	if(isset($data) && !empty($data)) {
		
		$isCodeExistArray = getMyEffectoPluginDetails($postID);
		
		$isCodeExist=null;
		
		if (isset($isCodeExistArray) && !empty($isCodeExistArray)) {
			foreach($isCodeExistArray as $detail) {
				$isCodeExist = $detail -> shortname;
			}
		}

		if ($isCodeExist == null) {
			if (!isset($postID) || empty($postID)) {
		
					$defaultEdit = null;
					if (isset($_GET['pluginType'])) {
						$defaultEdit = $_GET['pluginType'];
					}
				    if (isset($defaultEdit) && $defaultEdit == "defaultEdit") {
						updateMyeffectoEmbedCode($data, 0, $eff_shortname);
					
					?><script type="text/javascript">
						window.location= <?php echo "'" . $postURL . "&action=edit&plugin=success'"; ?>;
					</script><?php

					} else {
					
						insertInMyEffectoDb($user_id, null, $data, null, $eff_shortname);
						if (isset($postURL) && !empty($postURL)) {
							?>
								<script type="text/javascript">
									window.location= <?php echo "'" . $postURL . "&action=edit&plugin=success'"; ?>;
							   </script>
							<?php
						} else {
							// After Plugin Config
							exit( wp_redirect( admin_url( 'options-general.php?page=eff_conf_nav')));
						}
					}
			} else {
				insertInMyEffectoDb($user_id, null, $data, $postID, $eff_shortname);
				?>
					<script type="text/javascript">
				  
						window.location= <?php echo "'" . $postURL . "&action=edit&plugin=success'"; ?>;
				   
				   </script>
				<?php
			}
		} else {
			$addType = $_GET['pluginType'];
			if ($addType == "postAdd") {
					updateMyeffectoEmbedCode(null, $postID, $eff_shortname);
					?>
					<script type="text/javascript">
						window.location= <?php echo "'" . $postURL . "&action=edit&plugin=success'"; ?>;</script>
				<?php
			}else {

                $isToInsert = $_GET['isToInsert'];
                if(isset($isToInsert) && $isToInsert=="true")    {
                    insertInMyEffectoDb($user_id, null, $data, $postID, $eff_shortname);    
                    ?>
                    <script type="text/javascript">window.location= <?php echo "'" . $postURL . "&action=edit&plugin=success'"; ?>;</script><?php return;
                }
            }

		}
	 }else if(isset($eff_trending_url) && !empty($eff_trending_url)) {
             update_option("trending_url", $eff_trending_url);
             ?>
            <script type="text/javascript">
                    window.location= <?php echo "'" . $postURL . "&action=edit&plugin=success'"; ?>;
            </script>
                 <?php
         }
         else {
         	$p_type = null;

			if (isset($_GET['pluginType'])){
				$p_type=$_GET['pluginType'];
			}

         	$configure_tab="nav-tab-active";
			$advSetting_tab="nav-load";
			$plugSetting_tab="nav-load";

			if($p_type=="advSetting"){
				$advSetting_tab="nav-tab-active";
				$configure_tab="nav-load";
				$plugSetting_tab="nav-load";
			}
			else if($p_type=="plugSet"){
				$advSetting_tab="nav-load";
				$configure_tab="nav-load";
				$plugSetting_tab="nav-tab-active";
			}
?>			
<style type="text/css">#load {background: url("<?php echo plugins_url('/img/loading.gif' , __FILE__ );?>") no-repeat scroll center center #FFF;bottom: 0;left: 0;position: absolute;opacity: 0.63;right: 0;top: 0;width: 100%;z-index: 1000;}</style>
	<div class="wrap" style="overflow-wrap : hidden; position : relative;">
		<h2 class="nav-tab-wrapper">
			<a class="nav-tab <?php echo $configure_tab; ?>" href="<?php echo admin_url( 'options-general.php?page=eff_conf_nav')?>">Configure</a> 
			<a class="nav-tab <?php echo $plugSetting_tab; ?>"  href="<?php echo admin_url( 'options-general.php?page=eff_conf_nav&pluginType=plugSet')?>">Plugin Settings</a> 
			<a class="nav-tab <?php echo $advSetting_tab; ?>"  href="<?php echo admin_url( 'options-general.php?page=eff_conf_nav&pluginType=advSetting')?>">Blog Settings</a> 	
		</h2>
		<?php
			global $embedCode;
			$apiKey=null;
			$myeffectoArray = array();

			delete_option('myeffecto_apikeys'.'#@#'.$user_id);
			if (get_option('myeffecto_apikeys'.'#@#'.$user_id)) {
				$myeffectoArray = get_option('myeffecto_apikeys'.'#@#'.$user_id);
			} else {
				$isFirstUser=false;
				global $wpdb;
				$effecto_db_version = myeffecto_get_version();
				$table_name = $wpdb->prefix . "effecto";
				$eff_get_dbVersion = get_option('effecto_db_version');
				if ($eff_get_dbVersion != $effecto_db_version) {
					createEffectoTable($effecto_db_version);
					update_option('effecto_db_version', $effecto_db_version);
				} else {
					$apiEmbedArrayDtls = getMyEffectoPluginDetails("0");
					$apiEmbedArray="";

					if($apiEmbedArrayDtls!=null){
						foreach($apiEmbedArrayDtls as $detail) {
							$apiEmbedArray = $detail -> embedCode;
						}
					}

					$embedCode=$apiEmbedArray;

					if (!isset($embedCode) || empty($embedCode)) {
						$isFirstUser=false;
					} else {
						$myeffectoArray['userID']=$user_id ;
						//$myeffectoArray['apiKey']=$apiEmbedArray->apiKey;
						$myeffectoArray['embedCode']=$apiEmbedArray;
						//update_option('myeffecto_apikeys'.'#@#'.$user_id, $apiEmbedArray);
					}
				}

				
				echo "<div class='container'>";
				
				

				
				if ($isFirstUser ||  $p_type=='defaultEdit' || $p_type=='postAdd' ) {
					echoUserScript();
					return;
				}
				else if($p_type=="editExist"){
					include 'editExisting.php';
					return;
				}
				else if($p_type=="plugSet"){
					include 'pluginSetting.php';
					return;
				}
				else if($p_type=="advSetting"){
					include "advanceSetting.php";
				}
				else{
					allSetCode($embedCode, null);
				}
				
				echo "<script>jQuery('.nav-tab').click(function(){jQuery('#load').css('display','block');});</script></div>";
			}

		
	?>
		</div>
	<?php
		}
	}


	function echoUserScript() {
		include 'configEmo.php';
	}
	
	function eff_is_html($string) {
	  return preg_match("/<[^<]+>/",$string,$m) != 0;
	}


	function getThisPageShortName(){


			$postId = get_the_ID();
			$apiPluginDetailsArray = getMyEffectoPluginDetails($postId);

			if ($apiPluginDetailsArray == null && empty($apiPluginDetailsArray)) {
				$apiPluginDetailsArray = getMyEffectoPluginDetails("0");
			}
			$p_shortname="";

			if($apiPluginDetailsArray!=null){
				foreach($apiPluginDetailsArray as $detail) {
					$p_shortname = $detail -> shortname;
				}	
			}
			
			$p_shortname=trim($p_shortname);

		return $p_shortname;
	}

	function removeSpclChar($str){
		
		if(isset($str)){
			$str = 	str_replace("'",'\"', $str);
			$str = 	str_replace("\\",'', $str);
			$str = 	str_replace('"','', $str);
			$str = 	str_replace(',','&cedil;', $str);
			$str = 	strip_tags($str);
		}

		return $str;
	}


	function getPostUrl(){

		$postUrl = '';

		if(isset($postId)){

			$postUrl = get_permalink($postId);
			$postUrl = 	str_replace("&",'&amp;', $postUrl);
			$postUrl = 	str_replace("'",'&apos;', $postUrl);
			$postUrl = 	str_replace('"','&quot;', $postUrl);

		}
		
		return $postUrl;
	}


	function getEffectoDataJSON($atts,$wp_loginEnable,$mob){
		global $current_user;
		
		if(isset($mob)){
			if($mob){
				$mob='1';
			}
			else{
				$mob='0';	
			}
		}
		else{
			$mob='1';
		}

		$getPostTitle = get_the_title();
		if(isset($atts) && $atts['id']!='0'){
			$postId = $atts['id'];
		}else{
			$postId = get_the_ID();	
		}

		$wpSite = get_site_url();
		
		$effectoPreview = "false";
		$effectoAuthor = effecto_get_author();
		$eff_category = effecto_get_category($postId);
		$eff_tags = "";
		if(function_exists('effecto_get_tags')){
			$eff_tags=effecto_get_tags($postId);
		}
		
		$p_shortname=getThisPageShortName();

		$effDate_published = get_the_date("l,F d,Y");
		if (is_preview()) {
			$effectoPreview = "true";
			$postId = 0;
		}

		$getPostTitle = removeSpclChar($getPostTitle);
		$eff_category = removeSpclChar($eff_category);
		$eff_tags = removeSpclChar($eff_tags);

		/*$verFloat = floatval(get_bloginfo("version"));
		if($verFloat > 3.4){
			
		}
		else{
			get_currentuserinfo();
		}*/
		$current_user = wp_get_current_user();
		
		$eff_cur_loggedIn = is_user_logged_in();
		$eff_user_role = $current_user->user_login;
		$eff_user_email = $current_user->user_email;
		$eff_user_display = str_replace("'",'\"', $current_user->display_name);
		$eff_user_fname = str_replace("'",'\"', $current_user->user_firstname);
		$eff_user_lname = str_replace("'",'\"', $current_user->user_lastname);	
		$thumb_img = "";
		if ( function_exists('has_post_thumbnail') && has_post_thumbnail(get_the_ID()) ) {
			$timg = wp_get_attachment_image_src( get_post_thumbnail_id(get_the_ID()));
			$thumb_img = $timg[0];
		}
		$postUrl = getPostUrl();	


		$myeJson = '{';
		$myeJson .= '"effectoCategory":"a"';
		$myeJson .= ',"mob":"'.$mob.'"';
		$myeJson .= ',"t_img":"'.$thumb_img.'"';
		$myeJson .= ',"effecto_uniquename":"'.$p_shortname.'"';
		$myeJson .= ',"effectoPostId":"'.$postId.'"';
		$myeJson .= ',"effectoPreview":"'.$effectoPreview.'"';
		$myeJson .= ',"effectoPagetitle":"'.$getPostTitle.'"';
		$myeJson .= ',"effectoPublDate":"'.$effDate_published.'"';
		$myeJson .= ',"effectoTag":"'.$eff_tags.'"';
		$myeJson .= ',"purl":"'.$postUrl.'"';
		
		if($wp_loginEnable){
		$myeJson .= ',"effectoAuthorName":"'.$effectoAuthor.'","effUserInfo": {"isLoggedIn": "'.$eff_cur_loggedIn.'","loginAs": "'.$eff_user_role.'","email": "'.$eff_user_email.'","dpName": "'.$eff_user_display.'","fName": "'.$eff_user_fname.'","lName": "'.$eff_user_lname.'"}';
		}

		$myeJson .= '}';
		return $myeJson;
	}


	/* Show plugin in posts. */
	function echoEndUserPlugin($text) {
		global $hostString;
		global $eff_ssl_host;
		global $myeCDN;
		global $myeJSLoc;
		global $mye_ver;

		$mye_plugin_visib = get_option('mye_plugin_visib');
		$eff_pList = false;

		$eff_isOnPost = true;
		$eff_isOnPage = false;
		
		$eff_isOnCustom = false;
		$eff_wp_login = false;
		$eff_isPreview = is_preview();
		$eff_loadtype = "";
		$eff_height = "";
		$eff_mob = true;

		//echo "<script>alert('mye_plugin_visib)=".($mye_plugin_visib!="")."');</script>";
		if($mye_plugin_visib==""){
			$eff_isOnCustom = true;
			//echo "<script>alert('CustTYpe=".($cust_ptype!="")."');</script>";
		}
		
		if ($mye_plugin_visib!=null && isset($mye_plugin_visib)) {
			$mye_plugin_visib = json_decode($mye_plugin_visib, true);
			if($mye_plugin_visib['isOnPost']){$eff_isOnPost = true;}else{$eff_isOnPost = false;}
			if($mye_plugin_visib['isOnPage']){$eff_isOnPage = true;}
			if($mye_plugin_visib['isOnCustom']){$eff_isOnCustom = true;}
			if($mye_plugin_visib['plist']){$eff_pList = true;}
			if(array_key_exists( 'mob', $mye_plugin_visib)){if($mye_plugin_visib['mob']){$eff_mob = true;}else{$eff_mob = false;} }	
			if(isset($mye_plugin_visib['isWpLogin']) && $mye_plugin_visib['isWpLogin']){$eff_wp_login = true;}
			if($mye_plugin_visib['mye_load_on']){$eff_loadtype=$mye_plugin_visib['mye_load_on'];}
		}

		$cur_post_typ = get_post_type(get_the_ID());
		$effisPageOrPost = $cur_post_typ=="post" || $cur_post_typ=="page"; 
		$eff_html="";
		
		/* For home page or multiple post page */
		if($eff_pList && !is_single() && !is_page()){
			global $mye_ver;
			$myeJson=getEffectoDataJSON(null,$eff_wp_login,$eff_mob);
			$eff_html=$eff_html."<div class='effecto_bar' style='text-align:center;".$eff_height."' data-json='".$myeJson."'></div>";	

			return $text.$eff_html;

		}
	

		/* For post page */
		if (is_single() || is_page()) 
		{	
			$eff_html="<div id='mye_param' data-json=\"{'type':'". $cur_post_typ."','v':'".$mye_ver."'}\" style='display:none;'></div>";
			
			if ($effisPageOrPost) {
				if ($cur_post_typ=="post" && $eff_isOnPost) {
					$effisPageOrPost = true;
				} else if ($cur_post_typ=="page" && $eff_isOnPage) {
					$effisPageOrPost = true;
				} else {
					$effisPageOrPost = false;
				}
			} else {

				if ($eff_isOnCustom) {
					$cust_ptype=json_decode($mye_plugin_visib['isOnCustomList'], true);
					//echo "<script>alert('CustTYpe=".($cust_ptype=="")."');</script>";
					

					if($cust_ptype!=""){
						
						if (array_key_exists($cur_post_typ, $cust_ptype)) {
							if($cust_ptype[$cur_post_typ]){
								$effisPageOrPost = true;	
							}
							else{
								$effisPageOrPost = false;
							}
						} else {
								$effisPageOrPost = false;
						}
				   }else{
				   		$effisPageOrPost = true;
				   }//my ends here if here
				} else {
					$effisPageOrPost = false;
				}
			}

			
			if($effisPageOrPost) {
				//User Info
				global $myeCDN;
				global $myeJSLoc;
				
			$p_shortname=getThisPageShortName();
			if(isset($p_shortname) && !empty($p_shortname)){
					$myeJson=getEffectoDataJSON(null,$eff_wp_login,$eff_mob);
					$eff_html=$eff_html."<div id='effecto_bar' style='text-align:center;".$eff_height."' data-json='".$myeJson."'></div>";
					$eff_html=$eff_html.getMyeScript($eff_loadtype,null,"effecto-code");
				}
				else{
					$eff_html=$eff_html."<div id='effecto_bar' sn></div>";
				}
				return $text.$eff_html;
			}
			else{
				return $text.$eff_html."<div id='effecto_bar' disabled></div>";
			}
		} else {
			return $text.$eff_html;
		}
	}
	
	function getMyeScript($eff_loadtype,$cust,$scrId){
		global $myeCDN,$myeJSLoc;
		$eff_json="";
		if(isset($cust) && !empty($cust)){
			$pageSpeed_script=$cust;
		}
		else{
			global $mye_script;
			$pageSpeed_script=$mye_script;
		}
		
		if($eff_loadtype=="dom"){
			$eff_json=$eff_json.'<script type="text/javascript">(function(){
					var eMeth = window.addEventListener ? "addEventListener" : "attachEvent";
					var loadEv = eMeth == "attachEvent" ? "onload" : "DOMContentLoaded";
					window[eMeth](loadEv,function(){ var s=document.createElement("script");s.async = "true";
					s.type = "text/javascript";';
			$eff_json=$eff_json."s.src='".$pageSpeed_script."'; s.onerror='this.src=\"".$myeCDN."/".$myeJSLoc."/mye-wp.js\"';";
			$eff_json=$eff_json.'var a=document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0];
				a.appendChild(s);
				},false);
			})()</script>';
		}else if($eff_loadtype=="async"){
			$eff_json=$eff_json."<script type='text/javascript'>window.onload=function(){var s=document.createElement('script');
			s.type='text/javascript';s.src ='".$pageSpeed_script."';";
			$eff_json=$eff_json."s.onerror='this.src=\"".$myeCDN."/".$myeJSLoc."/mye-wp.js\"';";
			$eff_json=$eff_json.'var a=document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0];a.appendChild(s);
			}</script>';
		}
		else{
			$eff_json=$eff_json."<script id='".$scrId."' src='".$pageSpeed_script."' type='text/javascript' async='true'></script>";
		}

		return $eff_json;
	}

	function echo_eff_plugin_homepage() {
		$mye_plugin_visib = get_option('mye_plugin_visib');
		$isOnHome = false;
		if (isset($mye_plugin_visib) && $mye_plugin_visib) {
			$mye_plugin_visib = json_decode($mye_plugin_visib, true);
			if($mye_plugin_visib['isOnHome']){$isOnHome = true;}
		}

		if ($isOnHome && is_front_page()) {
			$apiPluginDetailsArray = getMyEffectoPluginDetails("0");
			$p_shortname="";
			if($apiPluginDetailsArray!=null){
				foreach($apiPluginDetailsArray as $detail) {
					$p_shortname = $detail -> shortname;
				}
			}
			
			echo do_shortcode( '[effecto-bar id="home"]' );
		}

		$mye_plugin_visib = get_option('mye_plugin_visib');
		$eff_pList = false;

		if ($mye_plugin_visib!=null && isset($mye_plugin_visib)) {
			$mye_plugin_visib = json_decode($mye_plugin_visib, true);
			if($mye_plugin_visib['plist']){$eff_pList = true;}
		}

		// Footer Page Script
		if($eff_pList && !is_single() && !is_page()){
			global $mye_script_all;
			echo getMyeScript(null, $mye_script_all,"effecto-code-1");
		}

	}

	function getEffectoCustomTag($atts){
		$atts = shortcode_atts(array('id' => '0'), $atts, 'effecto-bar' );
		$fetchScript=false;
		$div_identify="id='effecto_cust_bar'";
		$atts['id']=trim($atts['id']);
		if($atts['id']!='0'){
			$fetchScript=true;
			$div_identify="id='effecto_bar'";
		}

		
		$mye_plugin_visib = get_option('mye_plugin_visib');
		$eff_isOnPost=true;
		$eff_isOnCustom=false;
		$eff_isOnPage=false;
		$eff_loadtype="";
		$eff_wp_login = false;
		$eff_mob = true;

		if ($mye_plugin_visib!=null && isset($mye_plugin_visib)) {
			$mye_plugin_visib = json_decode($mye_plugin_visib, true);
			if($mye_plugin_visib['isOnPost']){$eff_isOnPost = true;}else{$eff_isOnPost = false;}
			if($mye_plugin_visib['isOnPage']){$eff_isOnPage = true;}
			if($mye_plugin_visib['isOnCustom']){$eff_isOnCustom = true;}
			if(array_key_exists( 'mob', $mye_plugin_visib)){if($mye_plugin_visib['mob']){$eff_mob = true;}else{$eff_mob = false;} }	
			if($mye_plugin_visib['mye_load_on']){$eff_loadtype=$mye_plugin_visib['mye_load_on'];}
			if(isset($mye_plugin_visib['isWpLogin']) && $mye_plugin_visib['isWpLogin']){$eff_wp_login = true;}
		}

		$data_val=getEffectoDataJSON($atts,$eff_wp_login,$eff_mob);

		$p_html="<div ".$div_identify." data-json='".$data_val."' style='text-align:center;' att='".$atts['id']."' ></div>";
		if($fetchScript || !$eff_isOnPage || !$eff_isOnPost || ($eff_isOnPost==false && $eff_isOnCustom==false)){
			$p_html=$p_html.getMyeScript($eff_loadtype,null,"effecto-code");
		}
		return $p_html;
	}
	 function getEffectoTrendTag(){
		//$data_val=getEffectoDataJSON();
                $trendyFrame="";
         
                $trendy=get_option("trending_url");
				if(isset($trendy) && !empty($trendy)){
					$trendyFrame="<iframe id='effWidget' src='".$trendy."' style='width:100%;height:300px;border:none;overflow: hidden;' scrolling='no'></iframe>";
                }
		return $trendyFrame;
	 } 
	
	function getEmoWiseVoted($atts){
		global $hostString;
		
		$site=get_site_url();
		if(isset($site)){
			$site=parse_url($site);
			if(array_key_exists('host',$site)){
				$site=$site['host'];
			}
			else{
				$site='';
			}
		}
		

		$dbPluginDtls = getMyEffectoPluginDetails("0");
		$p_shortname="";
		if(isset($dbPluginDtls) && !empty($dbPluginDtls)){
			foreach($dbPluginDtls as $detail) {
				$p_shortname = $detail -> shortname;
			}
			$p_shortname=trim($p_shortname);
		}
		else{
			$p_shortname='0';
		}

		$atts = shortcode_atts(array('emo' => '','height'=>'','width'=>''), $atts, 'effecto-bar' );
		$html = "<div id='effecto_emo_widget' site='".$site."' sname='".$p_shortname."' emo='".$atts['emo']."' ht='".$atts['height']."' wt='".$atts['width']."'></div><script src='//cdneffecto.blob.core.windows.net/jsc/emo_widget.min.js' type='text/javascript' async></script>";

		return $html;
	}

	function register_effectoTag(){
	   add_shortcode('effecto-bar', 'getEffectoCustomTag');
	   add_shortcode('effecto-emo-bar', 'getEmoWiseVoted');
	  // add_shortcode('effecto-trend', 'getEffectoTrendTag');
	}
	add_action( 'init', 'register_effectoTag');


	/* Simple string replace function */
	function replaceText ($text) {
		$text = str_replace('\"','', $text);
		return $text;
	}

	function addAlert($pluginStatus) {
		if (isset($pluginStatus) && !empty($pluginStatus)) {
?><script type="text/javascript">
				$j = jQuery;
				$j().ready(function() {
					$j('.wrap > h2').parent().prev().after('<div class="update-nag"><h3>Congrats! You have successfully configured New Emotion-Set for this post.</h3></div>');
				});
			</script><?php
		
		}
	}

	function eff_pluginUninstall() {
        global $wpdb;
        $table = $wpdb->prefix."effecto";
		delete_option("effecto_db_version");
		delete_option('mye_plugin_visib');
		delete_option('mye_load_on');
		$wpdb->query("DROP TABLE IF EXISTS $table");
	}
	register_uninstall_hook( __FILE__, 'eff_pluginUninstall' );



?>