import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

let userSelectedDate = null;
let timerId = null;

flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];
    const now = new Date();

    if (!pickedDate || pickedDate <= now) {
      refs.startBtn.disabled = true;
      userSelectedDate = null;

      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    }

    userSelectedDate = pickedDate;
    refs.startBtn.disabled = false;
  },
});

refs.startBtn.addEventListener('click', onStart);

function onStart() {
  if (!userSelectedDate) return;
  if (timerId) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  updateTimerUI(convertMs(userSelectedDate - new Date()));

  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      timerId = null;

      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      refs.input.disabled = false;
      refs.startBtn.disabled = true;
      userSelectedDate = null;
      return;
    }

    updateTimerUI(convertMs(diff));
  }, 1000);
}

function updateTimerUI({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
