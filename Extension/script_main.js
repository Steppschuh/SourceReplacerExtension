var pageSource = null;

function log(message) {
  console.log(message);
}

function init() {

}

function sendRequest(data, callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
      callback(response);
    });
  });
}

function test() {
  console.log("Test");
  sendRequest({greeting: "hello"}, function(response) {
    console.log(response);
  });
}

function applySettings() {
  sendRequest({action: "applySettings", value: generateSettingsObject()}, function(response) {
    console.log(response);
  });
}

function onWindowLoad() {
  var button = document.getElementById("btn_apply");
  button.addEventListener("click", function() {
    applySettings();
  })

  //refreshPageSource();
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

function generateSettingsObject() {
  var settings = {
    activate: document.getElementById("cb_activate").checked,
    interval: 10000
  };
  return settings;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Background received message:");
  console.log(request);

  if (request.action == "getSource") {
    message.innerText = request.source;
    pageSource = request.source;
    log("Page source received");
  } else if (request.action == "getSettings") {
    sendResponse(generateSettingsObject());
  }
});

window.onload = onWindowLoad;
init();
