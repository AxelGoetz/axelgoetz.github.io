var id = 0;
var message = "";
var currentFunction;
var chatContainer = document.getElementById('chat-container');

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
}

function initButtons() {
  var sendButton = document.getElementById('send-button');
  sendButton.onclick = function() {
    var inputText = document.getElementById('input-text');
    var text = inputText.innerHTML;
    sendMessage(text);
    document.getElementById('input-text').innerHTML = "";
    checkVisibilityPlaceHolder.call(inputText);
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
    var text = inputText.innerHTML;

    // Get rid of enter
    text = text.substring(0, text.length - 15);
    sendMessage(text);
    inputText.innerHTML = "";
  }
  checkVisibilityPlaceHolder.call(this);
}

function sendMessage(text) {
  text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Checking for whitespace
  if(/\S/.test(text) && text != "&lt;div&gt;&lt;br&gt;&lt;/div&gt;") {
    chatContainer.innerHTML += getMessage(text, id, false, true);
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
    currentFunction = null;
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
  currentFunction();
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
