import axios from 'axios';
import { key } from '../config';
import {fractToDecimal } from '../helpers';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title =        res.data.recipe.title;
            this.author =       res.data.recipe.publisher;
            this.img =          res.data.recipe.image_url;
            this.url =          res.data.recipe.source_url;
            this.ingredients =  res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming each 3 ingredients take 15 minutes
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g', 'lb'];

        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);                
            });

            // 2. Remove paranthesis
            //ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            ingredient = ingredient.replace(/ *\([^)]*\)/g, '');
            // 3. Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el_2 => units.includes(el_2));

            let objIng;
            if (unitIndex > -1) {
                //There is a unit
                //Ex. 4 1/2 cup => arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                //Ex. 4 cup => arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    //count = eval(arrIng[0].replace('-', '+'));
                    count = fractToDecimal(arrIng[0]);
                    //console.log(`count: ${count}`);
                } else {
                    count = fractToDecimal(arrIng.slice(0, unitIndex).join('-'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            } else if (parseInt(arrIng[0], 10)) {
                //There is no unit but the first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                //There is no unit and no number in the first position
                objIng = {
                    count: 1,
                    unit: '',
                    //ingredient: ''
                    ingredient
                };
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Update the servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        // Update the ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}