<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Hendrix
 */

?>
	<?php
		$colCount = 0;
		if ( is_active_sidebar( 'hendrix-footer-one-widget' ) ){
			$colCount++;
		}
		if ( is_active_sidebar( 'hendrix-footer-two-widget' ) ){
			$colCount++;
		}
		if ( is_active_sidebar( 'hendrix-footer-three-widget' ) ){
			$colCount++;
		}
		if($colCount < 1){ $colCount = 1;}
		
		$colCount = 12/$colCount;
	?>
	</div><!-- #content -->
	<div class="footer-widget-container">
        <div class="container">
            <div class="row">
            	<?php if ( is_active_sidebar( 'hendrix-footer-one-widget' ) ){ ?>
                    <div class="col-md-<?php echo $colCount; ?>">                    
                        <?php dynamic_sidebar('hendrix-footer-one-widget'); ?>
                    </div>
                <?php } ?>
                <?php if ( is_active_sidebar( 'hendrix-footer-two-widget' ) ){ ?>
                    <div class="col-md-<?php echo $colCount; ?>">                    
                        <?php dynamic_sidebar('hendrix-footer-two-widget'); ?>
                    </div>
                <?php } ?>
                <?php if ( is_active_sidebar( 'hendrix-footer-three-widget' ) ){ ?>
                    <div class="col-md-<?php echo $colCount; ?>">                    
                        <?php dynamic_sidebar('hendrix-footer-three-widget'); ?>
                    </div>
                <?php } ?>
            </div>
        </div>
    </div>
	<footer id="colophon" class="site-footer" role="contentinfo">
    	<div class="container">
        
        	<div id="footer-menu">
            	<?php wp_nav_menu( array( 'fallback_cb' => false, 'theme_location' => 'footer', 'depth' => 1 ) ); ?> 
            </div>
            
            <div class="site-info">
				<?php if(is_home() && !is_paged()){?>                	            
                    <?php _e('Powered by ', 'hendrix'); ?><a href="<?php echo esc_url( __( 'http://wordpress.org/', 'hendrix' ) ); ?>" title="<?php esc_attr_e( 'WordPress' ,'hendrix' ); ?>"><?php printf( __( '%s', 'hendrix' ), 'WordPress' ); ?></a>
                    <?php _e(' and ', 'hendrix'); ?><a href="<?php echo esc_url( __( 'http://thehendrix.net/', 'hendrix' ) ); ?>"><?php printf( __( '%s', 'hendrix' ), 'The Hendrix' ); ?></a>
                <?php } else{
					echo '&copy; ' . esc_attr( get_bloginfo( 'name', 'hendrix' ) ); 	
				}?>
            </div><!-- .site-info -->
            
        </div>
	</footer><!-- #colophon -->
    
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
