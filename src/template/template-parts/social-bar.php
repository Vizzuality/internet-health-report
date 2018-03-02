<div class="l-social">
  <div class="wrap">

    <div class="c-social -left -share">
      <div class="reactions">
        <a href="#"><svg class="c-icon -small"><use xlink:href="#icon-facebook"></use></svg></a>
        <a href="#"><svg class="c-icon -small"><use xlink:href="icon-instagram"></use></svg></a>
        <a href="#"><svg class="c-icon -small"><use xlink:href="icon-twitter"></use></svg></a>
      </div>
      <div class="reactions">
        <span class="text -btn3"><?php esc_html_e( 'Share this', 'ihr-2018' ); ?></span>
      </div>
    </div>

    <div class="c-social -right -reactions">
      <div class="reactions">
        <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg>
        <span class="figure text -btn3">1,986</span>
        <span class="text -btn3"><?php esc_html_e( 'Comments', 'ihr-2018' ); ?></span>
      </div>
      <div id="reactions-switcher" class="reactions">
        <div class="reactions-panel">
          <span class="text -btn3">51 <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg></span>
          <span class="text -btn3">55 <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg></span>
          <span class="text -btn3">140 <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg></span>
          <span class="text -btn3">107 <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg></span>
          <span class="text -btn3">101 <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg></span>
        </div>
        <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg>
        <span class="figure text -btn3">355</span>
        <span class="text -btn3"><?php esc_html_e( 'Reactions', 'ihr-2018' ); ?></span>
      </div>
      <button class="btn-add-reaction" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id); ?>">+</button>
    </div>

  </div>
</div>

<div class="l-social -emotions" id="emotions-bar" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id); ?>">
  <div class="wrap">
    <div class="c-social -emotions">
      <div class="reactions">
        <span class="text -btn3"><?php esc_html_e( 'Choose your reaction', 'ihr-2018' ); ?></span>
      </div>
      <div class="reactions">
        <span class="text -btn3"><svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg> Happy</span>
      </div>
      <div class="reactions">
        <span class="text -btn3"><svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg> Surprised</span>
      </div>
      <div class="reactions">
        <span class="text -btn3"><svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg> Thinking</span>
      </div>
      <div class="reactions">
        <span class="text -btn3"><svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg> Sad</span>
      </div>
      <div class="reactions">
        <span class="text -btn3"><svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg> Angry</span>
      </div>
    </div>
  </div>
</div>
