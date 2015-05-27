var toggle = false;
var on = false;

chrome.browserAction.onClicked.addListener(function (tab) {
	toggle = !toggle;
	if(toggle) {
		chrome.browserAction.setIcon({path: "icon19.png", tabId: tab.id});
		on = true;
	}
	else {
		chrome.browserAction.setIcon({path: "icon19-off.png", tabId: tab.id});
		on = false;
	}
	chrome.tabs.executeScript(tab.id, {file: "content_script.js"});
});






/*



var active = true;

function dragSelect() {
	if(active) {
		console.log("now on");
		active = true;
	    chrome.tabs.getSelected(null, function(tab) {
	      chrome.tabs.executeScript(null, {file: "content_script.js"});
	    });	
	}
	else {
		console.log("now off");
		active = false;
	}
}

chrome.browserAction.onClicked.addListener(dragSelect);*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd == "getStatus") {
		sendResponse(on);
	}
	else {
		chrome.downloads.download({url: request.url});
	}
});
