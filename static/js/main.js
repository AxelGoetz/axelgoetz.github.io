var id = 0;
var IP = '';
var map = {};
var message = "";
var chatContainer = document.getElementById('chat-container');
var NEWSKEY = '5fe9ca2161c54014afccce0fecbfff17';
var SESSION_ID = Math.random().toString(36).substr(2, 9);

window.onload = function() { initChat(); };
initGravity();

function initChat() {
  initMenu();
  initInput();
  initModals();
  initButtons();
  initLastSeen();
  logToConsole();
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

  document.getElementById('question').onclick = function() {
    var message = "Are you lost? No worries I'll help!</br>";
    message += "You can just send me something and I'll try to respond. Here are some topics that I know the answer to:";
    message += getHelpMessage();

    var elem = getMessage(message, id, true, true);
    chatContainer.innerHTML += elem;
    id++;

    scrollToBottom();
  };
}

function initLastSeen() {
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var text = "last seen today at ";
  if(h < 10) text += "0";
  text += h + ":";
  if(m < 10) text += "0";
  text += m;

  document.getElementById('last-seen').innerHTML = text;

  setTimeout(initLastSeen, 10000);
}

function initGravity() {
  init("canvas", size = [window.innerWidth, window.innerHeight], amountOfObjects = 75,
  g = 0.2, slowDown = 25.0, resize = true);
}

function setIP(json) {
  IP = json.ip;
}

function logToConsole() {
  console.log('%c Hi there!', 'font-weight: bold;');
  console.log('Hope you have fun playing around in the console. Just let me know if you break anything or just want to have a chat :)');
  console.log('You can contact me at: %c contact@agoetz.me', 'color: #5995f7;');
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
  if(code == 13 && !map[16]) { // Enter and not shift
    var inputText = document.getElementById('input-text');
    var text = inputText.innerText;
    sendMessage(text);
    inputText.innerHTML = "";

    scrollToBottom();
  }
  map[code] = false;
  checkVisibilityPlaceHolder.call(this);
}

function keyDownEvent(e) {
  var code = (e.keyCode ? e.keyCode : e.which);
  map[code] = true;
  if(code == 13 && !map[16]) { // Enter
    return false;
  }
  return true;
}

