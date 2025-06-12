import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MealFetchService, UniqueMeal } from './meal-fetch.service';
import { Meal } from './meal.model';

@Injectable({
  providedIn: 'root',
})
export class MealsService {
  private mealFetchService = inject(MealFetchService);

  constructor() {
    this.mealFetchService.getMeals().subscribe((uniqueMeals: UniqueMeal[]) => {
      this.allUniqueMeals$.next([...uniqueMeals]);
    });
  }

  private allUniqueMeals$ = new BehaviorSubject<UniqueMeal[]>([]);

  getAllMeals(): Observable<UniqueMeal[]> {
    return this.allUniqueMeals$;
  }

  getAllMealsNormal(): Meal[] {
    return this.allUniqueMeals$.value.map((uniqueMeal) => uniqueMeal.meal);
  }

  getMeal(name: string) {
    return this.getAllMealsNormal().find((meal) => meal.getName() === name);
  }

  getMealId(name: string) {
    const foundUniqueMeal = this.allUniqueMeals$.value.find(
      (uniqueMeal) =>
        uniqueMeal.meal.getName().toLowerCase().trim() ===
        name.toLowerCase().trim()
    );
    return foundUniqueMeal?.id;
  }

  patchMeal(originalName: string, updatedMeal: Meal) {
    const foundMeal = this.getMeal(originalName);
    const mealId = this.getMealId(originalName);
    if (foundMeal) {
      foundMeal.setName(updatedMeal.getName());
      foundMeal.setType(updatedMeal.getType());
      foundMeal.setImgSrc(updatedMeal.getImgSrc());
      foundMeal.setDescription(updatedMeal.getDescription());
      foundMeal.setNutritionFacts(updatedMeal.getNutritionFacts());
      foundMeal.setIngredients(updatedMeal.getIngredients());
      if (mealId)
        this.mealFetchService.patchMeal(mealId, foundMeal).subscribe();
    } else {
      this.mealFetchService.postMeal(updatedMeal).subscribe();
    }
    this.mealFetchService.getMeals().subscribe();
  }

  deleteMeal(originalName: string) {
    const mealId = this.getMealId(originalName);
    if (mealId)
      this.mealFetchService
        .deleteMeal(mealId)
        .subscribe((res) => console.log(res));
    else console.log('Id does not exist for meal ' + originalName);
    this.mealFetchService.getMeals().subscribe();
  }
}

// // Meals *will come from db in the future
// grilledChickenMeal = new Meal(
//   'Grilled Chicken with Quinoa',
//   MealType.LUNCH,
//   'https://www.onceuponachef.com/images/2020/05/best-grilled-chicken-scaled.jpg',
//   'A healthy grilled chicken served with quinoa and olive oil.',
//   {
//     calories: 450,
//     protein: 40,
//     fats: 15,
//     carbohydrates: 30,
//     vitamins: ['B6', 'C'],
//   },
//   [
//     { ingredient: this.shoppingListService.chicken, quantity: 1 },
//     { ingredient: this.shoppingListService.quinoa, quantity: 3 },
//     { ingredient: this.shoppingListService.oliveOil, quantity: 2 },
//   ]
// );

// salmonMeal = new Meal(
//   'Lemon Garlic Salmon',
//   MealType.DINNER,
//   'https://www.themediterraneandish.com/wp-content/uploads/2024/09/TMD-Baked-Lemon-Garlic-Salmon-Leads-03-Vertical.jpg',
//   'Baked salmon fillet with lemon and steamed broccoli.',
//   {
//     calories: 520,
//     protein: 45,
//     fats: 20,
//     carbohydrates: 10,
//     vitamins: ['D', 'B12', 'C'],
//   },
//   [
//     { ingredient: this.shoppingListService.salmon, quantity: 1 },
//     { ingredient: this.shoppingListService.broccoli, quantity: 2 },
//     { ingredient: this.shoppingListService.lemon, quantity: 1 },
//   ]
// );

// oatmealMeal = new Meal(
//   'Oatmeal with Honey & Almond Milk',
//   MealType.BREAKFAST,
//   'https://www.hauteandhealthyliving.com/wp-content/uploads/2022/04/best-creamy-oatmeal-with-almond-milk.jpg',
//   'Warm oatmeal served with almond milk and honey.',
//   {
//     calories: 300,
//     protein: 10,
//     fats: 8,
//     carbohydrates: 50,
//     vitamins: ['E', 'B1'],
//   },
//   [
//     { ingredient: this.shoppingListService.oats, quantity: 1 },
//     { ingredient: this.shoppingListService.almondMilk, quantity: 1 },
//     { ingredient: this.shoppingListService.honey, quantity: 1 },
//   ]
// );
