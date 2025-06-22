import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Ingredient } from '../shopping-list/ingredient.model';
import { Meal, MealIngredient, MealType } from './meal.model';

export interface UniqueMeal {
  id: string;
  meal: Meal;
}

interface RawMealDto {
  name: string;
  type: MealType;
  imgSrc: string;
  description: string;
  nutritionFacts: {
    calories: number;
    protein: number;
    fats: number;
    carbohydrates: number;
    vitamins: string[];
    vitaminsExist: boolean;
  };
  ingredients: {
    ingredient: {
      name: string;
      price: number;
      expiration: Date;
      quantity: number;
    }[];
  };
  ingredientsExist: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MealFetchService {
  private http = inject(HttpClient);
  private mealsURL = environment.apiUrl + '/meals';

  set setUserId(id: string) {
    this.mealsURL = environment.apiUrl + '/' + id + '/meals';
  }

  private buildRawMealDto(meal: Meal): RawMealDto {
    const vitaminsArray = meal.vitaminsArray;
    const ingredientsArray = meal.ingredients;

    return {
      name: meal.name,
      type: meal.type,
      imgSrc: meal.imgSrc,
      description: meal.description,
      nutritionFacts: {
        calories: meal.nutritionFacts.calories,
        protein: meal.nutritionFacts.protein,
        fats: meal.nutritionFacts.fats,
        carbohydrates: meal.nutritionFacts.carbohydrates,
        vitamins: vitaminsArray,
        vitaminsExist: vitaminsArray.length > 0,
      },
      ingredients: {
        ingredient: ingredientsArray.map((i) => ({
          name: i.ingredient.name,
          price: i.ingredient.price,
          expiration: i.ingredient.expiration,
          quantity: i.quantity,
        })),
      },
      ingredientsExist: ingredientsArray.length > 0,
    };
  }

  public postMeal(meal: Meal) {
    return this.http.post(this.mealsURL + '.json', this.buildRawMealDto(meal), {
      observe: 'response',
    });
  }

  public getMeals() {
    return this.http
      .get<{ [key: string]: RawMealDto }>(this.mealsURL + '.json')
      .pipe(
        map((mealsResponse) => {
          const mealsArray: UniqueMeal[] = [];

          for (const mealId in mealsResponse) {
            if (mealsResponse.hasOwnProperty(mealId)) {
              const raw = mealsResponse[mealId];

              let reconstructedIngredients: MealIngredient[];
              if (raw.ingredientsExist) {
                reconstructedIngredients = raw.ingredients.ingredient.map(
                  (ing) => ({
                    ingredient: new Ingredient(
                      ing.name,
                      ing.price,
                      new Date(ing.expiration)
                    ),
                    quantity: ing.quantity,
                  })
                );
              } else reconstructedIngredients = [];

              let reconstructedVitamins: string[];
              if (raw.nutritionFacts.vitaminsExist) {
                reconstructedVitamins = raw.nutritionFacts.vitamins.map(
                  (vit) => vit
                );
              } else reconstructedVitamins = [];

              const meal = new Meal(
                raw.name,
                raw.type,
                raw.imgSrc,
                raw.description,
                {
                  calories: raw.nutritionFacts.calories,
                  protein: raw.nutritionFacts.protein,
                  fats: raw.nutritionFacts.fats,
                  carbohydrates: raw.nutritionFacts.carbohydrates,
                  vitamins: reconstructedVitamins,
                },
                reconstructedIngredients
              );

              mealsArray.push({ id: mealId, meal: meal });
            }
          }

          return mealsArray;
        })
      );
  }

  public deleteMeal(mealId: string) {
    console.log('deleting id ' + mealId);
    return this.http.delete(this.mealsURL + `/${mealId}.json`);
  }

  public deleteAllMeals() {
    console.log('deleting all meals');
    return this.http.delete(this.mealsURL + '.json');
  }

  public patchMeal(mealId: string, meal: Meal) {
    return this.http.patch(
      this.mealsURL + `/${mealId}.json`,
      this.buildRawMealDto(meal)
    );
  }
}
