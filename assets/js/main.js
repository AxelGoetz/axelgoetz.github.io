var id = 0;
var IP = '';
var map = {};
var message = "";
var chatContainer = document.getElementById('chat-container');
var ACCESSTOKEN = '557fd3c271b34d259f84254699f1542b';
var WEATHERKEY = '55ce69c2349a4ec3be4111427171202';
var NEWSKEY = 'e512748454b04be5ba472a2dd7c1ab12';

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
  var message = result.result.fulfillment.speech;

  if(message == "help") {
    message = "Are you lost? No worries I'll help!</br>";
    message += "You can just send me something and I'll try to respond. Here are some topics that I know the answer to:";
    message += getHelpMessage();
  } else if(message == 'background') {
    message = getBackgroundMessage(result.result.parameters.color);
  } else if(message == 'contact') {
    message = getContactMessage();
  } else if(message == 'weather') {
    queryAPI(id, "https://api.apixu.com/v1/current.json?key=" + WEATHERKEY + "&q=" + IP, parseWeatherData);
    return;
  } else if(message == 'about') {
    message = generateAbout();
  } else if(message == 'news') {
    queryAPI(id, 'https://newsapi.org/v1/articles?source=techcrunch&apiKey=' + NEWSKEY, parseNewsData);
    return;
  } else if(message == 'projects') {
    queryAPI(id, '/data/projects.json', parseProjectsData);
    return;
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
  var url = "https://api.api.ai/v1/query?v=20150910";
  var xhr = createQuery("POST", url);
  if (!xhr) {
    failedQuery.call(this);
    return;
  }

  xhr.setRequestHeader("Authorization", "Bearer " + ACCESSTOKEN);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

  this.xhr = xhr;
  this.id = id;

  xhr.onload = getResponse.bind(this);
  xhr.onerror = failedQuery.bind(this);
  xhr.ontimeout = failedQuery.bind(this);

  var json = '{"query": "' + text + '",';
  json += '"lang": "en", "sessionId": "1234567890"}';

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
  message += '<li>AI (deep learning)</li>';
  message += '<li>Computer Security (networking/cryptography)</li>';
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
  var message = '<div class="about">Axel is a third year BSc. Computer Science student at UCL.</br>';
  message += 'He is currently working on his thesis <a href="https://github.com/AxelGoetz/website-fingerprinting">"Automatic Feature Selection for Website Fingerprinting"</a>, which studies the use of advanced deep learning techniques to automatically select persistent features spread across time.';
  message += '</br></br>He was born in Belgium but raised in Burundi, Congo, Belgium and Dubai and currently lives in London.  </br></br>Now he spends most of time finishing his degree and working on side projects.</div>';

  return message;
}

// ---------------------------------------
// Weather

function getASCIIWeather(data) {
  var code = data.condition.code;

  // Sunny
  if(code == 1000) {
    return '   \\   /    \n     .-.     \n  ‒ (   ) ‒  \n     `-᾿     \n    /   \\    ';
  }
  // Partly Cloudy
  else if(code == 1003) {
    return '   \\        \n _ /\"\"\.-.    \n   \\_\(   ).  \n   /(___(__) ';
  }
  // Cloudy
  else if(code == 1006 || code == 1009) {
    return '     .--.    \n  .-(    ).  \n (___.__)__) ';
  }
  // Mist
  else if(code == 1030 || code == 1135 || code == 1147) {
    return  '_ - _ - _ - \n  _ - _ - _  \n _ - _ - _ - ';
  }
  // Snow
  else if(code == 1066 || code == 1114 || code == 1168 || code == 1210 || code == 1213 || code == 1261 || code == 1279) {
    return '     .-.     \n    (   ).   \n   (___(__)  \n    *  *  *  \n   *  *  *   ';
  }
  // Blizard
  else if(code == 1117 || code == 1171 || code == 1216 || code == 1219 || code == 1222 || code == 1225 || code == 1258 || code == 1264 || code == 1282) {
    return '     .-.     \n    (   ).   \n   (___(__)  \n   * * * *   \n  * * * *  ';
  }
  // Light rain
  else if(code == 1063 || code == 1069 || code == 1072 || code == 1150 || code == 1153 || code == 1180 || code == 1183 || code == 1198 || code == 1204 || code == 1240 || code == 1249 || code == 1255 || code == 1273) {
    return '     .-.     \n    (   ).   \n   (___(__)  \n    ʻ ʻ ʻ ʻ  \n   ʻ ʻ ʻ ʻ  ';
  }
  // Moderate rain
  else if(code == 1087 || code == 1186 || code == 1189 || code == 1192 || code == 1195 || code == 1201 || code == 1207 || code == 1243 || code == 1252 || code == 1276) {
    return '    .-.     \n    (   ).   \n   (___(__)  \n  ‚ʻ‚ʻ‚ʻ‚ʻ   \n  ‚ʻ‚ʻ‚ʻ‚ʻ   ';
  } else {
    return '';
  }
}

function parseWeatherData() {
  var text = '';
  if(this.xhr.responseText === '') {
    text = 'Sorry, couldn\'t get the data :(';
  } else {
    var result = JSON.parse(this.xhr.responseText);
    var data = result.current;

    text = "Ok, here are the current weather conditions: ";
    text += "It's currently <b>" + data.condition.text + " and " + data.temp_c + " °C </b>";
    text += "with a wind speed of <b>" + data.wind_kph + " " + data.wind_dir + " kmph. </b>";
    if(Math.abs(data.temp_c - data.feelslike_c) > 3) {
      text += "But it feels like <b>" + data.feelslike_c + " °C. </b>";
    }
    text += '<a class="weather" href="http://www.accuweather.com"><pre>' + getASCIIWeather(data) + '</pre></a>';
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

// ---------------------------------------
// Projects

function parseProjectsData() {
  var result = JSON.parse(this.xhr.responseText);
  result = result.data;
  var text = "Here are some of Axel's projects:<ul class='projects-chat'>";

  for(var i = 0; i < result.length; i++) {
    text += '<li><a href="/projects/' + result[i].project_id + '/">' + result[i].title + '</a>';
    if(result[i].demo_link !== undefined) {
      text += '<a href="' + result[i].demo_link + '"><i class="fa fa-globe" aria-hidden="true"></i></a>';
    } else {
      text += '<i class="fa fa-github" style="color: rgba(0, 0, 0, 0); cursor: auto" aria-hidden="true"></i>';
    }
    text += '<a href="' + result[i].github_link + '"><i class="fa fa-github" aria-hidden="true"></i></a>';
    text += '</li>';
  }
  text += '</ul>';
  text += 'For more cool projects, checkout my <a href="https://github.com/AxelGoetz">Github</a>.';

  updateText(this, text);
}
