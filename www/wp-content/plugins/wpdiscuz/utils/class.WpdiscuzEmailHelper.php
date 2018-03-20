<?php

if (!defined('ABSPATH')) {
    exit();
}

class WpdiscuzEmailHelper {

    private $optionsSerialized;
    private $dbManager;

    public function __construct($optionsSerialized, $dbManager) {
        $this->optionsSerialized = $optionsSerialized;
        $this->dbManager = $dbManager;
    }

    public function addSubscription() {
        global $wp_rewrite;
        $currentUser = WpdiscuzHelper::getCurrentUser();
        $subscribeFormNonce = filter_input(INPUT_POST, 'wpdiscuz_subscribe_form_nonce');
        $httpReferer = filter_input(INPUT_POST, '_wp_http_referer');
        $subscriptionType = filter_input(INPUT_POST, 'wpdiscuzSubscriptionType');
        $postId = filter_input(INPUT_POST, 'wpdiscuzSubscriptionPostId');
        if ($currentUser && $currentUser->ID) {
            $email = $currentUser->user_email;
        } else {
            $email = filter_input(INPUT_POST, 'wpdiscuzSubscriptionEmail');
        }

        $success = 0;
        if (wp_verify_nonce($subscribeFormNonce, 'wpdiscuz_subscribe_form_nonce_action') && $email && filter_var($email, FILTER_VALIDATE_EMAIL) !== false && in_array($subscriptionType, array(WpdiscuzCore::SUBSCRIPTION_POST, WpdiscuzCore::SUBSCRIPTION_ALL_COMMENT)) && $postId) {
            $noNeedMemberConfirm = ($currentUser->ID && $this->optionsSerialized->disableMemberConfirm);
            $noNeedGuestsConfirm = (!$currentUser->ID && $this->optionsSerialized->disableGuestsConfirm && $this->dbManager->hasConfirmedSubscription($email));
            if ($noNeedMemberConfirm || $noNeedGuestsConfirm) {
                $confirmData = $this->dbManager->addEmailNotification($postId, $postId, $email, $subscriptionType, 1);
                if ($confirmData) {
                    $success = 1;
                }
            } else {
                $confirmData = $this->dbManager->addEmailNotification($postId, $postId, $email, $subscriptionType, 0);
                if ($confirmData) {
                    $success = $this->confirmEmailSender($confirmData['id'], $confirmData['activation_key'], $postId, $email) ? 1 : -1;
                    if ($success < 0) {
                        $this->dbManager->unsubscribe($confirmData['id'], $confirmData['activation_key']);
                    }
                }
            }
        }
        $httpReferer .= $wp_rewrite->using_permalinks() ? "?subscribeAnchor&subscriptionSuccess=$success&subscriptionID=" . $confirmData['id'] . "#wc_unsubscribe_message" : "&subscribeAnchor&subscriptionSuccess=$success#wc_unsubscribe_message";
        wp_redirect($httpReferer);
        exit();
    }

