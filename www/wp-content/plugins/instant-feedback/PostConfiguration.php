<?php

	add_action( 'add_meta_boxes', 'effectoBox' );  

	function effectoBox() {
		if (isset($mye_plugin_visib) && $mye_plugin_visib) {
			$mye_plugin_visib = json_decode($mye_plugin_visib, true);

			if($mye_plugin_visib['isOnPost']){
				add_meta_box('effecto_meta_box', 'MyEffecto Configuration', 'showEffectoBox', 'post', 'normal', 'core' );
			} else {
				$isOnPost="";
				return;
			}
			if($mye_plugin_visib['isOnPage']){
				add_meta_box( 'effecto_meta_box', 'MyEffecto Configuration', 'showEffectoBox', 'page', 'normal', 'core' ); 
			}
		} else {
			add_meta_box( 'effecto_meta_box', 'MyEffecto Configuration', 'showEffectoBox', 'post', 'normal', 'core' );
		}
	}
	

	$p_shortname = null;
	function showEffectoBox() {
		global $hostString, $eff_settings_page;

		$siteurl = admin_url( 'options-general.php?page='.$eff_settings_page);

		echo "<script>
				jQuery(function($){
					$('#effecto_meta_box').addClass('closed');
				});
			</script>";

		$pluginStatus = "";

		if(isset( $_GET["plugin"])){
			$pluginStatus = $_GET["plugin"];
		}

		if ($pluginStatus == 'success') {
			addAlert($pluginStatus);
		}

		$getPostID = get_the_ID();
		if (!isset($getPostID) || empty($getPostID)) {
			$getPostID = $_GET['post_id'];
		}

		$getPostTitle = get_the_title();
		$wpSite = get_site_url();
		$effDate_published = get_the_date("l,F d,Y");
		//$getPostTitle = substr($getPostTitle, 0, 10);

		$postUrl=$_SERVER['REQUEST_URI'];
		$postUrl = str_replace('post-new.php','post.php', $postUrl);
		$p_shortname =null;
		$eff_details = getMyEffectoPluginDetails($getPostID);
		
		if($eff_details!=null){
			foreach($eff_details as $detail) {
				$p_shortname = $detail -> shortname;
			}
		}
		

		/* Check if there is plugin for current post. */
		if (!isset($p_shortname) || empty($p_shortname)) {
			/* If not found, check for AllPost code. */
			//$allPostCode = getMyeffectoEmbedCodeByPostID(0);
			$p_shortname =null;
			$eff_details = getMyEffectoPluginDetails("0");
			
			if($eff_details!=null){
				foreach($eff_details as $detail) {
					$p_shortname = $detail -> shortname;
				}
			}

			
			if (isset($p_shortname) && !empty($p_shortname)) {
				echo '<h3><center>This Post Show Default Emotion-set (Check on Post Preview)</center> </h3>
					<div >Note : In post-preview most of the plugin functionality are disabled  <br>(click limit, share, recommendation)</div><br>';
			
			} else {
				echo '<h2>
						<center>
							Please configure Myeffecto to view emotion-set below your post
						</center>
					</h2>
					<a class="button" href="'.$siteurl.'&postName='.$wpSite.'&pluginType=defaultAdd&postURL='.$_SERVER['REQUEST_URI'].'?post_id='.$getPostID.'">Add a default emotion set </a><br><br>
					';
			}
		
		} else {	
			echo '<h2><center>Emotion-Set Configured only for this post</center></h2>';
		
		}
		echo '<a class="effectoConfig button" href="'.$siteurl.'&postID='.$getPostID.'&postName='.$wpSite.'&shortname='.$p_shortname.'&pluginType=postAdd&postURL='.urlencode($postUrl).'?post='.$getPostID.'">Confiure New Plugin For this Post</a>';
			/*echo '<a id="mye_disable"class="button">Disable myeffecto for this post</a> <span style="line-height: 28px;padding: 0px 8px;">or</span>
				<a class="effectoConfig button" href="'.get_site_url().'/wp-admin/admin.php?page='.$eff_settings_page.'&postID='.$getPostID.'&postName='.$wpSite.'&shortname='.$p_shortname.'&pluginType=postAdd&postURL='.urlencode($postUrl).'?post='.$getPostID.'">Confiure New Plugin For this Post</a>
				';*/
		/*	echo "<script>
				jQuery('#mye_disable').click(function(){
					alert('clicked');
					var data = {'action': 'mye_post_disable','post_id':'".$getPostID."'};
					jQuery.post(ajaxurl, data);
				});
				</script>";*/
		
	}

	/*function mye_post_disable_action() {
		error_log("Post Disabled yo");
		$postId = $_POST['post_id'];
		if(isset($postId)){
			$eff_details = getMyEffectoPluginDetails($postId);
			foreach($eff_details as $detail) {
				$post_shortname = $detail -> shortname;
			}
			if(isset($post_shortname) && !empty($post_shortname)){
				error_log("update shortname id : "+$postID);
				updateMyeffectoEmbedCode(null, $postID, "no");
			}
			else{
				error_log("insert shortname");
				insertInMyEffectoDb("1", null, null, $postID, "no");
			}
		}
		wp_die(); 
	}
	add_action( 'wp_ajax_mye_post_disable', 'mye_post_disable_action' );
*/
	function effecto_get_category($postId) {
		$categories = get_the_category($postId);
		$eff_category = "";
		if($categories){
			foreach($categories as $category) {
				$eff_category .= $category->name . ",";
			}
		}
		
		return $eff_category;
	}
	
	function effecto_get_tags($postId) {
		$effectoposttags = wp_get_post_tags($postId);
		$eff_tags = "";
		if($effectoposttags){
			foreach($effectoposttags as $effposttag) {
				$eff_tags .= $effposttag->name . ",";
			}
		}
		
		return $eff_tags;
	}
	
	function effecto_get_author() {
		$user_id = get_current_user_id();
		return get_the_author_meta('user_email', $user_id );
	}

	function showEffModal() {
		echo '<div id="effecto-confirm" title="Change emotion Set?" style="display : none;">
				<p><span class="" style="float: left; margin: 0 7px 20px 0;">Changing your set will erase your current emotion set data. <br/><br/> Do you want to continue?</span></p>
			</div>

			<script type="text/javascript">
				window.onload=function() {
					jQuery(".effectoConfig").click(function(e) {
						e.preventDefault();
						var targetUrl = jQuery(this).attr("effectohref");
						jQuery( "#effecto-confirm" ).dialog({
							resizable: false,
							height:220,
							modal: false,
							buttons: {
								Ok: function() {
								   window.location.href = targetUrl;
								  //return true;
								},
								Cancel: function() {
								  jQuery( this ).dialog( "close" );
								}
							}
						});
						return false;
					});
				};
			</script>';
	}

	function updateEff_title() {
		global $hostString;
		$eff_id = get_the_ID();
		$wpress_post = get_post($eff_id);
		$wpress_title = $wpress_post->post_title;
		/* $shortname = getShortnameByPostID($eff_id);
		if (!isset($shortname)) {
			$shortname = getShortnameByPostID(0);
		} */
		if (isset($eff_id) && !empty($eff_id)) {
			$args = array(
				'body' => array('action' => 'updateContentTitle', 'title' => $wpress_title, 'post_id' => $eff_id),
			);
			wp_remote_post($hostString.'/contentdetails', $args);
		}
	}

	function createDefaultPlugin($check,$email){
		$p_shortname="";
		if($check){
			$apiPluginDetailsArray = getMyEffectoPluginDetails("0");
			if($apiPluginDetailsArray!=null){
				foreach($apiPluginDetailsArray as $detail) {
					$p_shortname = $detail -> shortname;
				}
			}
			
		}
		

		if($p_shortname==null || !isset($p_shortname) || !$check){

			global $hostString;
			$args = array(
				'timeout' => 120,
				'body' => array('action' => 'defaultContent', 'email' => $email, 'site' => get_site_url()),
			);
			$resp = wp_remote_post($hostString.'/contentdetails', $args);
			if ( is_wp_error( $resp ) ) {
				//echo print_r($resp);
			}
			else{
				$eff_shortname= $resp["body"];
				if(isset($eff_shortname) && !empty($eff_shortname)){
					$eff_shortname=trim($eff_shortname);
					insertInMyEffectoDb('1', null, "<div>", null, $eff_shortname);		
				}		
				return $eff_shortname;
			}

			return null;
		}
	}

	function getRandomLink(){
		$post_enabled = true;
		$page_enabled = true;
		$mye_plugin_visib = get_option('mye_plugin_visib');
		if (isset($mye_plugin_visib) && !empty($mye_plugin_visib)){
			$mye_plugin_visib = json_decode($mye_plugin_visib, true);
			if(array_key_exists('isOnPost',$mye_plugin_visib)){
				$post_enabled = $mye_plugin_visib['isOnPost']=='true' ? true : false;
			}
			if(array_key_exists('isOnPage',$mye_plugin_visib)){
				$page_enabled = $mye_plugin_visib['isOnPage']=='true' ? true : false;
			}
		}

		if($post_enabled || $page_enabled){
			if($post_enabled){
				$args=array('post_type'=>'post','post_status'=>'publish','posts_per_page'=>1,'orderby' => 'rand');		
				$my_posts = get_posts($args);
			}
			
			if($page_enabled){
				if(empty($my_posts)){
					$args=array('post_type'=>'page','post_status'=>'publish','posts_per_page'=>1,'orderby' => 'rand');	
					$my_posts = get_pages( $args );
				}
			}

			foreach ( $my_posts as $post ){
				return $post->guid;
			}
		}
	}

	function allSetCode($allPostCode, $getPostTitle) {	
		include 'effecto_admin.php';
	}

	add_action( 'wp_ajax_mye_load_plugs', 'mye_load_plugs' );
	function mye_load_plugs() {
		$default_sname = $_POST['snam'];
		global $hostString;
		$args = array('timeout' => 60,'body' => array('action' => 'load_set','sname'=>$default_sname,'host'=>get_site_url()));
		$resp = wp_remote_post($hostString.'/contentdetails', $args);
		if(!is_wp_error($resp)){ echo $resp["body"]; }
		wp_die();
	}

