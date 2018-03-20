jQuery(document).ready(function ($) {
    if (location.href.indexOf('wpdiscuz_options_page') >= 0) {
        $('.wpdiscuz-color-picker').colorPicker();

        if (!$('ul.wpdiscuz-addons-options').html().trim()) {
            $('#wpdiscuz-addons-options').remove();
        }
    }
    
    $('#wc_share_button_fb').click(function () {
        if ($(this).is(':checked')) {
            $('#wpc-fb-api-cont').attr('style', '');
        } else {
            $('#wpc-fb-api-cont').attr('style', 'display:none');
        }
    });

    $('#wpdiscuz-reset-options').click(function (e) {
        if (!confirm(wpdiscuzObj.msgConfirmResetOptions)) {
            e.preventDefault();
            return false;
        }
    });

    $('#wpdiscuz-remove-votes').click(function (e) {
        if (!confirm(wpdiscuzObj.msgConfirmRemoveVotes)) {
            e.preventDefault();
            return false;
        }
    });

    $('#wpdiscuz-purge-gravatars-cache').click(function (e) {
        if (!confirm(wpdiscuzObj.msgConfirmPurgeGravatarsCache)) {
            e.preventDefault();
            return false;
        }
    });

    $(document).delegate('.wc_stick_btn', 'click', function (e) {
        var btn = $(this);
        $('.fas', btn).addClass('fa-pulse fa-spinner');
        var commentId = btn.data('comment');
        var postId = btn.data('post');
        var data = new FormData();
        data.append('action', 'wpdiscuzStickComment');
        data.append('commentId', commentId);
        data.append('postId', postId);
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: data,
            contentType: false,
            processData: false,
        }).done(function (response) {
            try {
                $('.fas', btn).removeClass('fa-pulse fa-spinner');
                var resp = $.parseJSON(response);
                if (resp.code == 1) {
                    $('.wc_stick_text', btn).text(resp.data);
                } else {
                    console.log('Comment not updated');
                }
            } catch (e) {
                console.log(e);
            }
            $('.wpdiscuz-loading-bar').fadeOut(250);
        });
        e.preventDefault();
        return false;
    });

    $(document).delegate('.wc_close_btn', 'click', function (e) {
        var btn = $(this);
        $('.fas', btn).addClass('fa-pulse fa-spinner');
        var commentId = btn.data('comment');
        var postId = btn.data('post');
        var data = new FormData();
        data.append('action', 'wpdiscuzCloseThread');
        data.append('commentId', commentId);
        data.append('postId', postId);
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: data,
            contentType: false,
            processData: false,
        }).done(function (response) {
            try {
                $('.fas', btn).removeClass('fa-pulse fa-spinner');
                var resp = $.parseJSON(response);
                if (resp.code == 1) {
                    $('.wc_close_text', btn).text(resp.data);
                    $('.fas', btn).removeClass('fa-lock fa-unlock');
                    $('.fas', btn).addClass(resp.icon);
                } else {
                    console.log('Comment not updated');
                }
            } catch (e) {
                console.log(e);
            }
            $('.wpdiscuz-loading-bar').fadeOut(250);
        });
        e.preventDefault();
        return false;
    });

    $('#wpd-disable-addons').click(function () {
        location.href = $('#wpd-disable-addons-action').val();
    });
});