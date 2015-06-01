var toggle = false;
var on = false;

chrome.browserAction.onClicked.addListener(function(t) {
	toggle = !toggle;
	if(toggle) {
		chrome.browserAction.setIcon({path: "icon19.png"});
		chrome.browserAction.setTitle({title: "Blink is on."});
		on = true;
	}
	else {
		chrome.browserAction.setIcon({path: "icon19-off.png"});
		chrome.browserAction.setTitle({title: "Blink is off."});
		on = false;
	}
	chrome.tabs.query({}, function(tabs) {
		for(var i = 0; i < tabs.length; i++) {
			if(tabs[i].url.indexOf("chrome://") == -1)	{
				chrome.tabs.executeScript(tabs[i].id, {file: "content_script.js"});		
			}
		}
	});
});

/*
chrome.tabs.onCreated.addListener(function(tab) {
	if(tab.url.indexOf("chrome://") == -1)
		chrome.tabs.executeScript(tab.id, {file: "content_script.js"});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(tab.url.indexOf("chrome://") == -1)
		chrome.tabs.executeScript(tab.id, {file: "content_script.js"});
});*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd == "getStatus") {
		sendResponse(on);
	}
	else {
		chrome.downloads.download({url: request.url});
	}
});