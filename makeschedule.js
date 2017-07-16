document.addEventListener('load', function(){
	//TODO: make it so that classes arent made before start date
	var weekDays = function(startday){
		startdaynum = startday.getDay();
		if(startdaynum===1)return[startday.getDate(),startday.getDate()+1,startday.getDate()+2,startday.getDate()+3,startday.getDate()+4];//Monday
		if(startdaynum===2)return[startday.getDate()-1,startday.getDate(),startday.getDate()+1,startday.getDate()+2,startday.getDate()+3];//Tuesday
		if(startdaynum===3)return[startday.getDate()-2,startday.getDate()-1,startday.getDate(),startday.getDate()+1,startday.getDate()+2];//Wednesday
		if(startdaynum===4)return[startday.getDate()-3,startday.getDate()-2,startday.getDate()-1,startday.getDate(),startday.getDate()+1];//Thursday
		if(startdaynum===5)return[startday.getDate()-4,startday.getDate()-3,startday.getDate()-2,startday.getDate()-1,startday.getDate()];//Friday
	}

	var daynum = function(letter){
		if(letter === "M") return 0;//Return 0 if the schedule says M for Monday
		if(letter === "T") return 1;//Return 1 if the schedule says T for Tuesday
		if(letter === "W") return 2;//Return 2 if the schedule says W for Wednesday
		if(letter === "R") return 3;//Return 3 if the schedule says R for Thursday
		if(letter === "F") return 4;//Return 4 if the schedule says F for Friday
	}

	window.makeSchedule = function(){
		console.log("Button Clicked");//Just log to start downloading
		var arr = document.getElementsByClassName('datadisplaytable')[1];//hardcoded to find the 2nd (0 based remember!) table on the page, should be the schedule
		//console.log(arr);
		
		// takes a Date object and a string that's not formatted and returns the date with the time tacked on
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

		if (arr.length <= 0) return;//If length of array is empty, don't do anything
		window.cal = ics(); // build a cal
		for (var i = 1; i < arr.rows.length; i++) {
			//console.log("arr len "+ arr.rows.length);
			//console.log("Looping array, " + i + ".");
			//console.log(arr.children[0].children[i]);
			if(arr.children[0].children[i].children[3].innerHTML === "<b>Total Credits:</b>");//Make sure to stop on the last row of the table
			else if (arr.children[0].children[i]){
				//console.log("0: " + arr.children[0].children[i].children[0].innerHTML);
				if(arr.children[0].children[i].children[0].innerHTML !== "&nbsp;")var crn = arr.children[0].children[i].children[0].innerHTML;//Get the CRN of the course
				if(arr.children[0].children[i].children[1].innerHTML !== "&nbsp;")var course = arr.children[0].children[i].children[1].innerHTML;//Get the Data of the course
				if(arr.children[0].children[i].children[2].innerHTML !== "&nbsp;")var coursetitle = arr.children[0].children[i].children[2].innerHTML;//Get the Title of the course
				var startdate = arr.children[0].children[i].children[6].innerHTML;//Get the starting date of the course
				var enddate = arr.children[0].children[i].children[7].innerHTML;//Get the ending date of the course
				var days = arr.children[0].children[i].children[8].innerHTML.split("");//Get an array of the weekdays the course meets on
				var times = arr.children[0].children[i].children[9].innerHTML.split(" - ");//Get the start and end time of the class, spaces are important
				var location = arr.children[0].children[i].children[10].innerHTML;//Get the location of the course
				var instructor = arr.children[0].children[i].children[11].innerHTML;//Get the instructor of the course
				if(instructor === '<abbr title="To Be Announced">TBA</abbr>') instructor = "TBA";//Check to see if the instructor is TBA
				//console.log( "Course Title: " + coursetitle + "\nCourse: " + course +"\nInstructor: " + instructor + "\nCRN: " + crn + "\nStart and End Date: " +startdate + " " + enddate + "\nLocation: " + location + "\nStart Time: " + times[0] + "\nEnd Time: " + times[1]);
				
				// build a Date object based off the first day of the class.
				var starting = new Date(startdate);//Make a Date variable based of the starting date of the class
				var ending = new Date(enddate);//Make a Date variable based of the ending date of the class
				ending.setDate(ending.getDate()+1);//The class actually meets on the last day, so add 1 to it
				var firstweek = weekDays(starting);//Get the date of each day of the week for the first week
				for(var j=0; j<days.length; j++) {
					// "clone" two new Date() objects
					var start = addHoursAndMinutes(new Date(starting.getFullYear(), starting.getMonth(), firstweek[daynum(days[j])]), times[0]);
					var end = addHoursAndMinutes(new Date(starting.getFullYear(), starting.getMonth(), firstweek[daynum(days[j])]), times[1]);

					// take wpi course data and build an ICS object 
					var rrule = {
						freq: "WEEKLY",
						dtstart: starting, //Doesnt seem to be working
						until: ending,	
						interval: 1 // repeat every week... setting to 2 would do 2 weeks... etc
					}
					var description = "Instructor: " + instructor + "\\nCourse: " + course + "\\nCRN: " + crn;//Construct the Description of the course with the data.
					cal.addEvent(coursetitle, description, location, start, end, rrule);//Now that we have everything in place, add it to calendar
				}
			}
		}
		cal.download("WPI Schedule (" + starting.getFullYear() + ")");//comment this out for debugging
	}
	console.log("Hello, WPI")//Just to confirm the code works
	var btn = document.createElement("input");
	btn.id = "insertedbtn";
	if (document.getElementById("insertedbtn")!== null || (document.title).trim() != "Student Detail Schedule") return;//If the button is not there or the title is not the right title then return nothing and exit.
	btn.type = "button";
	btn.value = "Download your WPI schedule!";
	btn.onclick = function(){window.makeSchedule()};
	btn.style.width = "100%";
	btn.style.height = "200px";
	document.body.insertBefore(btn, document.body.children[0]);
	btn.style.fontSize = "32pt";
} , true);