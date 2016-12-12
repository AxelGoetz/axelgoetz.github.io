var id = 0;
var message = "";
var chatContainer = document.getElementById('chat-container');
var ACCESSTOKEN = 'e3fa11a3a2e34cdd91dc67dc7a947e56';

init();

function init() {
  initInput();
  initButtons();
  beginConversation();
}

function initInput() {
  var inputText = document.getElementById('input-text');

  inputText.addEventListener('onclick', checkVisibilityPlaceHolder);
  inputText.addEventListener('keyup', keyUpEvent);
  inputText.addEventListener('keydown', keyDownEvent);

  inputText.setAttribute('contenteditable', false); // Disable until beginConversation is done
}

function initButtons() {
  var sendButton = document.getElementById('send-button');
  sendButton.onclick = function() {
    var inputText = document.getElementById('input-text');
    var text = inputText.innerText;
    sendMessage(text);
    document.getElementById('input-text').innerHTML = "";
    checkVisibilityPlaceHolder.call(inputText);
    scrollToBottom();
  };
}

function checkVisibilityPlaceHolder() {
  var placeholder = document.getElementById('input-placeholder');
  if(this.innerHTML !== '') {
    placeholder.style.visibility = 'hidden';
  } else {
    placeholder.style.visibility = 'visible';
  }
}

function keyUpEvent(e) {
  var code = (e.keyCode ? e.keyCode : e.which);
  if(code == 13) { // Enter
    var inputText = document.getElementById('input-text');
    var text = inputText.innerText;

    sendMessage(text);
    inputText.innerHTML = "";

    scrollToBottom();
  }
  checkVisibilityPlaceHolder.call(this);
}

function keyDownEvent(e) {
  var code = (e.keyCode ? e.keyCode : e.which);
  if(code == 13) { // Enter
    return false;
  }
  return true;
}

function sendMessage(text) {
  var newText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Checking for whitespace
  if(/\S/.test(newText) && newText != "&lt;div&gt;&lt;br&gt;&lt;/div&gt;") {
    chatContainer.innerHTML += getMessage(newText, id, false, true);
    setResponse(text);
  }
}

function beginConversation() {
  currentFunction = beginConversation;
  if(id === 0) {
    message = "Hi there, welcome to Axel Goetz' personal website :-)";
    animateResponse(1500);
  } else if(id === 1) {
    message = "I'm here to guide you around so if there is anything you need, just let me know!";
    message += "</br>To get you started, here are some of the things that I can do:";
    animateResponse(2000);
  } else {
    document.getElementById("input-text").setAttribute('contenteditable', true);
  }
}

function animateResponse(timeout) {
  var loading = getLoading();
  var loadingMessage = getMessage(loading, id, true, false);
  chatContainer.innerHTML += loadingMessage;
  setTimeout(replaceLoading, timeout);
}

function replaceLoading() {
  var elem = document.getElementById(id);
  elem.getElementsByClassName("chat-message")[0].innerHTML = message;
  elem.getElementsByClassName("chat-bubble")[0].innerHTML += getMeta();
  id++;
  beginConversation();
}

/**
 * Gets the HTML of a new message
 * @param  {String}  text        Text in bubble
 * @param  {String}  id          If you want to give your message an id
 * @param  {Boolean} isLeft      If the chat appears on the left
 * @param  {Boolean} includeMeta If you want to include meta
 * @return {String}
 */
function getMessage(text, id, isLeft, includeMeta) {
  var message = '<div class="message-wrapper" id="' + id + '">';
  message += '<div class="chat-bubble ';

  if(isLeft)  message += 'chat-left">';
  else        message += 'chat-right">';

  message += '<div class="chat-message">';
  message += text;
  message += '</div>';

  if(includeMeta) {
    message += getMeta(!isLeft);
  }
  message += '</div>';

  return message;
}

/**
 * You don't want to include the tag when sending
 */
function getMeta(includeTag) {
  var message = '<div class="meta-data"><div class="chat-time">';
  var date = new Date();
  if(date.getHours() < 10) message += "0";
  message += date.getHours() + ':';
  if(date.getMinutes() < 10) message += "0";
  message += date.getMinutes() + '</div>';
  if(includeTag) {
    message += '<i class="fa fa-check" aria-hidden="true"></i>';
  }
  message += '</div></div>';

  return message;
}

function getLoading() {
  var message = '<div class="loading"><div class="loading-dot"></div>';
  message += '<div class="loading-dot"></div><div class="loading-dot"></div></div>';
  return message;
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ---------------------------------------
// Respond to queries

function animateLoading(id) {
  var loading = getLoading();
  var loadingMessage = getMessage(loading, id, true, false);
  chatContainer.innerHTML += loadingMessage;
}

function getResponse() {
  // TODO: Query website for appropriate response
  var result = JSON.parse(this.xhr.responseText);
  var message = result.result.fulfillment.speech;

  var elem = document.getElementById(this.id);
  elem.getElementsByClassName("chat-message")[0].innerHTML = message;
  elem.getElementsByClassName("chat-bubble")[0].innerHTML += getMeta();
  id++;
}

function setResponse(text) {
  id++;
  animateLoading(id);
  sendQuery(text, id);
}

// ---------------------------------------
// Query API

function sendQuery(text, id) {
  var url = "https://api.api.ai/v1/query?v=20150910";
  var xhr = createQuery("POST", url);
  if (!xhr) {
    // TODO: Cannot make query so need to set a response
    return;
  }

  xhr.setRequestHeader("Authorization", "Bearer " + ACCESSTOKEN);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

  this.xhr = xhr;
  this.id = id;

  xhr.onload = getResponse.bind(this);
  xhr.onerror = function() {
    console.log('Failed to make request');
  };

  var json = '{"query": "' + text + '",';
  json += '"lang": "en", "sessionId": "1234567890"}';

  console.log(json);

  xhr.send(json);
}

function createQuery(method, url) {
  var xhr = new XMLHttpRequest();

  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}
