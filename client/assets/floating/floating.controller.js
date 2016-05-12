/**
 * Created by DrCraig LawPav on 4/27/2016.
 */
$(document).ready(function() {
    $('.form-control').on('focus blur', function(e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');
});