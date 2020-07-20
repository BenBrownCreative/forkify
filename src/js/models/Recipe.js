import axios from 'axios';
import * as config from '../config';



export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${config.baseURL}/search?r=${config.recipeURL}${this.id}&app_id=${config.apiAppID}&app_key=${config.apiKey}`);
            //this.result = res.data.recipes;
            const r = res.data[0];
            this.title = r.label;
            this.author = r.source;
            this.img = r.image;
            this.url = r.source_url;
            this.ingredients = r.ingredients;
        }
        catch (error) {
            alert('Could not get recipe');
            console.log(error);
        }
    }

    calcTime() {
        // we are assuming we need 15 min per 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15

    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']; // destructruing

        const newIngredients = this.ingredients.map(el => {
            // uniform units
            let ingredient = el.text.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, units[i]);
            })
            // remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\)|[*]|[•] */g,' ').trim();

            // parse ingredients into count, unit and ingredient
            let arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // found a unit
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count, // this is equal to count: count
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')  // this is equal to ingredient: ingredient
                }


            } else if (parseInt(arrIng[0], 10)) {
                // no unit but first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                // there is no unit and no number in first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient  // this is equal to ingredient: ingredient
                }
            } 
            
            return objIng;

        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // servings
        const newServings = type ==='dec' ? this.servings - 1 : this.servings + 1;

        // ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings);
        })
        this.servings = newServings;
    }
}