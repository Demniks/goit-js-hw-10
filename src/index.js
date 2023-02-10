import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry() {
  let countryName = input.value.trim();
  if (countryName === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  } else {
    fetchCountries(countryName)
      .then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          countryList.innerHTML = '';
          return;
        } else if (data.length > 1) {
          updateCountryList(data);
          countryInfo.innerHTML = '';
        } else {
          countryList.innerHTML = '';
          countryCard(...data);
        }
      })
      .catch(error => {
        console.log('error in catch', error);
      });
  }
}

function createMarkUp(array) {
  return `<li class = "list-item">
    <img class="list-item__flag" 
    src="${array.flags.svg}" 
    alt="${array.name.official}" 
    width=30 
    height=30>
    <p class = "list-item__info">${array.name.common} (${array.name.official})</p>
    </li>`;
}

function updateCountryList(allArray) {
  const result = allArray.reduce((acc, array) => acc + createMarkUp(array), '');
  return (countryList.innerHTML = result);
}

function countryCard(array) {
  return (countryInfo.innerHTML = `
    <h1 class="country-title">
    <img 
    class="flag-list" 
    src="${array.flags.svg}" 
    alt="${array.name.official}" 
    width=30 
    height=20>${array.name.official}</h1>
    <ul>
    <li class="info-item">Capital: <span class="info-text">${
      array.capital
    }</span></li>
    <li class="info-item">Population: <span class="info-text">${
      array.population
    }</span></li>
    <li class="info-item">Languages: <span class="info-text">${Object.values(
      array.languages
    )}</span></li>
    </ul>
    `);
}
