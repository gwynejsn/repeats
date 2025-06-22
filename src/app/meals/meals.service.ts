import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MealFetchService, UniqueMeal } from './meal-fetch.service';
import { Meal } from './meal.model';
import { deleteMeal, patchMeal } from './state/meals.actions';
import { selectUniqueMeals } from './state/meals.selectors';

@Injectable({ providedIn: 'root' })
export class MealsService {
  private mealFetchService = inject(MealFetchService);
  private store$ = inject(Store);
  private allUniqueMeals: UniqueMeal[] = [];

  constructor() {
    this.store$
      .pipe(select(selectUniqueMeals))
      .subscribe((meals) => (this.allUniqueMeals = meals));
  }

  patchMeal(originalName: string, updatedMeal: Meal) {
    this.store$.dispatch(patchMeal({ updatedMeal, originalName }));
  }

  deleteMeal(originalName: string) {
    this.store$.dispatch(deleteMeal({ originalName }));
  }
}

// class MockData {
//   private shoppingListFetchService = inject(ShoppingListFetchService);
//   private mealFetchService = inject(MealFetchService);

//   constructor() {
//     this.initMockMeals();
//   }

//   private initMockMeals(): void {
//     this.shoppingListFetchService
//       .getAllAvailableIngredientsNotUnique()
//       .subscribe((ingredients: Ingredient[]) => {
//         const getIngredient = (name: string): Ingredient | undefined =>
//           ingredients.find((i) => i.name === name);

//         const grilledChickenMeal = new Meal(
//           'Grilled Chicken with Quinoa',
//           MealType.LUNCH,
//           'https://www.onceuponachef.com/images/2020/05/best-grilled-chicken-scaled.jpg',
//           'A healthy grilled chicken served with quinoa and olive oil.',
//           {
//             calories: 450,
//             protein: 40,
//             fats: 15,
//             carbohydrates: 30,
//             vitamins: ['B6', 'C'],
//           },
//           [
//             { ingredient: getIngredient('Chicken Breast')!, quantity: 1 },
//             { ingredient: getIngredient('Quinoa')!, quantity: 3 },
//             { ingredient: getIngredient('Olive Oil')!, quantity: 2 },
//           ]
//         );

//         const salmonMeal = new Meal(
//           'Lemon Garlic Salmon',
//           MealType.DINNER,
//           'https://www.themediterraneandish.com/wp-content/uploads/2024/09/TMD-Baked-Lemon-Garlic-Salmon-Leads-03-Vertical.jpg',
//           'Baked salmon fillet with lemon and steamed broccoli.',
//           {
//             calories: 520,
//             protein: 45,
//             fats: 20,
//             carbohydrates: 10,
//             vitamins: ['D', 'B12', 'C'],
//           },
//           [
//             { ingredient: getIngredient('Salmon Fillet')!, quantity: 1 },
//             { ingredient: getIngredient('Broccoli')!, quantity: 2 },
//             { ingredient: getIngredient('Lemon')!, quantity: 1 },
//           ]
//         );

//         const oatmealMeal = new Meal(
//           'Oatmeal with Honey & Almond Milk',
//           MealType.BREAKFAST,
//           'https://www.hauteandhealthyliving.com/wp-content/uploads/2022/04/best-creamy-oatmeal-with-almond-milk.jpg',
//           'Warm oatmeal served with almond milk and honey.',
//           {
//             calories: 300,
//             protein: 10,
//             fats: 8,
//             carbohydrates: 50,
//             vitamins: ['E', 'B1'],
//           },
//           [
//             { ingredient: getIngredient('Rolled Oats')!, quantity: 1 },
//             { ingredient: getIngredient('Almond Milk')!, quantity: 1 },
//             { ingredient: getIngredient('Honey')!, quantity: 1 },
//           ]
//         );

//         // clear all meals first
//         this.mealFetchService.deleteAllMeals().subscribe();

//         // Post meals
//         this.postMeal(grilledChickenMeal);
//         this.postMeal(salmonMeal);
//         this.postMeal(oatmealMeal);
//       });
//   }

//   private postMeal(meal: Meal): void {
//     this.mealFetchService.postMeal(meal).subscribe({
//       next: () => console.log(`✅ Posted meal: ${meal.name ?? 'Unnamed'}`),
//       error: (err) => console.error(`❌ Failed to post meal:`, err),
//     });
//   }
// }
