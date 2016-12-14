var id = 0;
var IP = '';
var map = {};
var message = "";
var chatContainer = document.getElementById('chat-container');
var ACCESSTOKEN = 'e3fa11a3a2e34cdd91dc67dc7a947e56';
var WEATHERKEY = 'fecc61c1534f4e25bb3233743161312';
var NEWSKEY = 'e512748454b04be5ba472a2dd7c1ab12';

window.onload = function() { initChat(); };
initGravity();

function initChat() {
  initInput();
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
  console.log('You can contact me at: %c axel.goetz@hotmail.com', 'color: #5995f7;');
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
  // TODO: Query website for appropriate response
  var result = JSON.parse(this.xhr.responseText);
  var message = result.result.fulfillment.speech;

  if(message == "help") {
    message = "Are you lost? No worries I'll help!</br>";
    message += "You can just send me something and I'll try to respond. Here are some topics that I know the answer to:";
    message += getHelpMessage();
  } else if(message == 'background') {
    message = getBackgroundMessage();
  } else if(message == 'contact') {
    message = getContactMessage();
  } else if(message == 'weather') {
    queryAPI(id, "https://api.worldweatheronline.com/premium/v1/weather.ashx?key=" + WEATHERKEY + "&q=" + IP + "&num-of-days=1&format=json", parseWeatherData);
    return;
  } else if(message == 'about') {
    message = generateAbout();
  } else if(message == 'news') {
    queryAPI(id, 'https://newsapi.org/v1/articles?source=techcrunch&apiKey=' + NEWSKEY, parseNewsData);
    return;
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

function getBackgroundMessage() {
  var message = '<div class="background">';
  message += 'This background was a really short project of mine. It was inspired by <a href="http://vincentgarreau.com/particles.js/">particles.js</a> ';
  message += 'and the <a href="https://deepmind.com/">Deepmind website</a>. If you\'re interested, you can find more info <a href="https://agoetz.me/gravity-simulation/">here</a>.</div>';

  return message;
}

function getContactMessage() {
  var message = '<div class="contact">Here are some of the ways that you can contact Axel:</br>';
  message += '<a href="mailto:axel.goetz@hotmail.com" class="mail"><i class="fa fa-envelope" aria-hidden="true"></i><span>axel.goetz@hotmail.com</span>';
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
  var code = data.current_condition[0].weatherCode;
  if(code == 113) {
    return '\\   /    \n     .-.     \n  ‒ (   ) ‒  \n     `-᾿     \n    /   \\    ';
  } else if(code == 116 || code == 200 || code == 386) {
    return '   \\        \n _ /\"\"\.-.    \n   \\_\(   ).  \n   /(___(__) ';
  } else if(code == 119) {
    return '     .--.    \n  .-(    ).  \n (___.__)__) ';
  } else if(code == 122) {
    return '     .--.    \n  .-(    ).  \n (___.__)__) ';
  } else if(code == 143 || code == 248 || code == 260) {
    return  '_ - _ - _ - \n  _ - _ - _  \n _ - _ - _ - ';
  } else if(code == 227 || code == 320 || code == 323 || code == 326 || code == 368) {
    return '     .-.     \n    (   ).   \n   (___(__)  \n    *  *  *  \n   *  *  *   ';
  } else if(code == 230 || code == 329 || code == 332 || code == 338 || code == 335 || code == 371 || code == 395) {
    return '     .-.     \n    (   ).   \n   (___(__)  \n   * * * *   \n  * * * *  ';
  } else if(code == 226 || code ==  293|| code == 296 || code == 182 || code == 185 || code == 281 || code == 284 || code == 311 || code == 314 || code == 317 || code == 350 || code == 377 || code == 179 || code == 362 || code == 365 || code == 374 || code == 176 || code == 263) {
    return '     .-.     \n    (   ).   \n   (___(__)  \n    ʻ ʻ ʻ ʻ  \n   ʻ ʻ ʻ ʻ  ';
  } else if(code == 302 || code == 308 || code == 359 || code == 299 || code == 305 || code == 356 || code == 389 || code == 392) {
    return '    .-.     \n    (   ).   \n   (___(__)  \n  ‚ʻ‚ʻ‚ʻ‚ʻ   \n  ‚ʻ‚ʻ‚ʻ‚ʻ   ';
  } else {
    return '';
  }
}

function parseWeatherData() {
  var result = JSON.parse(this.xhr.responseText);
  var data = result.data;

  text = "Ok, here are the current weather conditions: ";
  text += "It's currently <b>" + data.current_condition[0].weatherDesc[0].value + " and " + data.current_condition[0].temp_C + " °C </b>";
  text += "with a wind speed of <b>" + data.current_condition[0].windspeedKmph + " " + data.current_condition[0].winddir16Point + " kmph. </b>";
  if(Math.abs(data.current_condition[0].temp_C - data.current_condition[0].FeelsLikeC) > 3) {
    text += "But it feels like <b>" + data.current_condition[0].FeelsLikeC + " °C. </b>";
  }
  text += '<pre>' + getASCIIWeather(data) + '</pre>';

  updateText(this, text);
}

function queryAPI(id, url, onload) {
  var xhr = createQuery("GET", url);
  if (!xhr) {
    failedQuery.call(this);
    return;
  }

  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");

  this.xhr = xhr;
  this.id = id;

  xhr.onload = onload.bind(this);
  xhr.onerror = failedQuery.bind(this);

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
