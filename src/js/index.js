// controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/list';
import Likes from './models/likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

// Global state of the app
// * search object
// * current recipe object
// * shopping list object
// * liked recipes
const state = {};

// Search controller
const controlSearch = async () => {
    // get query from view

    const query = searchView.getInput(); 
    //const query = 'pizza'; // for testing

    if (query) {
        // new search object and add to state
        state.search = new Search(query);

        // prepare ui for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // search for recipes
        try {
            await state.search.getResults();
            // render results on ui
            clearLoader();
            searchView.renderResults(state.search.recipes);

        } catch(error) {
            alert('something bad has happened');
            console.log(error);
            clearLoader();
        }
        
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// for testing
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const gotToPage = parseInt(btn.dataset.goto, 10); // base 10
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, gotToPage);
    }
});

// recipe controller

const controlRecipe = async () => {
    // get id from url
    const id = window.location.hash.replace('#', '');
    if (id) {
        // prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected search item
        if (state.search) searchView.hightlightSelected(id);

        // create new recipe object 
        state.recipe = new Recipe(id);
        // testing
        //window.r = state.recipe;

        // get recipe data
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch(error) {
            alert('Error getting recipe');
        }
        
    }
}


// list controller
const controlList = () => {
    // create new list if there is not one yet
    if (!state.list) state.list = new List();

    // add each ingredient to the list and ui
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}


// like controller

const controlLike = () => {
    // create new like list if there is not one yet
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // user has not liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )

        // toggle the like button
        likesView.toggleLikeBtn(true);

        // add like to the ui
        likesView.renderLike(newLike);
    
    // user has liked current recipe
    } else {
        // remove like to the state
        state.likes.deleteLike(currentID);

        // toggle the like button
        likesView.toggleLikeBtn(false);

        // remove like to the ui
        likesView.deleteLike(currentID);


    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// restore liked recipes on page load
window.addEventListener('load', () => {

    state.likes = new Likes(); 

    // restore likes
    state.likes.readStorage();

    // toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes()); 
    
    // render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
    
});

// loop through events you want to call control Recipe
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// handle delete and update list item events
elements.shopping.addEventListener('click', el => {
    const id = el.target.closest('.shopping__item').dataset.itemid;

    // handle delet button
    if (el.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);
        // delete from ui
        listView.deleteItem(id);

    //handle count update
    } else if (el.target.matches('.shopping__count-value')) {
        const val = parseFloat(el.target.value, 10);
        state.list.updateCount(id, val);
    }
})

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    // decrease button is clicked
    if (e.target.matches('.btn-decrease, .btn-decrease *')) { // * means any of its children
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        // decrease button is clicked
    } else if (e.target.matches('.btn-increase, .btn-increase *')) { // * means any of its children
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }  
    // add recipe to list
    else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        // like controller
        controlLike();
    }

});

