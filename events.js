
var toggle = false;
var on = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd == "getStatus") {
		sendResponse(on);
	}
	else {
		chrome.downloads.download({url: request.url});
	}
});

chrome.browserAction.onClicked.addListener(function(t) {
	toggle = !toggle;
	if(toggle) {
		chrome.browserAction.setIcon({path: "icon19.png"}, function() {
			on = true;	
			executeContentScript();

		});
		chrome.browserAction.setTitle({title: "Blink is on."});
	}
	else {
		chrome.browserAction.setIcon({path: "icon19-off.png"}, function() {
			on = false;
			executeContentScript();
		});
		chrome.browserAction.setTitle({title: "Blink is off."});
	}
});

function executeContentScript() {
	chrome.tabs.query({}, function(tabs) {
		for(var i = 0; i < tabs.length; i++) {
			if(tabs[i].url.indexOf("chrome://") == -1)	{
				chrome.tabs.executeScript(tabs[i].id, {file: "content_script.js"});		
			}
		}
	});
}