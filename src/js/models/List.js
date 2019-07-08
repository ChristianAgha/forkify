import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
    }

    deleteItem(id) {
        // [2, 4, 8] splice(1, 2 >>>how many elepments we want to take<<<) -> returns [4, 8], original array is [2]
        // [2, 4, 8] slice(1, 2 >>>end index, not included<<<) -> returns 4, original array is [2, 4, 8]
        this.items.splice();
    }

}