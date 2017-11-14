function save(shortname) {
	if (shortname == null || shortname === "" || shortname === "undefined") {
		ifrm.contentWindow.postMessage("Save#~#postTitle#~#"+postTitle,mye_host);
	} else {
		ifrm.contentWindow.postMessage("Save#~#delete#~#"+shortname+"#~#"+effecto_identifier+"#~#postTitle#~#"+postTitle,mye_host);
		shortname = "";
		effecto_identifier = "";
	}
}


function rcvMyeMsg(event) {
	if(event.origin===mye_host){
		var rcvdMsg = event.data;
		var msg = rcvdMsg.split("#~#");	
		if(msg[0]==="setHt") {
			ifrm.style.height=msg[1];
			ifrm.height=msg[1];
		} else if (msg[0] === "save") {
			jQuery('#load').show();
			postIframeCode(msg[1]);
		} else if(msg[0] === "loggedIn") {
			afterLoginSuccess();
		} else if (msg[0] === "error") {
			alert("Error occured");
		} else if (msg[0] === "pluginLoggedIn") {
			showButtonCode(shortname);
		} else if (msg[0] === "") { 
			showButtonCode(shortname);
		} else if (msg[0] === "validated") {
			jQuery('#load').show();
		}else if (msg[0] === "saveWidget") {
            postWidgetForm(msg[1]);
            jQuery('#generate').remove();
		}else if (msg[0] === "home") {
			alert("Please come back again, later");
			location.replace(siteUrl+"/wp-admin/admin.php?page="+setting_page);
		}
	}                  
}

function postIframeCode(rcvdMsg) {
	var dataToSend = { "insert":"true", "data" : rcvdMsg};
	var test = JSON.parse(rcvdMsg);
	jQuery("#dataToSend").val(test.embedCode);
	jQuery("#eff_shortname").val(test.shortName);
	jQuery('#submitForm').submit();
}
                
function postWidgetForm(json)
{   jQuery("#url").val(json);
    //alert("val"+jQuery("#url").val());
    jQuery('#submitWidgetForm').submit();
}  

function showButtonCode(shortname) {
    jQuery('.generate').remove();
    var efrm=jQuery('#effectoFrame');
    var init=efrm.attr("w-init")!="1";
    if (shortname === "no") {
     return;
     }else {
     	var cancelLink=siteUrl+"/wp-admin/admin.php?page="+setting_page;

     	if(init){
        	efrm.before(jQuery('<h2 style="float:left;">Myeffecto Configure</h2>'));
        	efrm.attr("w-init","1"); 

        	efrm.before(jQuery('<div><h3 id="before_button_bar" style="float:right;"></h3></div>'));
        	efrm.after(jQuery('<h3 id="after_button_bar" style="float:right;"></h3>'));                        

        }
		
		var beforBar=jQuery("#before_button_bar");
		var aftrBar=jQuery("#after_button_bar");
	
			var c=false;
		if(beforBar.find("a").length==0){c=true;
			beforBar.append(jQuery('<a id="mye_cancel" href="'+cancelLink+'" class="button conf-close">Cancel</a>'));
		}
	/*	if(aftrBar.find("a").length==0){c=true;
			aftrBar.append(jQuery(\'<a id="mye_cancel" href="\'+cancelLink+\'" class="button conf-close">Cancel</a>\'));
		}*/
		if(c){
		jQuery(".conf-close").click(function(){jQuery('#load').show();});	
		}

		var l=false;
		if(beforBar.find("input").length==0){
			l=true;
			beforBar.append(jQuery('<input type="button" 2 value="Finish!" class="button-primary generate" />'));     	
		}
		/*if(aftrBar.find("input").length==0){
			l=true;
			aftrBar.append(jQuery(\'<input type="button" 2 value="Finish!" class="button-primary generate" />\'));     	
		}*/

     	if(l){
     	jQuery(".generate").click(function(){save(shortname);});	
     	}
     	
    }
} 

function afterLoginSuccess() {
	ifrm.setAttribute("src", mye_host+"/confgEmoji?l="+siteUrl+"outside=true&postTitle=" + postTitle);
} 

var ifrm= null;
window.onload=function(){
    var url=location.href;
	ifrm = document.getElementById("effectoFrame");
                        if(url.indexOf("true")>0){
                            ifrm.setAttribute("src", mye_host+"/auth?action=extAcess&from=wp&callback=config_trend");
                            ifrm.onload=function(){ 
                            ifrm.contentWindow.postMessage("init_effecto",mye_host); 
                            }
                        }
                        else{
                            ifrm.setAttribute("src", mye_host+"/auth?action=extAcess&from=wp&sname="+shortname+"&l="+siteUrl+"&email="+admin_email+"&uname="+blogName+"&v="+mye_ver);
                        }
	window.addEventListener("message", rcvMyeMsg, false);
};