    public function confirmEmailSender($id, $activationKey, $postId, $email) {
        $subject = $this->optionsSerialized->phrases['wc_confirm_email_subject'];
        $message = $this->optionsSerialized->phrases['wc_confirm_email_message'];
        $confirm_url = $this->dbManager->confirmLink($id, $activationKey, $postId);
        $unsubscribe_url = $this->dbManager->unsubscribeLink($postId, $email);
        $siteUrl = get_site_url();
        $blogTitle = get_option('blogname');
        if (strpos($message, '[SITE_URL]') !== false) {
            $message = str_replace('[SITE_URL]', $siteUrl, $message);
        }
        if (strpos($message, '[POST_URL]') !== false) {
            $postPermalink = get_permalink($postId);
            $message = str_replace('[POST_URL]', $postPermalink, $message);
        }
        if (strpos($message, '[BLOG_TITLE]') !== false) {
            $message = str_replace('[BLOG_TITLE]', $blogTitle, $message);
        }
        if (strpos($message, '[POST_TITLE]') !== false) {
            $postTitle = get_the_title($postId);
            $message = str_replace('[POST_TITLE]', $postTitle, $message);
        }
        $message .= "<br/><br/><a href='$confirm_url'>" . $this->optionsSerialized->phrases['wc_confirm_email'] . "</a>";
        $message .= "<br/><br/><a href='$unsubscribe_url'>" . $this->optionsSerialized->phrases['wc_ignore_subscription'] . "</a>";
        $headers = array();
        $mailContentType = apply_filters('wp_mail_content_type', 'text/html');
        $fromName = apply_filters('wp_mail_from_name', $blogTitle);

        $parsedUrl = parse_url($siteUrl);
        $domain = isset($parsedUrl['host']) ? $parsedUrl['host'] : '';
        $fromEmail = 'no-reply@' . $domain;
        $fromEmail = apply_filters('wp_mail_from', $fromEmail);
        $headers[] = "Content-Type:  $mailContentType; charset=UTF-8";
        $headers[] = "From: " . $fromName . " <" . $fromEmail . "> \r\n";
        $message = html_entity_decode($message);
        return wp_mail($email, $subject, $message, $headers);
    }

    /**
     * send email
     */
    public function emailSender($emailData, $commentId, $subject, $message) {
        global $wp_rewrite;
        $comment = get_comment($commentId);
        $post = get_post($comment->comment_post_ID);
        $postAuthor = get_userdata($post->post_author);

        if ($emailData['email'] == $postAuthor->user_email) {
            if (get_option('moderation_notify') && !$comment->comment_approved) {
                return;
            } else if (get_option('comments_notify') && $comment->comment_approved) {
                return;
            }
        }
        $sendMail = apply_filters('wpdiscuz_email_notification', true, $emailData, $comment);
        if ($sendMail) {
            $unsubscribeUrl = !$wp_rewrite->using_permalinks() ? get_permalink($comment->comment_post_ID) . "&" : get_permalink($comment->comment_post_ID) . "?";
            $unsubscribeUrl .= "subscribeAnchor&wpdiscuzSubscribeID=" . $emailData['id'] . "&key=" . $emailData['activation_key'] . '&#wc_unsubscribe_message';


            $siteUrl = get_site_url();
            $blogTitle = get_option('blogname');
            if (strpos($message, '[SITE_URL]') !== false) {
                $message = str_replace('[SITE_URL]', $siteUrl, $message);
            }
            if (strpos($message, '[POST_URL]') !== false) {
                $postPermalink = get_permalink($comment->comment_post_ID);
                $message = str_replace('[POST_URL]', $postPermalink, $message);
            }
            if (strpos($message, '[BLOG_TITLE]') !== false) {
                $message = str_replace('[BLOG_TITLE]', $blogTitle, $message);
            }
            if (strpos($message, '[POST_TITLE]') !== false) {
                $postTitle = get_the_title($comment->comment_post_ID);
                $message = str_replace('[POST_TITLE]', $postTitle, $message);
            }
            if (strpos($message, '[COMMENT_URL]') !== false) {
                $commentPermalink = get_comment_link($commentId);
                $message = str_replace('[COMMENT_URL]', $commentPermalink, $message);
            }
            if (strpos($message, '[COMMENT_AUTHOR]') !== false) {
                $message = str_replace('[COMMENT_AUTHOR]', $comment->comment_author, $message);
            }
            if (strpos($message, '[COMMENT_CONTENT]') !== false) {
                $message = str_replace('[COMMENT_CONTENT]', $comment->comment_content, $message);
            }

            $message .= "<br/><br/><a href='$unsubscribeUrl'>" . $this->optionsSerialized->phrases['wc_unsubscribe'] . "</a>";
            $headers = array();
            $mailContentType = apply_filters('wp_mail_content_type', 'text/html');
            $fromName = apply_filters('wp_mail_from_name', $blogTitle);

            $parsedUrl = parse_url($siteUrl);
            $domain = isset($parsedUrl['host']) ? $parsedUrl['host'] : '';
            $fromEmail = 'no-reply@' . $domain;
            $fromEmail = apply_filters('wp_mail_from', $fromEmail);
            $headers[] = "Content-Type:  $mailContentType; charset=UTF-8";
            $headers[] = "From: " . $fromName . " <" . $fromEmail . "> \r\n";
            $message = html_entity_decode($message);
            wp_mail($emailData['email'], $subject, $message, $headers);
        }
    }

