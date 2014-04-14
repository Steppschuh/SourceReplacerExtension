function onWindowLoad() {
  replaceElements();
}

function detectWebsite() {

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

}

function replaceFacebook() {
  console.log("Replacing DOM for Facebook");

  // Page logo
  var temp = document.getElementById("pageLogo");
  var element = temp.children[0];

  element.style.backgroundImage = "url(https://raw.githubusercontent.com/Steppschuh/SourceReplacerExtension/master/Extension/images/facebook_logo.png)";
  element.style.backgroundSize = "contain";
  element.style.backgroundRepeat = "no-repeat";
  element.style.backgroundPosition = "top left";
   
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

