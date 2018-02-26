<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package ihr-2018
 */

?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer l-footer">
    <div class="l-footer-top">
      <div class="wrap">
    		<div class="row">
          <div class="column small-12 medium-6">
            <div class="c-newsletter">
              <p>Receive our newsletter</p>
              <input type="text" placeholder="Write your email here">
              <button class="btn -secondary">Subscribe</button>
            </div>
          </div>
          <div class="column small-12 medium-6">
            <?php do_action('wpml_add_language_selector'); ?>
          </div>
        </div>
      </div>
    </div>
    <div class="l-footer-bottom">
      <div class="wrap">
        <div class="row">
          <div class="column small-12 medium-8">
            <div class="c-footer-navigation">
              <div class="row">
                <div class="column small-12 medium-3">
                  <a href="<?php echo get_permalink( get_page_by_path( 'introduction' ) ) ?>" class="text -link -light -principal">Introduction</a>
                  <a href="<?php echo get_permalink( get_page_by_path( 'introduction/what-is-this' ) ) ?>" class="text -link -light -secondary">What is this?</a>
                  <a href="<?php echo get_permalink( get_page_by_path( 'introduction/how-is-the-health-of-the-internet' ) ) ?>" class="text -link -light -secondary">How is the health of the internet?</a>
                  <a href="<?php echo get_permalink( get_page_by_path( 'introduction/trending-topics' ) ) ?>" class="text -link -light -secondary">Trending topics</a>
                  <a href="<?php
                        $locale = get_locale();
                        switch(true) {
                          case preg_match('/en.*/', $locale): 
                            echo "https://d20x8vt12bnfa2.cloudfront.net/2018/Internet Health Report 2018.pdf";
                            break;
                          case preg_match('/fr.*/', $locale): 
                            echo "https://d20x8vt12bnfa2.cloudfront.net/2018/Bulletin de santé dInternet 2018.pdf";
                            break;
                          case preg_match('/de.*/', $locale): 
                            echo "https://d20x8vt12bnfa2.cloudfront.net/2018/Statusbericht zur Internetgesundheit 2018.pdf";
                            break;
                          case preg_match('/es.*/', $locale): 
                            echo "https://d20x8vt12bnfa2.cloudfront.net/2018/Informe de Salud de Internet 2018.pdf";
                            break;
                        }
                  ?>" class="text -link -light -secondary">Download PDF</a>
                  <a href="" class="text -link -light -secondary">Contributors</a>
                </div>
                <div class="column small-12 medium-3">
                  <a href="<?php echo get_permalink( get_page_by_path( 'issues' ) ) ?>" class="text -link -light -principal">Issues</a>
                  <a href="<?php echo get_category_link( get_cat_ID( 'openness' ) ) ?>" class="text -link -light -secondary">Openness</a>
                  <a href="<?php echo get_category_link( get_cat_ID( 'digital inclusion' ) ) ?>" class="text -link -light -secondary">Digital Inclusion</a>
                  <a href="<?php echo get_category_link( get_cat_ID( 'decentralization' ) ) ?>" class="text -link -light -secondary">Decentralization</a>
                  <a href="<?php echo get_category_link( get_cat_ID( 'privacy and security' ) ) ?>" class="text -link -light -secondary">Privacy and security</a>
                  <a href="<?php echo get_category_link( get_cat_ID( 'web literacy' ) ) ?>" class="text -link -light -secondary">Web literacy</a>
                </div>
                <div class="column small-12 medium-3">
                  <a href="<?php echo get_permalink( get_page_by_path( 'participate' ) ) ?>" class="text -link -light -principal">Participate</a>
                  <a href="<?php echo get_permalink( get_page_by_path( 'participate/what-you-can-do' ) ) ?>" class="text -link -light -secondary">What you can do</a>
                  <a href="<?php echo get_permalink( get_page_by_path( 'participate/contact-us' ) ) ?>" class="text -link -light -secondary">Contact us</a>
                  <a href="<?php echo get_permalink( get_page_by_path( 'participate/contact-us' ) ) ?>" class="text -link -light -secondary">Share general reflections</a>
                  <a href="<?php echo get_permalink( get_page_by_path( 'participate/contact-us' ) ) ?>" class="text -link -light -secondary">Contribute</a>
                </div>
                <div class="column small-12 medium-3">
                  <a href="<?php echo get_permalink( get_page_by_path( 'search-result' ) ) ?>" class="text -link -light -principal">Explore</a>
                  <a href="http://blog" class="text -link -light -principal">Blog</a>
                  <a href="" class="text -link -light -principal">sitemap</a>
                  <a href="https://internethealthreport.org/2017/" class="text -link -light -principal">Previous report</a>
                </div>
              </div>
            </div>
          </div>
          <div class="column small-12 medium-4">
            <a href="text -link -light">Download PDF</a>
          </div>
        </div>
        <div class="row">
          <div class="column small-12 centered">
            <p>Powered by: </p>
          </div>
        </div>
      </div>
    </div>
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
