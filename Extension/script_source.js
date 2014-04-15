var hostUrl = "https://raw.githubusercontent.com/Steppschuh/SourceReplacerExtension/master/Extension/";
var traverseResult;

function onWindowLoad() {
  startReplaceTimer(5000);
}

function getImageUrl(image) {
  return hostUrl + "images/" + image;
}

function startReplaceTimer(interval) {
  setInterval(function(){
    replaceElements();
  }, interval);
}

function replaceElements() {
  // Replace general stuff
  replaceGeneral();

  // Detect website
  var url = document.URL;
  if (url.indexOf("facebook.com") != null) {
    replaceFacebook();
  } else {
    
  }
}

function replaceGeneral() {
  // TODO: Replace image tags
}

function replaceFacebook() {
  console.log("Replacing DOM on Facebook");

  // Page logo
  var temp = document.getElementById("pageLogo");
  var element = temp.children[0];

  element.style.backgroundImage = "url(" + getImageUrl("facebook_logo.png") + ")";
  element.style.backgroundSize = "contain";
  element.style.backgroundRepeat = "no-repeat";
  element.style.backgroundPosition = "top left";
  
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
  console.log(node);
  try {
    var tag = getTag(node.innerHTML);
    var tagValue = getTagValue(tag);
    console.log("Tag: " + tag);
    console.log("Tag value: " + tagValue);

    var insertA = document.createElement("a");
    insertA.className = "_ksh";
    insertA.setAttribute("aria-label", "Uploaded");
    insertA.setAttribute("href", "http://steppschuh.net");
    insertA.setAttribute("role", "img");
    insertA.setAttribute("target", "_blank");

    var insertImg = document.createElement("img");
    insertImg.setAttribute("src", "https://raw.githubusercontent.com/Steppschuh/SourceReplacerExtension/master/Extension/images/facebook_logo.png");

    insertA.appendChild(insertImg);
    node.appendChild(insertA);
    node.innerHTML = node.innerHTML.replace(tag, "");
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
  //console.log("Traversing: ");
  //console.log(node);
  if (node.childNodes !== undefined) {
    var childCount = node.childNodes.length;
      //console.log(childCount + " node children");
      if (childCount < 1) {
        //console.log("No more children in " + node);
      } else {
        for (var i = 0; i < childCount; ++i) {
            var child = node.childNodes[i];
            if (child.innerHTML != null) {
              if (child.innerHTML.indexOf(querry) != - 1) {
                traverseChildren(child, querry);
              }
            } else if (child.nodeValue != null) {
              if (child.nodeValue.indexOf(querry) != - 1) {
                //console.log(" - Element found");
                traverseResult.push(node);
              }
            }
        }
      }
      
  } else {
    //console.log("Childnodes undefined");
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

