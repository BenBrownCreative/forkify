// this file does our processing work

// food2fork api: ceae30e1e0b6f2ad5e81b3b6754ab49b
// https://www.food2fork.com/api/search

// axios automatically returns the json
import axios from 'axios';
import * as config from '../config';

// export default class Search {
//     constructor(query) {
//         this.query = query;
//     }

//     async getResults(query) {
//         try {
//             const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`)
//             this.result = res.data.recipes;
//         }
//         catch (error) {
//             alert(error);
//         }
//     }
    

// }

export default class Search{
    constructor(query){
        this.query = query;
    }
 
    async getResults(){
        try{
            const res = await axios(`${config.baseURL}/search?q=${this.query}&from=0&to=50&app_id=${config.apiAppID}&app_key=${config.apiKey}`);
            console.log(res);
            this.recipes = res.data.hits.map(item => item.recipe);
         //   console.log(this.recipes);
        }catch(error){
            alert(error);
        }
    }
}
