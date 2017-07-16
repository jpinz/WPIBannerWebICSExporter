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
		console.log("Downloading Schedule");//Just log to start downloading
		var arr = $( "div.pagebodydiv" ).find("table.datadisplaytable");//The array containing all of the data
		var length = arr.length / 2;

		// takes a Date object and a string that's not formatted and returns the date with the time tacked on
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

		if (length <= 0) return;//If length of array is empty, don't do anything
		window.cal = ics(); // build a cal
		for (var i = 0; i < arr.length; i += 2) {
			var title = arr[i].caption.textContent;
			var index = title.indexOf(" - ");
			var course = title.substring(index + 3);
			course = course.substring(0, course.indexOf(" - "));
			title = title.substring(0, index);
			var body = arr.find("tbody")[i];
			var crn = $(body.rows[1]).find("td")[0].textContent;

			var schedule = arr.find("tbody")[i+1];
			for (var j = 1; j < schedule.rows.length; j++) {
				var times = $(schedule.rows[j]).find("td")[1].textContent.split(" - ");
				var days = $(schedule.rows[j]).find("td")[2].textContent.split("");
				var dateRange = $(schedule.rows[j]).find("td")[4].textContent.split(" - ");
				var startdate = dateRange[0];
				var enddate = dateRange[1];
				var location = $(schedule.rows[j]).find("td")[3].textContent;
				var classType = $(schedule.rows[j]).find("td")[5].textContent;
				var instructor = $(schedule.rows[j]).find("td")[6].textContent.trim();
				if(instructor === '<abbr title="To Be Announced">TBA</abbr>') instructor = "TBA";//Check to see if the instructor is TBA

				console.log( "Course Title: " + title + "\nClass Type: " + classType +"\nInstructor: " + "\nCourse: " + course +"\nInstructor: " + instructor + "\nCRN: " + crn + "\nStart and End Date: " +startdate + " - " + enddate + "\nLocation: " + location + "\nStart Time: " + times[0] + "\nEnd Time: " + times[1]);
				
				// build a Date object based off the first day of the class.
				var starting = new Date(startdate);//Make a Date variable based of the starting date of the class
				var ending = new Date(enddate);//Make a Date variable based of the ending date of the class
				ending.setDate(ending.getDate()+1);//The class actually meets on the last day, so add 1 to it
				var firstweek = weekDays(starting);//Get the date of each day of the week for the first week
				for(var k=0; k<days.length; k++) {
					// "clone" two new Date() objects
					var start = addHoursAndMinutes(new Date(starting.getFullYear(), starting.getMonth(), firstweek[daynum(days[k])]), times[0]);
					var end = addHoursAndMinutes(new Date(starting.getFullYear(), starting.getMonth(), firstweek[daynum(days[k])]), times[1]);

					// take wpi course data and build an ICS object 
					var rrule = {
						freq: "WEEKLY",
						dtstart: starting, //Doesnt seem to be working
						until: ending,	
						interval: 1 // repeat every week... setting to 2 would do 2 weeks... etc
					}
					var description = "<b>Instructor:</b> " + instructor + "<br><b>Class Type:</b> " + classType + "<br><b>Course:</b> " + course + "<br><b>CRN:</b> " + crn;//Construct the Description of the course with the data.
					cal.addEvent(title, description, location, start, end, rrule);//Now that we have everything in place, add it to calendar
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