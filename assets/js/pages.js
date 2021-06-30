$( document ).ready(function() {
    var canvs = document.getElementById("fishHolder");
	canvs.width = window.innerWidth;
	canvs.height = $('.bg-holder').height();
	$('#fishHolder').fishAnimation();
});