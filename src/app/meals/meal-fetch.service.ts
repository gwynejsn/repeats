import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Ingredient } from '../shopping-list/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
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
  private shoppingListService = inject(ShoppingListService);

  private buildRawMealDto(meal: Meal): RawMealDto {
    const vitaminsArray = meal.getVitaminsArray();
    const ingredientsArray = meal.getIngredients();

    return {
      name: meal.getName(),
      type: meal.getType(),
      imgSrc: meal.getImgSrc(),
      description: meal.getDescription(),
      nutritionFacts: {
        calories: meal.getNutritionFacts().calories,
        protein: meal.getNutritionFacts().protein,
        fats: meal.getNutritionFacts().fats,
        carbohydrates: meal.getNutritionFacts().carbohydrates,
        vitamins: vitaminsArray,
        vitaminsExist: vitaminsArray.length > 0,
      },
      ingredients: {
        ingredient: ingredientsArray.map((i) => ({
          name: i.ingredient.getName(),
          price: i.ingredient.getPrice(),
          expiration: i.ingredient.getExpiration(),
          quantity: i.quantity,
        })),
      },
      ingredientsExist: ingredientsArray.length > 0,
    };
  }

  public postMeal(meal: Meal) {
    return this.http.post(
      'https://repeats-angular-default-rtdb.firebaseio.com/meals.json',
      this.buildRawMealDto(meal),
      {
        observe: 'response',
      }
    );
  }

  public getMeals() {
    return this.http
      .get<{ [key: string]: RawMealDto }>(
        'https://repeats-angular-default-rtdb.firebaseio.com/meals.json'
      )
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
    return this.http.delete(
      `https://repeats-angular-default-rtdb.firebaseio.com/meals/${mealId}.json`
    );
  }

  public patchMeal(mealId: string, meal: Meal) {
    return this.http.patch(
      `https://repeats-angular-default-rtdb.firebaseio.com/meals/${mealId}.json`,
      this.buildRawMealDto(meal)
    );
  }
}
