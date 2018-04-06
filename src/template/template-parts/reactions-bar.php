<div class="c-reactions-bar">
  <div class="wrap">
    <div class="row">
      <div class="reactions-bar-container">
        <div class="column small-12 medium-2">
          <ul class="social-list">
            <li
              class="social-item"
              data-ga-action=<?php echo get_post()->post_title; ?>
              data-ga-label="facebook"
            >
              <a
                href="javascript:fbShare('<?php print(urlencode(get_permalink())); ?>', 'Share this via Facebook', 'Facebook share popup', 550, 250)"
              >
                <svg class="c-icon -x-small"><use xlink:href="#icon-facebook"></use></svg>
              </a>
            </li>
            <li
              class="social-item"
              data-ga-action=<?php echo get_post()->post_title; ?>
              data-ga-label="twitter"
            >
              <a
                target="_blank"
                href="https://twitter.com/intent/tweet/?url=<?php print(urlencode(get_permalink())); ?>&hashtags=internethealth"
              >
                <svg class="c-icon -x-small"><use xlink:href="#icon-twitter"></use></svg>
              </a>
              <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
            </li>
          </ul>
        </div>
        <div class="column small-12 medium-10">
          <div class="reactions" data-ga-action=<?php echo get_post()->post_title; ?>>
            <span class="text"><?php _e('How does this article make you feel?', 'ihr-2018');?></span>
            <?php
              $reactions = reaction_count(get_the_ID());
              echo do_shortcode('[reaction_buttons]');
            ?>

            <div class="comments" style="display: none;">
              <span class="text"><?php echo comments_count(get_the_ID());?>
              <svg class="c-icon"><use xlink:href="#icon-comment_icon"></use></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
