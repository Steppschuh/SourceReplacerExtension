var pageSource = null;

function log(message) {
  console.log(message);
}

function onWindowLoad() {
  refreshPageSource();
}

function replacePageSource() {
  
}

function refreshPageSource() {
  pageSource = null;
  getPageSource();
}

function getPageSource() {
  if (pageSource != null) {
    return pageSource;
  }

  var message = document.querySelector('#message');
  chrome.tabs.executeScript(null, {
    file: "script_source.js"
  }, function() {
    if (chrome.extension.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
    }
  });
  return "loading";
}

chrome.extension.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
    pageSource = request.source;
    log("Page source received");
  }
});



window.onload = onWindowLoad;