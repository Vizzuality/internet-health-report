<?php 
	global $hostString;

	$mye_plugin_visib = get_option('mye_plugin_visib');

	$eff_isJsonPresent = false;
	$eff_isOnPost = "checked";
	$eff_Load="checked";
	$eff_dom_load="";
	$eff_asyncLoad="";
	$eff_isOnPage = "";
	$eff_postList = "";
	$eff_mobBrow = "checked";
	$eff_isOnHome = "";
	$eff_isCustom = "";
	$eff_secure = get_option("effecto_secure");
	$eff_custom_list = "";
	$eff_should_be_disabled = "style='display:none'";
	// print_r($mye_plugin_visib);
	$eff_custom_post_html = "";
	if (isset($mye_plugin_visib) && $mye_plugin_visib != null) {
		$eff_isJsonPresent = true;
		$mye_plugin_visib = json_decode($mye_plugin_visib, true);
		
		if($mye_plugin_visib['mye_load_on']){
			if($mye_plugin_visib['mye_load_on']=="async"){
				$eff_asyncLoad="checked"; $eff_Load=""; $eff_dom_load="";
			}
			else if($mye_plugin_visib['mye_load_on']=="dom"){
				$eff_asyncLoad="";$eff_Load="";$eff_dom_load="checked";
			}
		}
		if($mye_plugin_visib['isOnPost']){$eff_isOnPost = "checked";}else{$eff_isOnPost="";}
		if($mye_plugin_visib['isOnPage']){$eff_isOnPage = "checked";}
		if($mye_plugin_visib['isOnHome']){$eff_isOnHome = "checked";}
		if($mye_plugin_visib['plist']){$eff_postList = "checked";}
		if(array_key_exists( 'mob', $mye_plugin_visib)){if($mye_plugin_visib['mob']){$eff_mobBrow = "checked";}else{$eff_mobBrow = "";}}
		if(isset($eff_secure) && $eff_secure==="1"){$eff_secure = "checked";}
		if($mye_plugin_visib['isOnCustom']){ $eff_isCustom = "checked"; $eff_should_be_disabled="";}
	}else{		
		$eff_isCustom = "checked";$eff_should_be_disabled="";
	}

	$eff_cstm_args = array(
	   'public'   => true,
	   '_builtin' => false
	);
	
	$eff_output = 'objects'; // names or objects
	
	$post_types = get_post_types( $eff_cstm_args, $eff_output );
	$cust_ptype_count=count($post_types);

	if(is_array($post_types) && !empty($post_types)){
		$eff_custom_post_html_first = "<div id='eff_customPostList' ".$eff_should_be_disabled." style='margin-top: 11px;'><style>.mye_cust_p{padding: 0px 7px;line-height: 28px;border: 1px solid #DEDEDE; margin-right: 6px;display: inline-block;margin: 5px 5px;}</style><hr /><b>Custom Post-Types : </b>";
		$eff_custom_post_html = $eff_custom_post_html_first;

		foreach ( $post_types  as $post_type ) {
		$eff_cName = $post_type->name;
		$checked = "checked";
		
		if($eff_isJsonPresent && !is_null($mye_plugin_visib['isOnCustomList'])){
			
			$cust_ptype=json_decode($mye_plugin_visib['isOnCustomList'], true); 

			if(is_array($cust_ptype) && array_key_exists($eff_cName, $cust_ptype)){
				
				if($cust_ptype[$eff_cName]){
					$checked = "checked";
				}
				else{
					$checked = "";
				}
				
			}
		}

		$eff_custom_post_html .= '<span class="mye_cust_p"><input type="checkbox" c-name="'.$eff_cName.'" '.$checked.' class="eff_customPostList"  />'.$post_type->label.'</span>';
	}


	$eff_custom_post_html .= "</div>";
	}
	
