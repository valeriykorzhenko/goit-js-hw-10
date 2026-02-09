import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formEl = document.querySelector('.form');

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  const delay = Number(formEl.elements.delay.value);
  const state = formEl.elements.state.value; 

  createPromise(delay, state)
    .then(delayValue => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${delayValue}ms`,
        position: 'topRight',
      });
    })
    .catch(delayValue => {
      iziToast.error({
        message: `❌ Rejected promise in ${delayValue}ms`,
        position: 'topRight',
      });
    });

  formEl.reset();
}

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}
