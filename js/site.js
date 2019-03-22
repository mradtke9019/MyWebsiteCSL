// Javascript to run the website.

$('a[href^="#"]').on('click', function (event) {
    event.preventDefault();
    var target = $(this.getAttribute('href'));
    if (target.length) {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: target.offset().top - target.height()/3
        }, 1000);
    }
});