var addScript = function(filename) {
	var script = document.createElement("script");
	script.src = chrome.extension.getURL(filename);
	(document.head || document.documentElement).appendChild(script);
}

var scripts = ["jquery-3.2.1.min.js", "ics.deps.min.js", "ics.min.js", 'makeschedule.js'];
for (var i = 0; i < scripts.length; i++) addScript(scripts[i]);