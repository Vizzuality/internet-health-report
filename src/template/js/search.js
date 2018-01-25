/**
 * File search.js.
 *
 * Function to make the search button work
 */

(function($) {
    
    $('#search-button').on('click', function() {
        // vars
        var url = window.location.href.replace(/search-result(.*)/, '');
            args = {};
        
        url = url.replace(/\?(.*)/, '');

        // loop over filters
        $('#archive-filters .filter').each(function(){
            
            // vars
            var filter = $(this).data('filter'),
                vals = [];
            
            
            // Add selected
            vals.push($(this).find('select').val());            
            
            // append to args
            args[ filter ] = vals.join(',');
            
        });

        var searchText = $('#archive-filters .search-bar .search-text');
        args['s'] = searchText.val();

        // update url
        url += '?';
        
        
        // loop over args
        $.each(args, function( name, value ){
            
            url += name + '=' + value + '&';
            
        });
        
        
        // remove last &
        url = url.slice(0, -1);

        window.location = url;
        //window.open(url);

    });

})(jQuery);