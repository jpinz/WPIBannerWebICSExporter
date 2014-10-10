window.randomCSSColor = function() {
	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);
	return "rgb(" + r + ", " + g + ", " + b + ")";
}
document.addEventListener('load', function(){
	window.makeSchedule = function(){
	var termend = new Date(2014, 11, 19,0,0,0,0); //hack, definitely do this better later
	var arr = document.getElementsByClassName("ddlabel");
	// more hacks - trying to get this out fast
	var monday = new Date(document.getElementsByClassName("fieldlargetext")[0].innerHTML.split("Week of ")[1]);
	// better solution would be to use Date.now and then figure out when the weekdays are in proximity to the current date

	// takes a Date object and a string that's not formatted on bannerweb and returns the date with the time tacked on
	var addHoursAndMinutes = function(date, time) {
		var timestrings = time.split(' '); // gives you an array of 2, time and am or pm
		var hourandminute = timestrings[0].split(":");
		var hour = parseFloat(hourandminute[0]);
		if (timestrings[1] === "pm" && hour !== 12) hour += 12;
		var minute = parseFloat(hourandminute[1]);
		date.setHours(hour);
		date.setMinutes(minute);
		return date; // technically since it's a reference we don't need to return but it's easier for me to read like this
	}

	if (arr.length <= 0) return;
	window.cal = ics(); // build a cal
	for (var i = 0; i < arr.length; i++) {
		// see if we have a table element with a link inside it (link text has course info on it)
		if (arr[i].children[0] && arr[i].children[0].tagName.toLowerCase() === "a") {
			var parentChildren = Array.prototype.slice.call(arr[i].parentElement.children);
			var dayOfWeek = parentChildren.indexOf(arr[i]) -1; // 0 is Monday, 6 is Sunday, bannerweb is weird
			// now convert a bannwerb date to a w3c spec'd date
			if (dayOfWeek === 6) dayOfWeek = 0; // sunday becomes last
			else dayOfWeek+= 1;
			// all the other days get a little bigger since Sunday dipped past monday

			// build a Date object based off of monday
			var workingDate = new Date(monday.getTime()); // getTime() returns a date expressed as a huge number
			// done this way because Date's have no native clone method, but this gets the job done
			var workingDay = workingDate.getDay();
			var distance = dayOfWeek - workingDay;
			//var distance = workingDay - dayOfWeek;
			// essentially we scraped Monday off the page, then tack on whatever day the DOM says a particular class is on 
			workingDate.setDate(workingDate.getDate() + distance); 

			var calItem = arr[i].children[0].innerHTML.split("<br>");

			// yank crap out of the DOM
			var course = calItem[0];
			var description = calItem[1];
			var location = calItem[3];
			var times = calItem[2].split("-"); // contains two strings with start and end times 


			// "clone" two new Date() objects
			var start = addHoursAndMinutes(new Date(workingDate.getTime()), times[0]);
			var end = addHoursAndMinutes(new Date(workingDate.getTime()), times[1]);
			
			// take wpi course data and build an ICS object 
			var rrule = {
				freq: "WEEKLY",
				until: termend,
				interval: 1 // repeat every week... setting to 2 would do 2 weeks... etc
			}
			// now that we have everything in place, add it to cal
			cal.addEvent(course, description, location, start, end, rrule);
		}
	}	
	cal.download();
}
var btn = document.createElement("input");
btn.id = "insertedbtn";
if (document.getElementById("insertedbtn")!== null || document.URL.indexOf("pls/prod/bwskfshd") === -1) return; // super lazy
btn.type = "button";
btn.value = "Download Schedule!!!";
btn.onclick = function(){window.makeSchedule()};
btn.style.width = "100%";
btn.style.height = "200px";
document.body.children[0].insertBefore(btn);
btn.style.fontSize = "32pt";
var anon = function() { btn.style.backgroundColor = window.randomCSSColor();window.setTimeout(anon, 500);}
anon();
} , true);