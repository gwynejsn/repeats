import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ingredient } from '../shopping-list/ingredient.model';
import { ShoppingListFetchService } from '../shopping-list/shopping-list-fetch.service';
import { MealFetchService, UniqueMeal } from './meal-fetch.service';
import { Meal, MealType } from './meal.model';

@Injectable({
  providedIn: 'root',
})
export class MealsService {
  private mealFetchService = inject(MealFetchService);

  constructor() {
    this.refetchMeals();
    // const m = new MockData();
  }

  refetchMeals() {
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
    this.mealFetchService.getMeals().subscribe(() => this.refetchMeals());
  }

  deleteMeal(originalName: string) {
    const mealId = this.getMealId(originalName);
    if (mealId)
      this.mealFetchService
        .deleteMeal(mealId)
        .subscribe((res) => console.log(res));
    else console.log('Id does not exist for meal ' + originalName);
    this.mealFetchService.getMeals().subscribe(() => this.refetchMeals());
  }
}

class MockData {
  private shoppingListFetchService = inject(ShoppingListFetchService);
  private mealFetchService = inject(MealFetchService);

  constructor() {
    this.initMockMeals();
  }

  private initMockMeals(): void {
    this.shoppingListFetchService
      .getAllAvailableIngredientsNotUnique()
      .subscribe((ingredients: Ingredient[]) => {
        const getIngredient = (name: string): Ingredient | undefined =>
          ingredients.find((i) => i.getName() === name);

        const grilledChickenMeal = new Meal(
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
            { ingredient: getIngredient('Chicken Breast')!, quantity: 1 },
            { ingredient: getIngredient('Quinoa')!, quantity: 3 },
            { ingredient: getIngredient('Olive Oil')!, quantity: 2 },
          ]
        );

        const salmonMeal = new Meal(
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
            { ingredient: getIngredient('Salmon Fillet')!, quantity: 1 },
            { ingredient: getIngredient('Broccoli')!, quantity: 2 },
            { ingredient: getIngredient('Lemon')!, quantity: 1 },
          ]
        );

        const oatmealMeal = new Meal(
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
            { ingredient: getIngredient('Rolled Oats')!, quantity: 1 },
            { ingredient: getIngredient('Almond Milk')!, quantity: 1 },
            { ingredient: getIngredient('Honey')!, quantity: 1 },
          ]
        );

        // clear all meals first
        this.mealFetchService.deleteAllMeals().subscribe();

        // Post meals
        this.postMeal(grilledChickenMeal);
        this.postMeal(salmonMeal);
        this.postMeal(oatmealMeal);
      });
  }

  private postMeal(meal: Meal): void {
    this.mealFetchService.postMeal(meal).subscribe({
      next: () =>
        console.log(`✅ Posted meal: ${meal.getName?.() ?? 'Unnamed'}`),
      error: (err) => console.error(`❌ Failed to post meal:`, err),
    });
  }
}