    /**
     * Check notification type and send email to post new comments subscribers
     */
    public function checkNotificationType() {
        $postId = isset($_POST['postId']) ? intval($_POST['postId']) : 0;
        $commentId = isset($_POST['comment_id']) ? intval($_POST['comment_id']) : 0;
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $isParent = isset($_POST['isParent']) ? intval($_POST['isParent']) : '';
        $currentUser = WpdiscuzHelper::getCurrentUser();
        if ($currentUser && $currentUser->user_email) {
            $email = $currentUser->user_email;
        }
        if ($commentId && $email && $postId) {
            $this->notifyPostSubscribers($postId, $commentId, $email);
            if (!$isParent) {
                $comment = get_comment($commentId);
                $parentCommentId = $comment->comment_parent;
                $parentComment = get_comment($parentCommentId);
                $parentCommentEmail = $parentComment->comment_author_email;
                if ($parentCommentEmail != $email) {
                    $this->notifyAllCommentSubscribers($postId, $commentId, $email);
                    $this->notifyCommentSubscribers($parentCommentId, $comment->comment_ID, $email);
                }
            }
        }
        wp_die();
    }

    /**
     * Send notifications for new comments on the post (including replies)
     *
     * @param $postId      int
     * @param $commentId   int
     * @param $email       string
     */
    public function notifyPostSubscribers($postId, $commentId, $email) {
        $emailsArray = $this->dbManager->getPostNewCommentNotification($postId, $email);
        $subject = $this->optionsSerialized->phrases['wc_email_subject'];
        $message = $this->optionsSerialized->phrases['wc_email_message'];
        foreach ($emailsArray as $eRow) {
            $subscriberUserId = $eRow['id'];
            $subscriberEmail = $eRow['email'];
            $this->emailSender($eRow, $commentId, $subject, $message);
            do_action('wpdiscuz_notify_post_subscribers', $postId, $commentId, $subscriberUserId, $subscriberEmail);
        }
    }

    /**
     * Send notifications for new comments on the post (including replies)
     *
     * @param $postId           int
     * @param $newCommentId     int
     * @param $email            string
     */
    public function notifyAllCommentSubscribers($postId, $newCommentId, $email) {
        $emailsArray = $this->dbManager->getAllNewCommentNotification($postId, $email);
        $subject = $this->optionsSerialized->phrases['wc_new_reply_email_subject'];
        $message = $this->optionsSerialized->phrases['wc_new_reply_email_message'];
        foreach ($emailsArray as $eRow) {
            $subscriberUserId = $eRow['id'];
            $subscriberEmail = $eRow['email'];
            $this->emailSender($eRow, $newCommentId, $subject, $message);
            do_action('wpdiscuz_notify_all_comment_subscribers', $postId, $newCommentId, $subscriberUserId, $subscriberEmail);
        }
    }

    /**
     * Send notifications for new replies to an individual comment
     * (includes all replies)
     *
     * @param $parentCommentId    int
     * @param $newCommentId       int
     * @param $email              string  email address to exclude (the comment author email)
     */
    public function notifyCommentSubscribers($parentCommentId, $newCommentId, $email) {
        $emailsArray = $this->dbManager->getNewReplyNotification($parentCommentId, $email);
        $subject = $this->optionsSerialized->phrases['wc_new_reply_email_subject'];
        $message = $this->optionsSerialized->phrases['wc_new_reply_email_message'];
        foreach ($emailsArray as $eRow) {
            $subscriberUserId = $eRow['id'];
            $subscriberEmail = $eRow['email'];
            $this->emailSender($eRow, $newCommentId, $subject, $message);
            do_action('wpdiscuz_notify_comment_subscribers', $parentCommentId, $newCommentId, $subscriberUserId, $subscriberEmail);
        }
    }

