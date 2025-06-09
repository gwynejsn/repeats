import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Meal, MealType } from './meal.model';

@Injectable({
  providedIn: 'root',
})
export class MealsService {
  private shoppingListService = inject(ShoppingListService);

  // Meals *will come from db in the future
  grilledChickenMeal = new Meal(
    'Grilled Chicken with Quinoa',
    MealType.LUNCH,
    'https://www.onceuponachef.com/images/2020/05/best-grilled-chicken-scaled.jpg',
    'A healthy grilled chicken served with quinoa and olive oil.',
    {
      calories: 450,
      protein: 40,
      fats: 15,
      carbohydrates: 30,
      vitamins: ['B6', 'C'],
    },
    [
      { ingredient: this.shoppingListService.chicken, quantity: 1 },
      { ingredient: this.shoppingListService.quinoa, quantity: 3 },
      { ingredient: this.shoppingListService.oliveOil, quantity: 2 },
    ]
  );

  salmonMeal = new Meal(
    'Lemon Garlic Salmon',
    MealType.DINNER,
    'https://www.themediterraneandish.com/wp-content/uploads/2024/09/TMD-Baked-Lemon-Garlic-Salmon-Leads-03-Vertical.jpg',
    'Baked salmon fillet with lemon and steamed broccoli.',
    {
      calories: 520,
      protein: 45,
      fats: 20,
      carbohydrates: 10,
      vitamins: ['D', 'B12', 'C'],
    },
    [
      { ingredient: this.shoppingListService.salmon, quantity: 1 },
      { ingredient: this.shoppingListService.broccoli, quantity: 2 },
      { ingredient: this.shoppingListService.lemon, quantity: 1 },
    ]
  );

  oatmealMeal = new Meal(
    'Oatmeal with Honey & Almond Milk',
    MealType.BREAKFAST,
    'https://www.hauteandhealthyliving.com/wp-content/uploads/2022/04/best-creamy-oatmeal-with-almond-milk.jpg',
    'Warm oatmeal served with almond milk and honey.',
    {
      calories: 300,
      protein: 10,
      fats: 8,
      carbohydrates: 50,
      vitamins: ['E', 'B1'],
    },
    [
      { ingredient: this.shoppingListService.oats, quantity: 1 },
      { ingredient: this.shoppingListService.almondMilk, quantity: 1 },
      { ingredient: this.shoppingListService.honey, quantity: 1 },
    ]
  );

  private allMeals$ = new BehaviorSubject([
    this.grilledChickenMeal,
    this.salmonMeal,
    this.oatmealMeal,
  ]);

  getAllMeals(): Observable<Meal[]> {
    return this.allMeals$;
  }

  getMeal(name: string) {
    return this.allMeals$.value.find((meal) => meal.getName() === name);
  }

  patchMeal(originalName: string, updatedMeal: Meal) {
    const mealsSnapshot = this.allMeals$.value;
    const foundMeal = this.getMeal(originalName);
    if (foundMeal) {
      mealsSnapshot.forEach((meal) => {
        if (meal.getName() === originalName) {
          meal.setName(updatedMeal.getName());
          meal.setType(updatedMeal.getType());
          meal.setImgSrc(updatedMeal.getImgSrc());
          meal.setDescription(updatedMeal.getDescription());
          meal.setNutritionFacts(updatedMeal.getNutritionFacts());
          meal.setIngredients(updatedMeal.getIngredients());
        }
      });
    } else {
      mealsSnapshot.push(updatedMeal);
    }
    this.allMeals$.next(mealsSnapshot);
  }

  deleteMeal(originalName: string) {
    const filteredMeals = this.allMeals$.value.filter(
      (meal) => meal.getName() != originalName
    );
    this.allMeals$.next(filteredMeals);
  }
}
