/*public giphy api_key = dc6zaTOxFJmzC*/

//set year for copyright on page
var d = new Date();
var year = d.getFullYear();
$("#year").text(year);

//initialize rating and limit defaults
var rating = "pg-13";
var limit = 25;

//api key
var key = "&api_key=dc6zaTOxFJmzC";

//three differnt endpoints per type of searches

var endPoints = [
	"https://api.giphy.com/v1/stickers/search?q=", //sticky
	"https://api.giphy.com/v1/gifs/trending?", //trending
	"https://api.giphy.com/v1/gifs/search?q=" //search
];

//two different parameters combined into one variable
var ratingParam = "&rating=" + rating; //could be set by input later
var limitParam = "&limit=" + limit; //could be set by input later
var parameters = ratingParam + limitParam;

// initialize query URL
var queryURL = ""; //end point + search term + parameters + key

//list for initial set of buttons
var buttonList = ["fail", "coffee", "commercials", 
				"vintage", "dramatic", "movies", 
				"posterized", "homer+simpson", "win"];

//render buttons
function renderButtons(arr) {

    //deprecated
    //$("#categories").empty();

    // Loop through and generate buttons for each item in array
    for (let i = 0; i < arr.length; i++) {
    	
    	//random color for button background
    	let color = randomColor({
    		luminosity: 'light',
    		hue: 'orange'
    	})

    	//add buttons to DOM
      	$("#categories").append($("<button>")
	      	.text(arr[i].replace("+", " "))
	      	.addClass("btn btn-default categories")
	      	.data("term", arr[i])
	      	.css("background-color", color));
    }

}

//form functionality
$(document).on("click", "#submit-button", function(event) {
	event.preventDefault();
	$(".alert").remove(); //clear any alerts on search form

	//get search term and save to a variable
	let term = $("#search-text").val()
		.trim()
		.replace(" ","+")
		.replace(/[^A-Za-z0-9_+]/g,"")
		.toLowerCase();

	$("#search-text").val(''); //clear search form

	//validate user input
	if (buttonList.indexOf(term) === -1 
		&& (term !== '' && term !== "+" && term !== "_")) {

		callAPI(2, term); //make ajax call
		
		buttonList.push(term); //add to buttons

		renderButtons([term]); 
		
	} else {

		//alert user
		$("#search-form").append($("<div>")
			.addClass("alert alert-danger")
			.attr("role", "alert")
			.text("Please Enter a Different Term"));
	}
});


//category button functionality

$(document).on("click", ".categories", function(){
	
	//call search endpoint on this button's term
	callAPI(2, $(this).data("term"));
});


//ajax call function, receiving endpoint index and term to search

function callAPI(epIndex, term) {

	queryURL = endPoints[epIndex] 
				+ term 
				+ parameters 
				+ key;

	console.log(queryURL);

	//ajax call
	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response) {

		//transform data function
		console.log(response);

		//empty current contents of screen to add new gifs
		$("#results").empty();

		// set to trending if...
			//on opening screen
			//since spaces and empty searches 
			//do not passdata validation
		if (term === '') {
			term = "trending";
		}

		//tell user what results are currently displayed
		$("#results").append($("<h5>").text("Now Showing: " + term.toUpperCase())
			.css("color", "white"));

		//add new elements to DOM
		for (let x = 0; x < response.data.length; x++) {

			//use randomColor.js to generate a random bright color
			let color = randomColor({
				luminosity: 'bright',
				format: 'rgba',
				alpha: 0.5
			});

			//console.log(color);
			//append this element to DOM
			let wrapper = $("<div>").addClass("col-xs-12 col-sm-12 col-md-6 col-lg-4 result-col clearfix");

			let image = $("<img>")
				.addClass("img-rounded img-responsive result")
				.attr("src", response.data[x].images.fixed_height_still.url)
				.css("border", "4px solid " + color)
				.data("orig", response.data[x].images.fixed_height_still.url)
				.data("gif", response.data[x].images.fixed_height.url)
				.data("mode", "0")
				.appendTo(wrapper);

			let rating = $("<div>").addClass("rating")
				.text(response.data[x].rating.toUpperCase())
				.appendTo(wrapper);

			$("#results").append(wrapper);
		}
		
	}).fail(function(response) {
		
		console.log("Giphy query error!");
		
		//display error message
		$("#results").prepend($("<div>")
			.addClass("alert alert-danger")
			.attr("role", "alert")
			.text("Search Error!"));

	});
}

//gif action button
$(document).on("click", ".result", function() {
	
	//random color for blurred borders of active gifs
	let color = randomColor({
		luminosity: 'bright',
		format: 'rgba',
		alpha: 1
	});

	//check if still image or gif showing
	if ($(this).data("mode") == 0) {

		//still image showing, so change to gif
		$(this).attr("src", $(this).data("gif"))
			.css("box-shadow", "0px 0px 10px 10px " + color)
			.data("mode", "1");

	} else {

		//gif showing, so change to still image
		$(this).attr("src", $(this).data("orig"))
			.css("box-shadow", "none")
			.data("mode", "0");
	}
});

//initial conditions of page
$(document).ready(function() {

	//show category buttons
	renderButtons(buttonList);

	//make ajax call for giphy trending endpoint
	callAPI(1, '');
});



// FUTURE FUNCTIONALITY

//allow users to set rating limit
//allow users to set desired number of results

//scroll to top button
	//mouseOver

//scroll down one page
	//mouseOver (related to scroll to top)