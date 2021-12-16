upDate();
document.querySelector('.notification__form button').addEventListener('click', function () {
  let time = document.querySelector('.notification__form input').value;
  let message = document.querySelector('.notification__form textarea').value;

  let info = document.querySelector('.notification__info');

  if (!time || !message) {
    info.textContent = "Укажите полную информацию!";
    info.style.opacity = 1;
    setTimeout(() => {
      info.style.opacity = 0;
    }, 2000);
    setTimeout(() => {
      info.textContent = "";
    }, 3000);
    return;
  }
  localStorage.setItem(time, message);
  upDate();

});

document.querySelector('.notification__list > button').addEventListener('click', () => {
  if (localStorage.length && confirm("Очистить список уведомлений?")) {
    localStorage.clear();
    upDate();
    document.querySelector('.notification__list').hidden = true;
  } else if (!localStorage.length) {
    alert("У Вас нет уведомлений!")
  }
});

function upDate() {
  if (!localStorage.length) {
    document.querySelector('.notification__list').hidden = true;
  } else {
    document.querySelector('.notification__list').hidden = false;
  }
  document.querySelector('.notification__list > div').innerHTML = '';
  document.querySelector('.notification__info').textContent = '';
  for (let key of Object.keys(localStorage)) {
    document.querySelector('.notification__list > div').insertAdjacentHTML('beforeend', `
    <div class="notification__item">
    <div>${key} - ${localStorage.getItem(key)}</div>
    <button data-time="${key}">&times</button>
    </div>
    `)
  }
  document.querySelector('.notification__form input').value = '';
  document.querySelector('.notification__form textarea').value = '';
  if (document.querySelector('.audioAlert')) {
    let audio = document.querySelector('.audioAlert');
    audio.remove();
  };
}

document.querySelector('.notification__list').addEventListener('click', (e) => {
  if (!e.target.dataset.time) {
    return
  }
  localStorage.removeItem(e.target.dataset.time);
  upDate();
});

setInterval(() => {
  let currentDate = new Date();
  let currentHour = currentDate.getHours();
  if (currentHour < 10) {
    currentHour = '0' + currentHour;
  };
  let currentMinute = currentDate.getMinutes();
  if (currentMinute < 10) {
    currentMinute = '0' + currentMinute;
  };
  let currentTime = `${currentHour}:${currentMinute}`;
  for (let key of Object.keys(localStorage)) {
    let keyHour = key.split(':')[0];
    let keyMinute = key.split(':')[1];
    if (key == currentTime || (keyHour == currentHour && keyMinute < currentMinute)) {
      document.querySelector(`button[data-time="${key}"]`).closest('.notification__item').classList.add('notification__warning');
      if (!document.querySelector('.audioAlert')) {
        document.querySelector('body').insertAdjacentHTML('afterbegin', '<audio loop class="audioAlert"><source src="../source/alert-2.mp3" type="audio/mpeg"></audio>');
        document.querySelector('.audioAlert').play();
      }
    };
  }
}, 1000)