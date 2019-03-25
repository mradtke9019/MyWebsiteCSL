// Javascript to run the website.

$('a[href^="#"]').on('click', function (event) {
    event.preventDefault();
    var target = $(this.getAttribute('href'));
    if (target.length) {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: target.offset().top - 150
        }, 1000);
    }
});

window.onload = function () {
    $('#main').fadeIn(3000, function () {
        // Animation complete
    });
}