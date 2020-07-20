// controls the ui for search

import { elements } from './base';
import { create } from 'domain';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => { 
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = ''
}

export const hightlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__links--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__links--active');
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        // split the title into words using the spaces grouped in a new array
        // reduce itterates over the array
        title.split(' ').reduce((acc, cur) => { // cur is the current array item
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length; //  the return value updates the accumulator
        }, 0); // pass in the accumulator
        return `${newTitle.join(' ')} ...`; // join puts the string back together with spaces
    }
    return title;
}

const renderRecipe = recipe => {
    const getID = (uri) => uri.split('#')[1];
    const markup = `
    <li>
        <a class="results__link" href="#${getID(recipe.uri)}">
            <figure class="results__fig">
                <img src="${recipe.image}" alt="${recipe.label}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.label)}</h4>
                <p class="results__author">${recipe.source}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${ type ==='prev' ? page - 1 : page + 1 }">
    <span>Page ${ type ==='prev' ? page - 1 : page + 1 }</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${ type ==='prev' ? 'left' : 'right' }"></use>
        </svg>
    </button>
`
 
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button; 
    if (page === 1 && pages > 1) {
        // only button to go to prev page
        button = createButton(page, 'next')
    }
    else if (page < pages) {
        // both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } 
    else if (page === pages) {
        // last page, only button to go to prev page
        button = createButton(page, 'prev')
    } 
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);

}