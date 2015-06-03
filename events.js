var toggle = false;
var on = false;

chrome.windows.onCreated.addListener(function() {
	chrome.browserAction.setIcon({path: "icon19-off.png"});
	chrome.browserAction.setTitle({title: "Blink is off."});
	toggle = false;
	on = false;
	console.log("create. on is " + on);
	chrome.tabs.query({}, function(tabs) {
		for(var i = 0; i < tabs.length; i++) {
			if(tabs[i].url.indexOf("chrome://") == -1)	{
				console.log("here4");
				chrome.tabs.executeScript(tabs[i].id, {file: "content_script.js"});		
			}
		}
	});
})

chrome.browserAction.onClicked.addListener(function(t) {
	toggle = !toggle;
	if(toggle) {
		console.log("om");
		chrome.browserAction.setIcon({path: "icon19.png"});
		chrome.browserAction.setTitle({title: "Blink is on."});
		on = true;
	}
	else {
		console.log("off");
		chrome.browserAction.setIcon({path: "icon19-off.png"});
		chrome.browserAction.setTitle({title: "Blink is off."});
		on = false;
	}
	chrome.tabs.query({}, function(tabs) {
		for(var i = 0; i < tabs.length; i++) {
			if(tabs[i].url.indexOf("chrome://") == -1)	{
				console.log("running script " + i);
				chrome.tabs.executeScript(tabs[i].id, {file: "content_script.js"});		
			}
		}
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd == "getStatus") {
		sendResponse(on);
	}
	else {
		chrome.downloads.download({url: request.url});
	}
});