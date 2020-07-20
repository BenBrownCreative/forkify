import uniqid from 'uniqid';


export default class List {
    constructor() {
        this.items = [];
    }
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count, // same as count: count
            unit, 
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id)
        // [2, 4, 8, 9] splice(1, 2) *this returns [4, 8] original array becomes [2, 9]
        // [2, 4, 8, 9] slice(1, 2) *this returns [4, 8] original array becomes [2, 8, 9]
        // the 2nd argument is different, splice is take that many items, slice is based on position like the first argument
        this.items.splice(index, 1)
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }

}