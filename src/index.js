// CSS rusetes import
import './css/styles.css';

// Importing search query js code
import { fetchCounrtries } from './js/fetchCountries.js';

// Importing lodash - Debounce function
import { debounce, values } from 'lodash';

// Importing Notiflix - Notify function
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// constant for debounce delay value
const DEBOUNCE_DELAY = 300;

// Selecting input elementm countries list, and single country display elements
const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

var listOfCountries = null; // Used in selecting country from list

// Adding functionality for search result,
// Clicking country will expand on page
const selectCountry = event => {
  event.preventDefault();
  console.log(event.target.nodeName);

  //  Checking for valid target
  if ( event.target.nodeName === "UL" ) {
    console.log("Invalid target");
    return;
  }
console.log(event.target.textContent.trim());
input.value = event.target.textContent.trim();
handleInputValue("name", event.target.textContent.trim());

};

// Function for fetched data markup output
function displayData(data) {
  //   purging current displayed data
  const purgeDisplay = () => {
    list.innerHTML = '';
    info.innerHTML = '';
  };

  //   Selecting markup style depending on fetched output arrays count
  if (data.length > 10) {
    purgeDisplay();

    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length < 10 && data.length > 1) {
    console.log(data);
    const listMarkup = data
      .map(
        ({ name, flags }) =>
          `
             <li class="country-list__item" select-country>
                <span class-"country-list__name">
                  <img class="country-list__image" src="${flags.svg}" >${name.common}
                </span>
             </li>
          `
      )
      .join('');

    list.innerHTML = listMarkup;
    listOfCountries = document.querySelectorAll('[select-country]');
    console.log(listOfCountries);
    for (const country of listOfCountries) {
      console.log(country);
      country.addEventListener('click', selectCountry);
    }
  } else if ((data.length = 1)) {
    purgeDisplay();

    const infoMarkup = data
      .map(
        ({ name, capital, population, flags, languages }) =>
          `
        <h2 class="country-info__name">${name.official}</h2>
        <img class="country-info__image" src="${
          flags.svg
        }" alt="Flag of ${name}" >
        <p class="country-info__capital">Capital: ${capital}</p>
        <p class="country-info__population>Population: ${population}</p>
        <p class="country-info__languages>Languages: ${Object.values(
          languages
        ).join(', ')}</p>

        `
      )
      .join('');
    list.innerHTML = infoMarkup;
  }
}

// Function for handling input value,
// and initializing fetch and markup functions
function handleInputValue() {
  console.log(input.value);
  fetchCounrtries('name', input.value.trim()).then(fetchedOutput => {
    console.log(fetchedOutput);
    displayData(fetchedOutput);
  });
}

// Initializing input listener for handler function
input.addEventListener('input', debounce(handleInputValue, DEBOUNCE_DELAY));

fetch('https://restcountries.com/v3.1/all');
