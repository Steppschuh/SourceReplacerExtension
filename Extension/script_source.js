var hostUrl = "https://raw.githubusercontent.com/Steppschuh/SourceReplacerExtension/master/Extension/";
var traverseResult;

var activate = true;
var replaceTimer;
var replaceTimerInterval = 10000;

function onWindowLoad() {
  getSettings();
  startReplaceTimer();
}

function getSettings() {
  //getSettingsFromPopup();
  getSettingsFromStorage();
}

function getSettingsFromPopup() {
  console.log("Requesting settings from extension popup");
  sendRequest({action: "getSettings"}, function(response) {
    console.log("Received settings:");
    console.log(response);

    applySettingsObject(response);
  });
}

function getSettingsFromStorage() {
  console.log("Parsing settings from local storage");
  try {
    var settings = localStorage.getItem('settings');
    if (settings != null) {
      applySettingsObject(settings);
    } else {
      console.log("No settings available");
      // TODO: save default settings
    }
  } catch (ex) {
    console.log(ex);
  }
}

function saveSettings(settings) {
  localStorage.setItem('settings', JSON.stringify(settings));
}

function applySettingsObject(settings) {
  console.log("Applying settings");
  if (settings !== undefined) {
    replaceTimerInterval = settings.interval;
    activate = settings.activate;

    // Restart timer to apply interval settings
    stopReplaceTimer();
    startReplaceTimer();
  }
  
}

function sendRequest(data, callback) {
  chrome.runtime.sendMessage(data, function(response) {
    callback(response);
  });
}

function getImageUrl(image) {
  return hostUrl + "images/" + image;
}

function startReplaceTimer() {
  replaceTimer = setInterval(function(){
    replaceElements();
  }, replaceTimerInterval);
  replaceElements();
}

function stopReplaceTimer() {
  clearInterval(replaceTimer);
}

function replaceElements() {
  if (!activate) {
    return;
  }
  // Replace general stuff
  replaceGeneral();

  // Detect website
  var url = document.URL;
  if (url.indexOf("facebook.com") != -1) {
    replaceFacebook();
    replaceString("Lena Fox", "Luna");
    replaceString("Dominik Vonder Heydt", "Fischkopp");
    replaceString("Hagen Echzell", "Suffkopp");
    replaceString("Annemarie Bech", "Manni");
  } else {
    
  }
}

function replaceGeneral() {
  // TODO: Replace image tags
}

function replaceFacebook() {
  // Page logo
  var temp = document.getElementById("pageLogo");
  var element = temp.children[0];

  element.style.backgroundImage = "url(" + getImageUrl("facebook_logo.png") + ")";
  element.style.backgroundSize = "contain";
  element.style.backgroundRepeat = "no-repeat";
  element.style.backgroundPosition = "top left";
  
  replaceFacebookChatImages();
}

function replaceString(oldValue, newValue) {
  var nodes;
  var rootNode = document.body;
  nodes = findElementsContaining(rootNode, oldValue);
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.innerHTML = node.innerHTML.replace(oldValue, newValue);
  }
  if (nodes.length > 0) {
    console.log("Replaced " + oldValue + " with " + newValue + " (" + nodes.length + " matches found)");
  }
}

function replaceFacebookChatImages() {
  // Get chat windows
  var nodes;
  var chats = document.getElementsByClassName("fbDockChatTabFlyout");
  for (var c = 0; c < chats.length; c++) {
    var chat = chats[c];
    var rootNode = chat;
    nodes = findElementsContaining(rootNode, "[tag:");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      replaceTagNode(node);
    }
  }
}

function replaceTagNode(node) {
  //console.log(node);
  try {
    var tag = getTag(node.innerHTML);
    var tagValue = getTagValue(tag);
    console.log("Replacing tag: " + tagValue);

    if (tagValue === "test") {
      replaceFacebookChatImage(node, getImageUrl("optimistisch.png"));
    } else {
      replaceFacebookChatImage(node, getImageUrl(tagValue + ".png"));
    }
  } catch (ex) {
    console.log("Can't replace tag in node:");
    console.log(ex);
  }
}

function replaceFacebookChatImage(node, imageUrl) {
  try {
    var insertA = document.createElement("a");
    insertA.className = "facebookChatImageA _ksh";
    insertA.setAttribute("aria-label", "Uploaded");
    insertA.setAttribute("href", "https://github.com/Steppschuh/SourceReplacerExtension");
    insertA.setAttribute("role", "img");
    insertA.setAttribute("target", "_blank");

    var insertImg = document.createElement("img");
    insertImg.className = "facebookChatImageFull";
    insertImg.setAttribute("src", imageUrl);

    insertA.appendChild(insertImg);
    node.appendChild(insertA);
    node.innerHTML = node.innerHTML.replace(getTag(node.innerHTML), "");
  } catch (ex) {
    console.log("Can't replace tag in node:");
    console.log(ex);
  }
}

function getTag(text) {
  var tag = null;
  if (text.indexOf("[tag:") != null) {
    tag = text.substr(text.indexOf("[tag:"));
    tag = tag.substr(0, tag.indexOf("]") + 1);
  }
  return tag;
}

function getTagValue(text) {
  var tag = null;
  if (text.indexOf("[tag:") != null) {
    tag = text.substr(text.indexOf("[tag:") + 5);
    tag = tag.substr(0, tag.indexOf("]"));
  }
  return tag;
}

function findElementsContaining(node, querry) {
  traverseResult = new Array();
  traverseChildren(node, querry);
  return traverseResult;
}

function traverseChildren(node, querry) {
  if (node.childNodes !== undefined) {
    var childCount = node.childNodes.length;
      if (childCount < 1) {
      } else {
        for (var i = 0; i < childCount; ++i) {
            var child = node.childNodes[i];
            if (child.innerHTML != null) {
              if (child.innerHTML.indexOf(querry) != - 1) {
                traverseChildren(child, querry);
              }
            } else if (child.nodeValue != null) {
              if (child.nodeValue.indexOf(querry) != - 1) {
                traverseResult.push(node);
              }
            }
        }
      }
      
  }
}



function DOMtoString(document_root) {
    var html = '';
    var node = document_root.firstChild;

    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;
}

onWindowLoad();

chrome.extension.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Content script received message:");
    console.log(request);
    if (request.greeting == "hello") {
      sendResponse({farewell: "goodbye"});
    } else if (request.action == "applySettings") {
      applySettingsObject(request.value);
    }
  });
