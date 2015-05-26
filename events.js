function dragSelect() {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.executeScript(null, {file: "content_script.js"});
    });
}

chrome.browserAction.onClicked.addListener(dragSelect);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.downloads.download({url: request.url});
  sendResponse({result: "ok"});
});