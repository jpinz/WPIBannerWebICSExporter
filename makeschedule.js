window.randomCSSColor = function() {
	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);
	return "rgb(" + r + ", " + g + ", " + b + ")";
}
document.addEventListener('load', function(){
	window.makeSchedule = function(){
		console.log("Button Clicked");
		var termend = new Date(2016, 9, 13,0,0,0,0); //TODO: Add input at the top to signify end of term
		var arr = document.getElementsByTagName('tbody')[7];//hardcoded to find the 7th table on the page, should be the schedule
		console.log(arr);
		// more hacks - trying to get this out fast
		var monday = new Date(document.getElementsByClassName("fieldlargetext")[0].innerHTML.split("Week of ")[1]);
		console.log(monday)
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
		for (var i = 1; i < arr.rows.length; i++) {
			console.log("arr len "+ arr.rows.length);
			console.log("Looping array, " + i + ".");
			// see if we have a table element with a link inside it (link text has course info on it)
			console.log(arr.children[1]);
			console.log(arr.children[1].children[2]);

			if (arr.children[i]){
				for(var j = 1; j < arr.rows.length; j++) {
					if(typeof arr.children[i].children[j] !== "undefined")
					if(typeof arr.children[i].children[j].children[0] !== "undefined" && 
					   arr.children[i].children[j].children[0].tagName.toLowerCase() === "a"){
						console.log(arr.children[i].children[j].children[0]);
					console.log("I: " + i +"\nJ: " +j);
				var parentChildren = Array.prototype.slice.call(arr.parentElement.children);
				var dayOfWeek = j-1; // 0 is Monday, 6 is Sunday, bannerweb is weird
				console.log("DAY " +dayOfWeek);
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

				var calItem = arr.children[i].children[j].children[0].innerHTML.split("<br>");

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

			}
		}		
	cal.download();
	}
	console.log("Hello, WPI")
	var btn = document.createElement("input");
	btn.id = "insertedbtn";
	if (document.getElementById("insertedbtn")!== null || document.URL.indexOf("pls/prod/bwskfshd") === -1) return; // super lazy
	btn.type = "button";
	btn.value = "Download Schedule!!!";
	btn.onclick = function(){window.makeSchedule()};
	btn.style.width = "100%";
	btn.style.height = "200px";
	document.body.insertBefore(btn, document.body.children[0]);
	btn.style.fontSize = "32pt";
	//var anon = function() { btn.style.backgroundColor = window.randomCSSColor();window.setTimeout(anon, 500);}
	anon();
} , true);