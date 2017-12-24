<form method="get" class="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    <input type="text" name="s" class="search-top" value="<?php _e('Search here..', 'hendrix'); ?>" onfocus='if (this.value == "<?php _e('Search here..', 'hendrix'); ?>") { this.value = ""; }' onblur='if (this.value == "") { this.value = "<?php _e('Search here..', 'hendrix'); ?>"; }' />
    <input type="submit" value="Search" alt="Search">
</form>