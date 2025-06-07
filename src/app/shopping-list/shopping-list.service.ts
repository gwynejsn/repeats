import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ingredient } from './ingredient.model';

export interface IngredientListItem {
  ingredient: Ingredient;
  quantity: number;
}
@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  // Ingredients *mocked, will fetched from db in the future
  chicken = new Ingredient('Chicken Breast', 3.5, new Date('2025-06-15'));
  quinoa = new Ingredient('Quinoa', 2.0, new Date('2026-01-01'));
  oliveOil = new Ingredient('Olive Oil', 5.0, new Date('2026-12-31'));

  salmon = new Ingredient('Salmon Fillet', 6.0, new Date('2025-07-10'));
  broccoli = new Ingredient('Broccoli', 1.2, new Date('2025-06-20'));
  lemon = new Ingredient('Lemon', 0.5, new Date('2025-06-18'));

  oats = new Ingredient('Rolled Oats', 1.0, new Date('2026-03-01'));
  almondMilk = new Ingredient('Almond Milk', 2.5, new Date('2025-09-15'));
  honey = new Ingredient('Honey', 3.0, new Date('2027-01-01'));

  private availableIngredients = [
    this.chicken,
    this.quinoa,
    this.oliveOil,
    this.salmon,
    this.broccoli,
    this.lemon,
    this.oats,
    this.almondMilk,
    this.honey,
  ];

  userShoppingList$: BehaviorSubject<IngredientListItem[]> =
    new BehaviorSubject([
      { ingredient: this.chicken, quantity: 3 },
      { ingredient: this.lemon, quantity: 4 },
    ]);

  getAllAvailableIngredients() {
    return this.availableIngredients;
  }

  getAllUserShoppingList() {
    return this.userShoppingList$;
  }

  removeFromUserShoppingList(i: string, quantity = 1) {
    const userShoppingList = this.userShoppingList$.getValue();
    const foundIngredient = userShoppingList.find(
      (element) =>
        element.ingredient.getName().toLowerCase().trim() ===
        i.toLowerCase().trim()
    );
    if (foundIngredient) {
      this.userShoppingList$.next(
        userShoppingList
          .map((element) =>
            element.ingredient.getName() ===
            foundIngredient.ingredient.getName()
              ? {
                  ...element,
                  quantity: element.quantity - quantity,
                }
              : element
          )
          .filter((element) => element.quantity > 0)
      );
    }
  }

  addToUserShoppingList(i: string, quantity = 1) {
    const userShoppingList = this.userShoppingList$.getValue();
    const foundIngredientFromList = userShoppingList.find(
      (element) =>
        element.ingredient.getName().toLowerCase().trim() ===
        i.toLowerCase().trim()
    );
    if (foundIngredientFromList)
      this.userShoppingList$.next(
        userShoppingList.map((element) =>
          element.ingredient.getName() ===
          foundIngredientFromList.ingredient.getName()
            ? { ...element, quantity: element.quantity + quantity }
            : element
        )
      );
    else
      this.userShoppingList$.next([
        ...userShoppingList,
        {
          ingredient: this.getAllAvailableIngredients().find(
            (ingredient) =>
              ingredient.getName().toLowerCase().trim() ===
              i.toLowerCase().trim()
          )!,
          quantity: quantity,
        },
      ]);
  }

  clearUserShoppingList() {
    this.userShoppingList$.next([]);
  }
}