/*	function predfined_emo($src){
	
		echo '<style>#set_save{display: none;padding-left:2px;margin-left:2px;border-left:1px solid #DEDBDB} .preSetBtn{margin:auto 5px !important;font-weight:500  !important;font-size:18px  !important;} #b_plug > div{display:inline-flex;} #b_plug{padding-top:15px;padding-left:12px;-webkit-box-shadow: 0 1px 1px 0 rgba(0,0,0,.1);
    	box-shadow: 0 1px 1px 0 rgba(0,0,0,.1);width:100%;height:56px;background-color:#fff;margin-top: 15px;}</style>';
		echo '<div id="b_plug" style="display:none;"><div style="font-weight:500;font-size:16px;">Try Another Emo-Set :</div><div>';
		echo '<a id="mye_rand" class="mye_btn button-primary preSetBtn" >Random</a>';
		echo '<span id="set_save"><a id="sav_set" class="mye_btn button-primary preSetBtn" >Save</a>';
		echo '<a id="cncl_set" class="mye_btn button preSetBtn">Cancel</a></span>';
		echo '</div></div>';
			echo "<script>
			var sr,sr_len=0,df_sname,ifrm_link;
			function loadsn(){
				ifrm_link='".$src."',ind=ifrm_link.indexOf('&s=');
				if(ind>-1){
					df_sname=ifrm_link.substring((ind+3),ifrm_link.length);
					ifrm_link=ifrm_link.substring(0,(ind+3));
				}
			}
			loadsn();
			jQuery.post(ajaxurl, {'action': 'mye_load_plugs','snam':df_sname}, function(res){
				if(res && res!=''){
					jQuery('#b_plug').css('display','block');
					res=JSON.parse(res);
					sr=res.rand;
					sr.push(df_sname);
					sr_len = sr.length;
				}
			});
			var cur_i=0,cur_sel;
			function chgIfrmLink(s){
				if(s==df_sname){
						jQuery('#set_save').hide();
					}else{
						jQuery('#set_save').show();
					}
				jQuery('#mye_prev_frame').attr('src',ifrm_link+s);	
				jQuery('#load').show();
			}
			jQuery('#cncl_set').click(function(){chgIfrmLink(df_sname); cur_i=0;});
			jQuery('#sav_set').click(function(){
				var c=confirm('You are about to replace previous emo-set, Are you sure?');
				if(c){
					if(cur_sel){
						jQuery.post(ajaxurl, {'action': 'mye_save_sname','sname':cur_sel}, function(res){
							jQuery('#set_save').hide();
							alert('Done');
						});
					}
					else{
						alert('Please click on random buttom');
					}
				}
				else{
					jQuery('#cncl_set').click();
				}
			});

			jQuery('#mye_rand').click(function(){
				if(sr_len>0){
					cur_sel=sr[cur_i];
					chgIfrmLink(sr[cur_i]);
					if(cur_i< (sr_len-1)){
						cur_i++;
					}
					else{
						cur_i=0;
					}
				}
			});
		</script>";
	}*/

	add_action( 'wp_ajax_mye_sname_store', 'mye_sname_store' );
	function mye_sname_store() {
		$eff_shortname = $_POST['s'];
		if(isset($eff_shortname) && !empty($eff_shortname) && $eff_shortname!="null"){
			$eff_shortname=trim($eff_shortname);
			updateMyeffectoEmbedCode('', 0, $eff_shortname);	
		}
		wp_die(); // this is required to terminate immediately and return a proper response
	}


	add_action( 'wp_ajax_mye_wp_userid', 'mye_wp_userid_callback' );
	function mye_wp_userid_callback() {
		$eff_user_email = $_POST['userid'];
		if(isset($eff_user_email)){
			update_option("effecto_user_email",$eff_user_email);
			echo "1";
		}
		else{
			echo "0";
		}
		


		wp_die();
	}

	add_action( 'wp_ajax_mye_wp_prop', 'mye_wp_prop_callback' );
	function mye_wp_prop_callback() {
		$eff_wplogin = $_POST['wplogin'];

		if(isset($eff_wplogin )){
			$mye_plugin_visib = get_option('mye_plugin_visib');
			
			if ($mye_plugin_visib!=null && isset($mye_plugin_visib)) {

					$mye_plugin_visib = json_decode($mye_plugin_visib, true);
			}
			else{

				$mye_plugin_visib["isOnPost"] = true;
			}

			$mye_plugin_visib["isWpLogin"] =  (strcmp($eff_wplogin, "true") == 0);

			update_option('mye_plugin_visib', json_encode($mye_plugin_visib,true));
			
		}
		
		wp_die();
	}

	// add_action( 'save_post', 'updateEff_title' );	
	add_action( 'wp_ajax_mye_update_view', 'mye_visibUpdt_callback' );
	function mye_visibUpdt_callback() {
		$eff_isOnPost = $_POST['isPost'];
		$eff_isOnPage = $_POST['isPage'];
		$eff_isOnHome = $_POST['isHome'];
		$eff_isCustom = $_POST['isCustom'];
		$eff_mob = $_POST['mob_b'];
		$eff_secure = $_POST['secure_p'];
		$eff_plist = $_POST['plist'];
		$eff_custom_list = $_POST['eff_custom_list'];
		$mye_load_on=$_POST['mye_load_on'];
		
		$escapers = array("\\");
		$replacements = array("");
		$eff_custom_list = str_replace($escapers, $replacements, $eff_custom_list);

		$data_json = get_option('mye_plugin_visib');


		if ($data_json!=null && isset($data_json)) {
			$data_json = json_decode($data_json, true);
		}


		$data_json["mye_load_on"] = $mye_load_on;

		if(strcmp($eff_secure, "true") == 0){
			update_option("effecto_secure","1");
		}
		else{
			update_option("effecto_secure","");
		}


		$data_json["isOnPost"] =  (strcmp($eff_isOnPost, "true") == 0);
		
		$data_json["isOnPage"] = (strcmp($eff_isOnPage,"true")==0);
	
		$data_json["isOnHome"] = (strcmp($eff_isOnHome,"true")==0); 
	
		$data_json["isOnCustom"] = (strcmp($eff_isCustom,"true")==0);  
	
		$data_json["isOnCustomList"] = $eff_custom_list;
	
		$data_json["plist"] = (strcmp($eff_plist,"true")==0); 

		$data_json["mob"] =  (strcmp($eff_mob, "true") == 0);

		update_option('mye_plugin_visib', json_encode($data_json,true));
		
		//update_option('mye_plugin_visib', '{"mye_load_on":"'.$mye_load_on.'","isOnPost":'.$eff_isOnPost.', "isOnPage":'.$eff_isOnPage.', "isOnHome":'.$eff_isOnHome.', "isOnCustom":'.$eff_isCustom.', "isOnCustomList":'.$eff_custom_list.', "plist":'.$eff_plist.'}');

		wp_die(); // this is required to terminate immediately and return a proper response
	}

	add_action('wp_ajax_mye_save_sname', 'mye_save_sname' );
	function mye_save_sname() {
		global $hostString;
		$sname=$_POST['sname'];
		$args = array('timeout' => 60,'body' => array('action' => 'copySname','sname' => $sname,'host'=>get_site_url()));
		$resp = wp_remote_post($hostString.'/contentdetails', $args);
		if(!is_wp_error($resp)){ 
			$eff_shortname=$resp['body'];
			if(isset($eff_shortname) && $eff_shortname!='null'){
				$eff_shortname=trim($eff_shortname);
				updateMyeffectoEmbedCode('', 0, $eff_shortname);
			}
		}
		wp_die();
	}
?>