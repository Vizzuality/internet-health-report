<?php
if (!defined('ABSPATH')) {
    exit();
}
?>
<div>
    <h2 style="padding:5px 10px 10px 10px; margin:0px;"><?php _e('Form Template Phrases', 'wpdiscuz'); ?></h2>
    <table class="wp-list-table widefat plugins"  style="margin-top:10px; border:none;">
        <tbody>
            <tr valign="top">
                <th scope="row"><label for="wc_comment_start_text"><?php _e('Comment Field Start', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_comment_start_text']; ?>" name="wc_comment_start_text" id="wc_comment_start_text" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_comment_join_text"><?php _e('Comment Field Join', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_comment_join_text']; ?>" name="wc_comment_join_text" id="wc_comment_join_text" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_email_text"><?php _e('Email Field', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_email_text']; ?>" name="wc_email_text" id="wc_email_text" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_subscribe_anchor"><?php _e('Subscribe', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_subscribe_anchor']; ?>" name="wc_subscribe_anchor" id="wc_subscribe_anchor" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_notify_of"><?php _e('Notify of', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_notify_of']; ?>" name="wc_notify_of" id="wc_notify_of" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_notify_on_new_comment"><?php _e('Notify on new comments', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_notify_on_new_comment']; ?>" name="wc_notify_on_new_comment" id="wc_notify_on_new_comment" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_notify_on_all_new_reply"><?php _e('Notify on all new replies', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_notify_on_all_new_reply']; ?>" name="wc_notify_on_all_new_reply" id="wc_notify_on_all_new_reply" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_notify_on_new_reply_on"><?php _e('Notify on new replies (checkbox) - On', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_notify_on_new_reply_on']; ?>" name="wc_notify_on_new_reply_on" id="wc_notify_on_new_reply_on" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_notify_on_new_reply_off"><?php _e('Notify on new replies (checkbox) - Off', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_notify_on_new_reply_off']; ?>" name="wc_notify_on_new_reply_off" id="wc_notify_on_new_reply_off" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_sort_by"><?php _e('Sort by', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_sort_by']; ?>" name="wc_sort_by" id="wc_sort_by" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_newest"><?php _e('newest', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_newest']; ?>" name="wc_newest" id="wc_newest" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_oldest"><?php _e('oldest', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_oldest']; ?>" name="wc_oldest" id="wc_oldest" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_most_voted"><?php _e('most voted', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_most_voted']; ?>" name="wc_most_voted" id="wc_most_voted" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_subscribed_on_comment"><?php _e('Subscribed on this comment replies', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><textarea name="wc_subscribed_on_comment" id="wc_subscribed_on_comment"><?php echo $this->optionsSerialized->phrases['wc_subscribed_on_comment']; ?></textarea></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_subscribed_on_all_comment"><?php _e('Subscribed on all your comments replies', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><textarea name="wc_subscribed_on_all_comment" id="wc_subscribed_on_all_comment"><?php echo $this->optionsSerialized->phrases['wc_subscribed_on_all_comment']; ?></textarea></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_subscribed_on_post"><?php _e('Subscribed on this post', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><textarea name="wc_subscribed_on_post" id="wc_subscribed_on_post"><?php echo $this->optionsSerialized->phrases['wc_subscribed_on_post']; ?></textarea></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_connect_with"><?php _e('Connect with', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_connect_with']; ?>" name="wc_connect_with" id="wc_connect_with" /></td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="wc_form_subscription_submit"><?php _e('Form subscription button', 'wpdiscuz'); ?></label></th>
                <td colspan="3"><input type="text" value="<?php echo $this->optionsSerialized->phrases['wc_form_subscription_submit']; ?>" name="wc_form_subscription_submit" id="wc_form_subscription_submit" /></td>
            </tr>
        </tbody>
    </table>
</div>