document.addEventListener('load', function(){
	//TODO: make it so that classes arent made before start date
	var weekDays = function(startday){
		console.log("StartDay: " + startday);
		startdaynum = startday.getDay();
		console.log("StartDay#: " + startdaynum);
		if(startdaynum===1)return[startday.getDate(),startday.getDate()+1,startday.getDate()+2,startday.getDate()+3,startday.getDate()+4];//Monday
		if(startdaynum===2)return[startday.getDate()-1,startday.getDate(),startday.getDate()+1,startday.getDate()+2,startday.getDate()+3];//Tuesday
		if(startdaynum===3)return[startday.getDate()-2,startday.getDate()-1,startday.getDate(),startday.getDate()+1,startday.getDate()+2];//Wednesday
		if(startdaynum===4)return[startday.getDate()-3,startday.getDate()-2,startday.getDate()-1,startday.getDate(),startday.getDate()+1];//Thursday
		if(startdaynum===5)return[startday.getDate()-4,startday.getDate()-3,startday.getDate()-2,startday.getDate()-1,startday.getDate()];//Friday
	}

	var daynum = function(letter){
		if(letter === "M") return 0;
		if(letter === "T") return 1;
		if(letter === "W") return 2;
		if(letter === "R") return 3;
		if(letter === "F") return 4;
	}

	window.makeSchedule = function(){
		console.log("Button Clicked");
		var arr = document.getElementsByClassName('datadisplaytable')[1];//hardcoded to find the 2nd (0 based remember!) table on the page, should be the schedule
		console.log(arr);
		
		// takes a Date object and a string that's not formatted on bannerweb and returns the date with the time tacked on
		var addHoursAndMinutes = function(date, time) {
			var timestrings = time.split(' '); // gives you an array of 2, time and am or pm
			var hourandminute = timestrings[0].split(":");
			var hour = parseFloat(hourandminute[0]);
			if (timestrings[1] === "pm" && hour !== 12) hour += 12;
			var minute = parseFloat(hourandminute[1]);
			date.setHours(hour);
			date.setMinutes(minute);
			console.log("DATEEE: " + date);
			return date; // technically since it's a reference we don't need to return but it's easier for me to read like this
		}

		if (arr.length <= 0) return;
		window.cal = ics(); // build a cal
		for (var i = 1; i < arr.rows.length; i++) {
			console.log("arr len "+ arr.rows.length);
			console.log("Looping array, " + i + ".");
			console.log(arr.children[0].children[i]);
			if(arr.children[0].children[i].children[3].innerHTML === "<b>Total Credits:</b>");
			else if (arr.children[0].children[i]){
				console.log("0: " + arr.children[0].children[i].children[0].innerHTML);
				if(arr.children[0].children[i].children[0].innerHTML !== "&nbsp;")console.log("valid");
				if(arr.children[0].children[i].children[0].innerHTML !== "&nbsp;")var crn = arr.children[0].children[i].children[0].innerHTML;
				if(arr.children[0].children[i].children[1].innerHTML !== "&nbsp;")var course = arr.children[0].children[i].children[1].innerHTML;
				if(arr.children[0].children[i].children[2].innerHTML !== "&nbsp;")var coursetitle = arr.children[0].children[i].children[2].innerHTML;
				var startdate = arr.children[0].children[i].children[6].innerHTML;
				var enddate = arr.children[0].children[i].children[7].innerHTML;
				var days = arr.children[0].children[i].children[8].innerHTML.split("");
				var times = arr.children[0].children[i].children[9].innerHTML.split(" - ");
				var location = arr.children[0].children[i].children[10].innerHTML;
				var instructor = arr.children[0].children[i].children[11].innerHTML;
				if(instructor === '<abbr title="To Be Announced">TBA</abbr>') instructor = "TBA";

				console.log( "Course Title: " + coursetitle + "\nCourse: " + course +"\nInstructor: " + instructor + "\nCRN: " + crn + "\nStart and End Date: " +startdate + " " + enddate + "\nLocation: " + location + "\nStart Time: " + times[0] + "\nEnd Time: " + times[1]);

				// build a Date object based off the first day of the class. Assuming the first day is a thursday like it has been for the past 3 years
				var starting = new Date(startdate);
				var ending = new Date(enddate);
				ending.setDate(ending.getDate()+1);
				var firstweek = weekDays(starting);
				console.log(firstweek);
				for(var j=0; j<days.length; j++) {
					// "clone" two new Date() objects
					var start = addHoursAndMinutes(new Date(starting.getFullYear(), starting.getMonth(), firstweek[daynum(days[j])]), times[0]);
					var end = addHoursAndMinutes(new Date(starting.getFullYear(), starting.getMonth(), firstweek[daynum(days[j])]), times[1]);
					console.log("SSTART: " +start);
					console.log("EEND: " +end);
					console.log("STARTING " + enddate);
					// take wpi course data and build an ICS object 
					var rrule = {
						freq: "WEEKLY",
						dtstart: starting,
						until: ending,	
						interval: 1 // repeat every week... setting to 2 would do 2 weeks... etc
					}
					var description = "Instructor: " + instructor + "\\nCourse: " + course + "\\nCRN: " + crn;
					// now that we have everything in place, add it to cal
					cal.addEvent(coursetitle, description, location, start, end, rrule);
				}
			}
		}
		cal.download("WPI Schedule (" + starting.getFullYear() + ")");//comment this out for debugging
	}
	console.log("Hello, WPI")
	var btn = document.createElement("input");
	btn.id = "insertedbtn";
	if (document.getElementById("insertedbtn")!== null || document.URL.indexOf("pls/prod/bwskcrse") === -1) return; // super lazy
	btn.type = "button";
	btn.value = "Download your " + (new Date()).getFullYear() + " schedule!";
	btn.onclick = function(){window.makeSchedule()};
	btn.style.width = "100%";
	btn.style.height = "200px";
	document.body.insertBefore(btn, document.body.children[0]);
	btn.style.fontSize = "32pt";
} , true);