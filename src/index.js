// CSS rusetes import
import './css/styles.css';

// Importing search query js code
import { fetchCounrtries } from './js/fetchCountries.js';

// Importing lodash - Debounce function
import { debounce } from 'lodash';

// Importing Notiflix - Notify function
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// constant for debounce delay value
const DEBOUNCE_DELAY = 300;

// Selecting input elementm countries list, and single country display elements
const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

let switchOnce = false; // Variable for disabling notification after first popup

var listOfCountries = null; // Used in selecting country from list

// Adding functionality for search result,
// Clicking country will expand on page
const selectCountry = event => {
  event.preventDefault();

  //  Checking for valid target
  if (event.target.nodeName === 'UL') {
    return;
  }
  input.value = event.target.textContent.trim();
  handleInputValue(event.target.textContent.trim());
};

// Function dor purging current displayed data
const purgeDisplay = () => {
  info.innerHTML = '';
  list.innerHTML = '';
};

// Function for fetched data markup output
function displayData(data) {
  //   Selecting markup style depending on fetched output arrays count

  if (data.length > 10) {
    purgeDisplay();

    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length < 10 && data.length > 1) {
    purgeDisplay();

    const listMarkup = data
      .map(
        ({ name, flags }) =>
          `
             <li class="country-list__item" select-country>
               <img class="country-list__image" alt="Flag of ${name.common}" src="${flags.svg}" >
               <span class="country-list__name">${name.common}</span>
             </li>
          `
      )
      .join('');

    list.innerHTML = listMarkup;

    if (!switchOnce) {
      switchOnce = true;
      Notify.info('You can click on listed country, to show more!');
    }

    listOfCountries = document.querySelectorAll('[select-country]');
    for (const country of listOfCountries) {
      country.addEventListener('click', selectCountry);
    }
  } else if ((data.length = 1)) {
    purgeDisplay();

    const infoMarkup = data
      .map(
        ({ name, capital, population, flags, languages }) =>
          `
        <h2 class="country-info__name">${name.official}</h2>
        <img class="country-info__image" src="${flags.svg}" alt="Flag of ${
            name.common
          }" >
        <p class="country-info__capital">
          <span class="country-info__label">Capital:</span>
        ${capital}
        </p>
        <p class="country-info__population">
          <span class="country-info__label">Population:</span>
        ${population}
        </p>
        <p class="country-info__languages">
          <span class="country-info__label">Languages:</span>
          ${Object.values(languages).join(', ')}
        </p>

        `
      )
      .join('');

    info.innerHTML = infoMarkup;
  }
}

// Function for handling input value,
// and initializing fetch and markup functions
function handleInputValue() {
  fetchCounrtries(input.value.trim())
    .then(fetchedOutput => {
      displayData(fetchedOutput);
    })

    .catch(error => {
      purgeDisplay();
      Notify.failure('No results found!');
    });
}

// Initializing input listener for handler function
input.addEventListener('input', debounce(handleInputValue, DEBOUNCE_DELAY));
