import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Ingredient } from './ingredient.model';
import {
  ShoppingListFetchService,
  UniqueIngredientListItem,
} from './shopping-list-fetch.service';

export interface IngredientListItem {
  ingredient: Ingredient;
  quantity: number;
}
@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private shoppingListFetchService = inject(ShoppingListFetchService);
  // Ingredients *mocked, will fetched from db in the future
  // chicken = new Ingredient('Chicken Breast', 3.5, new Date('2025-06-15'));
  // quinoa = new Ingredient('Quinoa', 2.0, new Date('2026-01-01'));
  // oliveOil = new Ingredient('Olive Oil', 5.0, new Date('2026-12-31'));

  // salmon = new Ingredient('Salmon Fillet', 6.0, new Date('2025-07-10'));
  // broccoli = new Ingredient('Broccoli', 1.2, new Date('2025-06-20'));
  // lemon = new Ingredient('Lemon', 0.5, new Date('2025-06-18'));

  // oats = new Ingredient('Rolled Oats', 1.0, new Date('2026-03-01'));
  // almondMilk = new Ingredient('Almond Milk', 2.5, new Date('2025-09-15'));
  // honey = new Ingredient('Honey', 3.0, new Date('2027-01-01'));

  // private availableIngredients = [
  //   this.chicken,
  //   this.quinoa,
  //   this.oliveOil,
  //   this.salmon,
  //   this.broccoli,
  //   this.lemon,
  //   this.oats,
  //   this.almondMilk,
  //   this.honey,
  // ];

  private userShoppingList$ = new BehaviorSubject<UniqueIngredientListItem[]>(
    []
  );

  constructor() {
    this.refetchShoppingList();
  }

  refetchShoppingList() {
    this.shoppingListFetchService
      .getAllFromShoppingList()
      .subscribe((shoppingList) => this.userShoppingList$.next(shoppingList));
  }

  getAllUserShoppingList(): Observable<IngredientListItem[]> {
    return this.userShoppingList$
      .asObservable()
      .pipe(map((list) => list.map((item) => item.listItem)));
  }

  removeFromUserShoppingList(i: string, quantity = 1) {
    const userShoppingList = this.userShoppingList$.value;
    const foundIngredient = userShoppingList.find(
      (element) =>
        element.listItem.ingredient.getName().toLowerCase().trim() ===
        i.toLowerCase().trim()
    );
    if (foundIngredient) {
      const afterSubtraction = foundIngredient.listItem.quantity - quantity;
      if (afterSubtraction <= 0)
        this.shoppingListFetchService
          .deleteFromShoppingList(foundIngredient.id)
          .subscribe(() => this.refetchShoppingList());
      else
        this.shoppingListFetchService
          .patchIngredientToShoppingList(foundIngredient.id, {
            ingredient: foundIngredient.listItem.ingredient,
            quantity: afterSubtraction,
          })
          .subscribe(() => this.refetchShoppingList());
    }

    // else do nothing
    else console.log(i + ' does not exist in the shopping list!');
  }

  addToUserShoppingList(i: string, quantity = 1) {
    const userShoppingList = this.userShoppingList$.value;
    const foundInUserList = userShoppingList.find(
      (element) =>
        element.listItem.ingredient.getName().toLowerCase().trim() ===
        i.toLowerCase().trim()
    );

    if (foundInUserList) {
      this.shoppingListFetchService
        .patchIngredientToShoppingList(foundInUserList.id, {
          ingredient: foundInUserList.listItem.ingredient,
          quantity: foundInUserList.listItem.quantity + quantity,
        })
        .subscribe(() => {
          this.refetchShoppingList();
        });

      this.refetchShoppingList();
    } else {
      // Ingredient not found in user's list — fetch it and add
      this.shoppingListFetchService
        .getAllAvailableIngredients()
        .subscribe((uniqueIngredients) => {
          const matched = uniqueIngredients.find(
            (uniqueIngredient) =>
              uniqueIngredient.ingredient.getName().toLowerCase().trim() ===
              i.toLowerCase().trim()
          );

          if (!matched) {
            console.error('Ingredient not found in available ingredients!');
            return;
          }

          // Post it to DB to add a new ingredient
          this.shoppingListFetchService
            .postToShoppingList({
              ingredient: matched.ingredient,
              quantity: quantity,
            })
            .subscribe(() => {
              this.refetchShoppingList();
            });

          this.refetchShoppingList();
        });
    }
  }

  clearUserShoppingList() {
    this.shoppingListFetchService
      .emptyShoppingList()
      .subscribe(() => this.refetchShoppingList());
  }
}
