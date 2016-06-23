/**
 * Created by DrCraig-PC on 20/06/2016.
 */
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
$("#menu-toggle-2").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled-2");
    var container = $('#menu');
    container.find("ul").hide();
});

function initMenu() {
    var container = $('#menu');
    container.find("ul").hide();
    container.find("ul").children('.current').parent().show();
    //$('#menu ul:first').show();
    container.find("li a").click(
        function() {
            var checkElement = $(this).next();
            if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
                return false;
            }
            if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
                container.find("ul:visible").slideUp('normal');
                checkElement.slideDown('normal');
                return false;
            }
        }
    );
}
$(document).ready(function() {initMenu();});