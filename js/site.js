// Javascript to run the website. Copyright - Matthew Radtke
function scrollToHome() {
    if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 800, function () {

            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
        });
    } 
}

$("#menuHome").click(function () {
    document.getElementById("menuHome").scrollIntoView();
})

$("#menuAbout").click(function () {
    alert("Home key was pressed");
})

$("#menuProjects").click(function () {
    alert("Home key was pressed");
})

$("#menuExperience").click(function () {
    alert("Home key was pressed");
})

$("#menuContact").click(function () {
    alert("Home key was pressed");

})