?>
<br>
<div style="margin-top:25px;"><style>.m_hp{cursor:pointer;margin-left:5px;text-decoration:none} mye_chk{margin-right:8px;} .mye_fset > span{margin-right:35px;} .mye_fset{border: 1px solid #DBDBDB;padding: 15px;} .mye_leg{font-weight:600;width:auto;font-size:15px;}</style>
	<div id="load" style="display:none;"></div>
	<form>
		<fieldset class="mye_fset" style="margin-bottom:20px">
			<legend class="mye_leg">Show plugin on</legend>
			<span><input class="mye_chk" type="checkbox" id="posts" name="postType" <?php echo $eff_isOnPost; ?>/>Posts</span>
			<span><input class="mye_chk" type="checkbox" id="pages" name="postType" <?php echo $eff_isOnPage; ?>/>Pages/ Articles</span>
<?php 
	if($cust_ptype_count>0){
		echo '<span><input class="mye_chk" type="checkbox" id="custom" name="postType" '.$eff_isCustom.' />Custom Posts</span>';				
	}
?>	
<span><input class="mye_chk" type="checkbox" id="home" name="postType" <?php echo $eff_isOnHome; ?>/>HomePage-Footer <a class="m_hp" href="<?php echo $hostString; ?>/support?type=shortcode#homeShortCode" target="_blank">(?)</a></span>
<span><input class="mye_chk" type="checkbox" id="mob" name="postType" <?php echo $eff_mobBrow; ?>/>Mobile Browser</span>
<span><input class="mye_chk" type="checkbox" id="plist" name="postType" <?php echo $eff_postList; ?>/>Below Post-list (May not work on all theme)</span>
<?php echo $eff_custom_post_html; ?>
		</fieldset>
		<fieldset class="mye_fset" style="margin-bottom:20px">
			<legend class="mye_leg">Plugin Performance</legend>
			<span><input class="mye_chk m_lod" type="radio" value="sync" name="p_load" <?php echo $eff_Load; ?> />Fast<a onclick="alert('Note : Loads plugin along with post/page.\nWith minimum delay in page load.')" class="m_hp">(?)</a></span>
			<span><input class="mye_chk m_lod" type="radio" value="dom" name="p_load" <?php echo $eff_dom_load; ?> />Medium<a onclick="alert('Note : Loads plugin after HTML content in page has loaded. With partial delay in plugin load.')" class="m_hp">(?)</a></span>
			<span><input class="mye_chk m_lod" type="radio" value="async" name="p_load" <?php echo $eff_asyncLoad; ?> />Slow<a onclick="alert('Note : Enabling this option gives priority to page/post load.\ni.e loads plugin after page is loaded')" class="m_hp">(?)</a></span>
		</fieldset>
		<fieldset class="mye_fset">
			<legend class="mye_leg">Other</legend>
			<span><input class="mye_chk" type="checkbox" id="secure_p" name="postType" <?php echo $eff_secure; ?>/>Secure Plugin (https request only)</span>
		</fieldset>
		<center style="margin-top: 15px;margin-bottom: 30px;">
			<a href="#" style="font-size: 15px;margin-top:15px;margin-bottom:margin-bottom:20px;cursor:pointer;" class="button-primary" id="eff_visib">Save Settings</a>
			<p id="eff_msg" style="display:none;font-size: 14px;"></p>
			<p id="eff_shCode" style="display:none;font-weight:bold;font-size:16px;">Plugin has been added to your homepage footer <a href="<?php echo $hostString; ?>/support?type=shortcode#homeShortCode" target="_blank">(more help)</a></p>
		</center>
		<hr style="border-color: #B3B3B3;">
		<fieldset>
			<span>View your blog metrics at 
				<a href="<?php echo $hostString; ?>/dashboard-overview" target="_blank" title="Myeffecto Dashboard" style="font-weight:500;">Myeffecto Dashboard</a>
			</span>
		</fieldset>	
	</form>				
</div>
<script type="text/javascript" src="<?php echo plugins_url( '/js/advanceSetting.js' , __FILE__ );?>"></script>
<script type="text/javascript">jQuery(".nav-load").click(function(){
jQuery('#load').show();
});</script>