    /**
     * When a comment is approved from the admin comments.php or posts.php... notify the subscribers
     *
     * @param $commentId       int
     * @param $approved        bool
     */
    public function notificationFromDashboard($commentId, $approved) {
        $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
        $commentdata = get_comment($commentId);
        $commentsPage = strpos($referer, 'edit-comments.php') !== false;
        $postCommentsPage = (strpos($referer, 'post.php') !== false) && (strpos($referer, 'action=edit') !== false);
        if ($approved == 1 && ($commentsPage || $postCommentsPage) && $commentdata) {
            $postId = $commentdata->comment_post_ID;
            $email = $commentdata->comment_author_email;
            $parentComment = get_comment($commentdata->comment_parent);
            $this->notifyPostSubscribers($postId, $commentId, $email);
            if ($parentComment) {
                $parentCommentEmail = $parentComment->comment_author_email;
                if ($parentCommentEmail != $email) {
                    $this->notifyAllCommentSubscribers($postId, $commentId, $email);
                    $this->notifyCommentSubscribers($parentComment->comment_ID, $commentId, $email);
                }
            }
        }
    }

    /**
     * When a comment is approved (after being held for moderation)... notify the author
     *
     * @param $comment  WP_Comment
     */
    public function notifyOnApproving($comment) {
        if ($comment) {
            $user = $comment->user_id ? get_userdata($comment->user_id) : null;
            if ($user) {
                $email = $user->user_email;
            } else {
                $email = $comment->comment_author_email;
            }

            $subject = $this->optionsSerialized->phrases['wc_comment_approved_email_subject'];
            $message = $this->optionsSerialized->phrases['wc_comment_approved_email_message'];
            $siteUrl = get_site_url();
            $blogTitle = get_option('blogname');
            if (strpos($message, '[SITE_URL]') !== false) {
                $message = str_replace('[SITE_URL]', $siteUrl, $message);
            }
            if (strpos($message, '[POST_URL]') !== false) {
                $postPermalink = get_permalink($comment->comment_post_ID);
                $message = str_replace('[POST_URL]', $postPermalink, $message);
            }
            if (strpos($message, '[BLOG_TITLE]') !== false) {
                $message = str_replace('[BLOG_TITLE]', $blogTitle, $message);
            }
            if (strpos($message, '[POST_TITLE]') !== false) {
                $postTitle = get_the_title($comment->comment_post_ID);
                $message = str_replace('[POST_TITLE]', $postTitle, $message);
            }
            if (strpos($message, '[COMMENT_URL]') !== false) {
                $commentPermalink = get_comment_link($comment->comment_ID);
                $message = str_replace('[COMMENT_URL]', $commentPermalink, $message);
            }
            if (strpos($message, '[COMMENT_AUTHOR]') !== false) {
                $message = str_replace('[COMMENT_AUTHOR]', $comment->comment_author, $message);
            }
            if (strpos($message, '[COMMENT_CONTENT]') !== false) {
                $message = str_replace('[COMMENT_CONTENT]', $comment->comment_content, $message);
            }

            $headers = array();
            $mailContentType = apply_filters('wp_mail_content_type', 'text/html');
            $fromName = apply_filters('wp_mail_from_name', $blogTitle);
            $parsedUrl = parse_url($siteUrl);
            $domain = isset($parsedUrl['host']) ? $parsedUrl['host'] : '';
            $fromEmail = 'no-reply@' . $domain;
            $fromEmail = apply_filters('wp_mail_from', $fromEmail);
            $headers[] = "Content-Type:  $mailContentType; charset=UTF-8";
            $headers[] = "From: " . $fromName . " <" . $fromEmail . "> \r\n";
            $message = html_entity_decode($message);
            wp_mail($email, $subject, $message, $headers);
        }
    }

}