function escapeJSON(string) {
  return string.replace(/\n/g, "\\\n")
               .replace(/\'/g, "\\\'")
               .replace(/\"/g, "\\\"")
               .replace(/\&/g, "\\\&")
               .replace(/\r/g, "\\\r")
               .replace(/\t/g, "\\\t")
               .replace(/\b/g, "\\\b")
               .replace(/\f/g, "\\\f");
}

function sendMessage(text) {
  var newText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
                    .replace(/\n/g, "<br>");
  newText = checkText(newText);

  // Checking for whitespace
  if(/\S/.test(newText) && newText != "&lt;div&gt;&lt;br&gt;&lt;/div&gt;") {
    chatContainer.innerHTML += getMessage(newText, id, false, true);
    text = escapeJSON(text);
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
    message += getHelpMessage();
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
  var result = JSON.parse(this.xhr.responseText);
  var message = result.response;

  if(message == "help") {
    message = "Are you lost? No worries I'll help!</br>";
    message += "You can just send me something and I'll try to respond. Here are some topics that I know the answer to:";
    message += getHelpMessage();
  } else if(message == 'background') {
    message = getBackgroundMessage(result.result.parameters.color);
  } else if(message == 'contact') {
    message = getContactMessage();
  } else if(message == 'weather') {
    queryAPI(id, "/weather?query=" + IP, parseWeatherData);
    return;
  } else if(message == 'about') {
    message = generateAbout();
  } else if(message == 'news') {
    queryAPI(id, 'https://newsapi.org/v2/top-headlines?category=business&country=gb&apiKey=' + NEWSKEY, parseNewsData);
    return;
  } else if(message == 'projects') {
    message = getProjectText();
  } else if(message == 'time') {
    message = getTime();
  } else if(message == 'date') {
    message = getDate();
  } else if(message == 'ip') {
    message = "Your public IP is: " + IP;
  } else if(message == 'cv') {
    message = getCV();
  } else if(message == 'interests') {
    message = getInterests();
  }

  updateText(this, message);
}

function setResponse(text) {
  id++;
  animateLoading(id);
  sendQuery(text, id);
}

// ---------------------------------------
// Query API

function sendQuery(text, id) {
  var url = "/detect-intent?text=" + encodeURI(text) + "&session_id=" + SESSION_ID;
  var xhr = createQuery("GET", url);
  if (!xhr) {
    failedQuery.call(this);
    return;
  }

  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

  this.xhr = xhr;
  this.id = id;

  xhr.onload = getResponse.bind(this);
  xhr.onerror = failedQuery.bind(this);
  xhr.ontimeout = failedQuery.bind(this);

  xhr.send();
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
  xhr.timeout = 8000;
  return xhr;
}

function failedQuery() {
  var text = "I'm sorry but something went wrong :(";

  elem = document.getElementById(this.id);
  elem.getElementsByClassName("chat-message")[0].innerHTML = text;
  elem.getElementsByClassName("chat-bubble")[0].innerHTML += getMeta();

  elem = document.getElementById(this.id - 1);
  elem.getElementsByClassName("fa-check")[0].style = "color: #5995f7;";

  id++;

  scrollToBottom();
}

// ---------------------------------------
// Generate messages

function getHelpMessage() {
  var message = '<div class="help"><ul>';
  message += '<li>I could tell you things about Axel: What university he goes to, where he lives etc.</li>';
  message += '<li>I know how to contact him or links to his Github and social media.</li>';
  message += "<li>If you want, I can show you some of Axel's open source projects.</li>";
  message += "<li>And many other features that you will probably never use.</li>";
  message += "<li>Finally, if you're ever lost, just ask for <strong>help</strong>.</li>";
  message += "</ul></div>";
  return message;
}

function getCV() {
  var message = '<div class="cv">';
  message += 'Axel\'s CV is currently not publicly available but he might send you a copy if you contact him at ';
  message += '<a href="mailto:contact@agoetz.me" class="mail">contact@agoetz.me</a>.</div>';

  return message;
}

function getInterests() {
  var message = '<div class="interests">';
  message += 'Axel is interested in a variety of different fields. However he mainly focuses on:';
  message += '<ul>';
  message += '<li>New technologies</li>';
  message += '<li>Systematic Trading</li>';
  message += '</ul>';
  message += 'But in reality he is interested in any project as long as it provides a real challenge</div>';

  return message;
}

function isValidTextColour(str) {
    //Alter the following conditions according to your need.
    if (str === "") { return false; }
    if (str === "inherit") { return false; }
    if (str === "transparent") { return false; }

    var image = document.createElement("img");
    image.style.color = "rgb(0, 0, 0)";
    image.style.color = str;
    if (image.style.color !== "rgb(0, 0, 0)") { return true; }
    image.style.color = "rgb(255, 255, 255)";
    image.style.color = str;
    return image.style.color !== "rgb(255, 255, 255)";
}

/**
 * Sets the background message if the color is not an empty string.
 * @param  {String} color CSS color description
 * @return {String}
 */
function getBackgroundMessage(color) {
  var message = '<div class="background">';
  if(color === "") {
    message += 'This background was a really short project of mine. It was inspired by <a href="http://vincentgarreau.com/particles.js/">particles.js</a> ';
    message += 'and the <a href="https://deepmind.com/">Deepmind website</a>. If you\'re interested, you can find more info <a href="https://agoetz.me/projects/gravity-simulation">here</a>.</div>';
  } else if(isValidTextColour(color)) {
    message += 'Setting the background color to ' + color + '. ';
    if(color === "white" || color === "#fff" || color === "#ffffff" || color === "rgb(255, 255, 255)" || color === "rgba(255, 255, 255, 1)") {
      message += "Although I wouldn't recommend setting it to white since I know that it wouldn't look nice.";
    }
    message += "</div>";

    document.getElementById("canvas").style.backgroundColor = color;
    document.getElementById("chat-container").style.backgroundColor = color;
  } else {
    message += "That is not a valid color. </div>";
  }

  return message;
}

function getContactMessage() {
  var message = '<div class="contact">Here are some of the ways that you can contact Axel:</br>';
  message += '<a href="mailto:contact@agoetz.me" class="mail"><i class="fa fa-envelope" aria-hidden="true"></i><span>contact@agoetz.me</span>';
  message += '</a><a href="tel:+447899337628" class="phone"><i class="fa fa-phone" aria-hidden="true"></i><span>(+44)7899337628</span></a>';
  message += 'Or you can have a look at his profile on the following websites.<a href="https://github.com/AxelGoetz" class="github"><i class="fa fa-github" aria-hidden="true"></i><span>Github</span></a>';
  message += '<a href="https://www.linkedin.com/in/axel-goetz-09427598" class="linkedin"><i class="fa fa-linkedin" aria-hidden="true"></i><span>Linkedin</span></a>';
  message += '  <a href="https://facebook.com/axel.goetz9" class="facebook"><i class="fa fa-facebook" aria-hidden="true"></i><span>Facebook</span></a>And here is his website... Oh wait, you\'re already here...</div>';

  return message;
}

function generateAbout() {
  var message = '<div class="about">Axel is a quantative developer at Millennium Partners.</br>'
  message += 'He graduated from UCL with a BSc. in Computer Science.</br>';
  message += '</br>He was born in Belgium but raised in Burundi, Congo, Belgium and Dubai and currently lives in London.</div>';

  return message;
}

// ---------------------------------------
// Weather

function parseWeatherData() {
  var text = '';
  if(this.xhr.responseText === '') {
    text = 'Sorry, couldn\'t get the data :(';
  } else {
    var result = JSON.parse(this.xhr.responseText);
    var data = result.current;

    text = "Ok, here are the current weather conditions: ";
    text += "It's currently <b>" + data.weather_descriptions[0] + " and " + data.temperature + " °C </b>";
    text += "with a wind speed of <b>" + data.wind_speed + " " + data.wind_dir + " kmph. </b>";
    if(Math.abs(data.temperature - data.feelslike) > 3) {
      text += "But it feels like <b>" + data.feelslike + " °C. </b>";
    }
  }

  updateText(this, text);
}

function queryAPI(id, url, onload) {
  var xhr = createQuery("GET", url);
  if (!xhr) {
    failedQuery.call(this);
    return;
  }

  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

  this.xhr = xhr;
  this.id = id;

  xhr.onload = onload.bind(this);
  xhr.onerror = failedQuery.bind(this);
  xhr.ontimeout = failedQuery.bind(this);

  xhr.send();
}

function updateText(that, text) {
  elem = document.getElementById(that.id);
  elem.getElementsByClassName("chat-message")[0].innerHTML = text;
  elem.getElementsByClassName("chat-bubble")[0].innerHTML += getMeta();

  elem = document.getElementById(that.id - 1);
  elem.getElementsByClassName("fa-check")[0].style = "color: #5995f7;";

  id++;

  scrollToBottom();
}

function getTime() {
  var message = "The current time is ";
  var date = new Date();
  message += date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  message += ':';
  message += date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

  return message;
}

function getDate() {
  var message = "Today's date is ";
  var date = new Date();
  message += date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  message += '/';
  message += date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  message += '/';
  message += date.getFullYear();

  return message;
}
// ---------------------------------------
// News

function parseNewsData() {
  var result = JSON.parse(this.xhr.responseText);

  var text = "Here is the news for today:<ul class='news'>";
  for(var i = 0; i < 7 && i < result.articles.length; i++) {
    if(result.articles[i].title == "Crunch Report") continue;
    text += '<li><a href=' + result.articles[i].url +'>' + result.articles[i].title + '</a></li>';
  }
  text += '</ul>';

  updateText(this, text);
}

// ---------------------------------------
// Menu

function initMenu() {
  window.onclick = windowOnClick;
  document.getElementById('clear-messages').onclick = function() { chatContainer.innerHTML = ''; };
}

function showMenu() {
  document.getElementById("menu-dropdown").classList.toggle("show");
}

function windowOnClick(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('#menu')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// ---------------------------------------
// Modals

function initModals() {
  initModal('modal-credit', 'credit-button');
  initModal('modal-help', 'help-button');
  initModal('modal-website', 'website-button');
}

function initModal(modalID, btnID) {
  var modal = document.getElementById(modalID);
  var btn = document.getElementById(btnID);
  var span = modal.getElementsByClassName("close")[0];

  btn.onclick = function() {
      modal.style.display = "block";
  };

  span.onclick = function() {
      modal.style.display = "none";
  };
}

function checkText(text) {
  while(text.slice(-4, text.length) == '<br>') {
    text = text.slice(0, -4);
  }
  return text;
}

function getProjectText() {
  return 'A list of some of my (old) open-source projects can be found on my <a href="https://github.com/AxelGoetz">Github</a>.';
}