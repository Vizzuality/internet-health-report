<?php
if (!defined('ABSPATH')) {
    exit();
}
?>
<div>
    <h2 class="wpd-subtitle"><?php _e('Background and Colors', 'wpdiscuz'); ?></h2>
    <table class="wp-list-table widefat plugins wpdxb" style="margin-top:10px; border:none;">
        <tbody>  
            <tr valign="top">
                <th colspan="2" style="width: 50%;">
                    <label><?php _e('Style', 'wpdiscuz'); ?></label>
                </th>
                <th>
                    <div class="wpd-switch-field">
                        <input <?php checked($this->optionsSerialized->theme == 'wpd-default'); ?> value="wpd-default" name="theme" id="themeDefault" type="radio"><label for="themeDefault"><?php _e('Default', 'wpdiscuz'); ?></label>
                        <input <?php checked($this->optionsSerialized->theme == 'wpd-dark'); ?> value="wpd-dark" name="theme" id="themeDark" type="radio"><label for="themeDark"><?php _e('Dark', 'wpdiscuz'); ?></label>
                    </div>
                </th>
            </tr>
            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('Primary Color', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <?php $primaryColor = isset($this->optionsSerialized->primaryColor) ? $this->optionsSerialized->primaryColor : '#00B38F'; ?>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $primaryColor; ?>" id="wc_comment_username_color" name="wc_comment_username_color" placeholder="<?php _e('Example: #00FF00', 'wpdiscuz'); ?>"/>
                </td>
            </tr>
            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('Subscription Bar Background Color', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <?php $formBGColor = isset($this->optionsSerialized->formBGColor) ? $this->optionsSerialized->formBGColor : '#F9F9F9'; ?>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $formBGColor; ?>" id="wc_form_bg_color" name="wc_form_bg_color" placeholder="<?php _e('Example: #00FF00', 'wpdiscuz'); ?>"/>                    
                </td>                
            </tr>
            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('Comment Background Color', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <?php $commentBGColor = isset($this->optionsSerialized->commentBGColor) ? $this->optionsSerialized->commentBGColor : '#FEFEFE'; ?>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $commentBGColor; ?>" id="wc_comment_bg_color" name="wc_comment_bg_color" placeholder="<?php _e('Example: #00FF00', 'wpdiscuz'); ?>"/>
                </td>
            </tr>
            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('Reply Background Color', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <?php $replyBGColor = isset($this->optionsSerialized->replyBGColor) ? $this->optionsSerialized->replyBGColor : '#F8F8F8'; ?>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $replyBGColor; ?>" id="wc_reply_bg_color" name="wc_reply_bg_color" placeholder="<?php _e('Example: #00FF00', 'wpdiscuz'); ?>"/>
                </td>                
            </tr>            
            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('Button Colors', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <?php $buttonColor = (isset($this->optionsSerialized->buttonColor['primary_button_bg']) && $this->optionsSerialized->buttonColor['primary_button_bg'] ) ? $this->optionsSerialized->buttonColor : array('primary_button_bg' => '#555555', 'primary_button_color' => '#FFFFFF', 'secondary_button_color' => '#777777', 'secondary_button_border' => '#dddddd', 'vote_up_link_color' => '#999999', 'vote_down_link_color' => '#999999'); ?>
                    <h4 style="padding:7px 0px 3px 1px; margin:0px;"><?php _e('Primary Buttons', 'wpdiscuz') ?></h4>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $buttonColor['primary_button_color']; ?>" id="wc_link_button_color" name="wc_link_button_color[primary_button_color]" placeholder="<?php _e('Text Color', 'wpdiscuz'); ?>"/> <?php _e('Text Color', 'wpdiscuz'); ?><br>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $buttonColor['primary_button_bg']; ?>" id="wc_link_button_color" name="wc_link_button_color[primary_button_bg]" placeholder="<?php _e('Background Color', 'wpdiscuz'); ?>"/> <?php _e('Background Color', 'wpdiscuz'); ?>

                    <h4 style="padding:7px 0px 3px 1px; margin:0px;"><?php _e('Secondary Buttons', 'wpdiscuz') ?></h4>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $buttonColor['secondary_button_color']; ?>" id="wc_link_button_color" name="wc_link_button_color[secondary_button_color]" placeholder="<?php _e('Text Color', 'wpdiscuz'); ?>"/> <?php _e('Text Color', 'wpdiscuz'); ?><br>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $buttonColor['secondary_button_border']; ?>" id="wc_link_button_color" name="wc_link_button_color[secondary_button_border]" placeholder="<?php _e('Border Color', 'wpdiscuz'); ?>"/> <?php _e('Border Color', 'wpdiscuz'); ?>

                    <h4 style="padding:7px 0px 3px 1px; margin:0px;"><?php _e('Vote Buttons', 'wpdiscuz') ?></h4>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $buttonColor['vote_up_link_color']; ?>" id="wc_link_button_color" name="wc_link_button_color[vote_up_link_color]" placeholder="<?php _e('Up Vote Color', 'wpdiscuz'); ?>"/> <?php _e('Up Vote Color', 'wpdiscuz'); ?><br>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $buttonColor['vote_down_link_color']; ?>" id="wc_link_button_color" name="wc_link_button_color[vote_down_link_color]" placeholder="<?php _e('Down Vote Color', 'wpdiscuz'); ?>"/> <?php _e('Down Vote Color', 'wpdiscuz'); ?>
                </td>
            </tr>
            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('Comment form fields border color', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <?php $inputBorderColor = isset($this->optionsSerialized->inputBorderColor) ? $this->optionsSerialized->inputBorderColor : '#D9D9D9'; ?>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $inputBorderColor; ?>" id="wc_input_border_color" name="wc_input_border_color" placeholder="<?php _e('Example: #00FF00', 'wpdiscuz'); ?>"/>
                </td>
            </tr>
            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('New loaded comments\' background color', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <?php $newLoadedCommentBGColor = isset($this->optionsSerialized->newLoadedCommentBGColor) ? $this->optionsSerialized->newLoadedCommentBGColor : '#FEFEFE'; ?>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $newLoadedCommentBGColor; ?>" id="wc_new_loaded_comment_bg_color" name="wc_new_loaded_comment_bg_color" placeholder="<?php _e('Example: #00FF00', 'wpdiscuz'); ?>"/>
                </td>
            </tr>


            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('Rating Stars Hover Color', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <?php $ratingHoverColor = isset($this->optionsSerialized->ratingHoverColor) ? $this->optionsSerialized->ratingHoverColor : '#FFED85'; ?>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $ratingHoverColor; ?>" id="wc_comment_rating_hover_color" name="wc_comment_rating_hover_color" placeholder="<?php _e('Example: #00FF00', 'wpdiscuz'); ?>"/>
                </td>
            </tr>
            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('Rating Stars Inactiv Color', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <?php $ratingInactivColor = isset($this->optionsSerialized->ratingInactivColor) ? $this->optionsSerialized->ratingInactivColor : '#DDDDDD'; ?>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $ratingInactivColor; ?>" id="wc_comment_rating_inactiv_color" name="wc_comment_rating_inactiv_color" placeholder="<?php _e('Example: #00FF00', 'wpdiscuz'); ?>"/>
                </td>
            </tr>
            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('Rating Stars Activ Color', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <?php $ratingActivColor = isset($this->optionsSerialized->ratingActivColor) ? $this->optionsSerialized->ratingActivColor : '#FFD700'; ?>
                    <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $ratingActivColor; ?>" id="wc_comment_rating_activ_color" name="wc_comment_rating_activ_color" placeholder="<?php _e('Example: #00FF00', 'wpdiscuz'); ?>"/>
                </td>
            </tr>

            <?php
            $blogRoles = $this->optionsSerialized->blogRoles;
            foreach ($blogRoles as $roleName => $color) {
                $blogRoleColor = isset($this->optionsSerialized->blogRoles[$roleName]) ? $this->optionsSerialized->blogRoles[$roleName] : '#00B38F';
                ?>
                <tr valign="top">
                    <th colspan="2">
                        <label><?php echo '<span style="font-weight:bold;color:' . $blogRoleColor . ';">' . ucfirst(str_replace('_', ' ', $roleName)) . '</span> ' . __('label color', 'wpdiscuz'); ?></label>
                    </th>
                    <td>                        
                        <input type="text" class="wpdiscuz-color-picker regular-text" value="<?php echo $blogRoleColor; ?>" id="wc_blog_roles_<?php echo $roleName; ?>" name="wc_blog_roles[<?php echo $roleName; ?>]" placeholder="<?php _e('Example: #00FF00', 'wpdiscuz'); ?>"/>
                    </td>
                </tr>
                <?php
            }
            ?>
            <tr valign="top" >
                <th scope="row" colspan="2">
                    <label><?php _e('Comment text size in pixels', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <select id="wc_comment_text_size" name="wc_comment_text_size">
                        <?php $wc_comment_text_size = isset($this->optionsSerialized->commentTextSize) ? $this->optionsSerialized->commentTextSize : '14px'; ?>
                        <option value="12px" <?php selected($wc_comment_text_size, '12px'); ?>>12px</option>
                        <option value="13px" <?php selected($wc_comment_text_size, '13px'); ?>>13px</option>
                        <option value="14px" <?php selected($wc_comment_text_size, '14px'); ?>>14px</option>
                        <option value="15px" <?php selected($wc_comment_text_size, '15px'); ?>>15px</option>
                        <option value="16px" <?php selected($wc_comment_text_size, '16px'); ?>>16px</option>
                    </select>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row" colspan="2">
                    <label for="disableFontAwesome"><?php _e('Disable font awesome css loading', 'wpdiscuz'); ?></label>
					<p class="wpd-desc" style="color: #DB5C00"><?php _e('IMPORTANT: wpDiscuz uses FontAwesome version 5. in case your theme still uses the old 4.x versions you should not disable this lib. The theme 4.x version doesn\'t support FontAwesome 5 icons, thus all wpDiscuz icons will be lost.', 'wpdiscuz'); ?></p>
                </th>
                <td>                    
                    <input type="checkbox" <?php checked($this->optionsSerialized->disableFontAwesome == 1) ?> value="1" name="disableFontAwesome" id="disableFontAwesome" />
                    <label for="disableFontAwesome"></label>
                </td>
            </tr>
            <tr valign="top">
                <th colspan="2">
                    <label><?php _e('Custom CSS Code', 'wpdiscuz'); ?></label>
                </th>
                <td>
                    <textarea cols="40" rows="8" class="regular-text" id="wc_custom_css" name="wc_custom_css" placeholder=""><?php echo stripslashes($this->optionsSerialized->customCss); ?></textarea>
                </td>   
            </tr>           
        </tbody>
    </table>
</div>
