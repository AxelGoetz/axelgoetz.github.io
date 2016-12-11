init();

function init() {
  initInput();
}

function initInput() {
  var inputText = document.getElementById('input-text');

  inputText.addEventListener('onclick', checkVisibilityPlaceHolder);
  inputText.addEventListener('keyup', checkVisibilityPlaceHolder);
}

function checkVisibilityPlaceHolder() {
  var placeholder = document.getElementById('input-placeholder');
  if(this.innerHTML !== '') {
    placeholder.style.visibility = 'hidden';
  } else {
    placeholder.style.visibility = 'visible';
  }
}
