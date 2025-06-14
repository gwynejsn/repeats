import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Ingredient } from './ingredient.model';
import { IngredientListItem } from './shopping-list.service';

export interface UniqueIngredient {
  id: string;
  ingredient: Ingredient;
}

export interface UniqueIngredientListItem {
  id: string;
  listItem: IngredientListItem;
}

interface RawIngredientDTO {
  name: string;
  price: number;
  expiration: string;
}

interface RawIngredientListItem {
  ingredient: RawIngredientDTO;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShoppingListFetchService {
  private http = inject(HttpClient);
  private availableIngredientsURL =
    'https://repeats-angular-default-rtdb.firebaseio.com/available-ingredients';
  private shoppingListURL =
    'https://repeats-angular-default-rtdb.firebaseio.com/shopping-list';

  private buildRawIngredientDTO(ingredient: Ingredient): RawIngredientDTO {
    return {
      name: ingredient.name,
      price: ingredient.price,
      expiration: ingredient.expiration.toISOString(),
    };
  }

  private buildRawIngredientListItem(
    listItem: IngredientListItem
  ): RawIngredientListItem {
    return {
      ingredient: this.buildRawIngredientDTO(listItem.ingredient),
      quantity: listItem.quantity,
    };
  }

  private buildUniqueIngredientListItem(
    id: string,
    raw: RawIngredientListItem
  ): UniqueIngredientListItem {
    return {
      id,
      listItem: {
        ingredient: new Ingredient(
          raw.ingredient.name,
          raw.ingredient.price,
          new Date(raw.ingredient.expiration)
        ),
        quantity: raw.quantity,
      },
    };
  }

  private buildUniqueIngredient(
    id: string,
    raw: RawIngredientDTO
  ): UniqueIngredient {
    return {
      id,
      ingredient: new Ingredient(raw.name, raw.price, new Date(raw.expiration)),
    };
  }

  private convertBackToIngredient(uniqueIngredient: UniqueIngredient) {
    return new Ingredient(
      uniqueIngredient.ingredient.name,
      uniqueIngredient.ingredient.price,
      uniqueIngredient.ingredient.expiration
    );
  }

  // ========== AVAILABLE INGREDIENTS ==========

  public postAvailableIngredient(ingredient: Ingredient) {
    return this.http.post(
      this.availableIngredientsURL + '.json',
      this.buildRawIngredientDTO(ingredient)
    );
  }

  public getAllAvailableIngredients(): Observable<UniqueIngredient[]> {
    return this.http
      .get<{ [key: string]: RawIngredientDTO }>(
        this.availableIngredientsURL + '.json'
      )
      .pipe(
        map((allAvailableIngredients) => {
          let allUniqueIngredients: UniqueIngredient[] = [];
          for (const id in allAvailableIngredients) {
            allUniqueIngredients.push(
              this.buildUniqueIngredient(id, allAvailableIngredients[id])
            );
          }
          return allUniqueIngredients;
        })
      );
  }

  public getAllAvailableIngredientsNotUnique(): Observable<Ingredient[]> {
    return this.getAllAvailableIngredients().pipe(
      map((uniqueList) =>
        uniqueList.map((u) => this.convertBackToIngredient(u))
      )
    );
  }

  public getASpecificAvailableIngredient(
    name: string
  ): Observable<Ingredient | undefined> {
    return this.getAllAvailableIngredientsNotUnique().pipe(
      map((ingredients) => ingredients.find((i) => i.name === name))
    );
  }

  public deleteAvailableIngredient(ingredientId: string) {
    return this.http.delete(
      `${this.availableIngredientsURL}/${ingredientId}.json`
    );
  }

  public patchAvailableIngredient(
    ingredientId: string,
    updatedIngredient: Ingredient
  ) {
    return this.http.patch(
      `${this.availableIngredientsURL}/${ingredientId}.json`,
      this.buildRawIngredientDTO(updatedIngredient)
    );
  }

  // ========== SHOPPING LIST ==========

  public postToShoppingList(item: IngredientListItem) {
    console.log('posting ');
    console.log(item);
    return this.http.post(
      this.shoppingListURL + '.json',
      this.buildRawIngredientListItem(item)
    );
  }

  public patchIngredientToShoppingList(
    ingredientId: string,
    item: IngredientListItem
  ) {
    return this.http.patch(
      `${this.shoppingListURL}/${ingredientId}.json`,
      this.buildRawIngredientListItem(item)
    );
  }

  public emptyShoppingList() {
    return this.http
      .delete(`${this.shoppingListURL}.json`, {
        observe: 'events',
      })
      .pipe(tap((e) => console.log(e)));
  }

  public deleteFromShoppingList(ingredientId: string) {
    return this.http.delete(`${this.shoppingListURL}/${ingredientId}.json`);
  }

  public getAllFromShoppingList(): Observable<UniqueIngredientListItem[]> {
    return this.http
      .get<{ [key: string]: RawIngredientListItem }>(
        this.shoppingListURL + '.json'
      )
      .pipe(
        map((res) => {
          let list: UniqueIngredientListItem[] = [];
          for (const id in res) {
            list.push(this.buildUniqueIngredientListItem(id, res[id]));
          }
          return list;
        })
      );
  }

  public getAllFromShoppingListNotUnique(): Observable<IngredientListItem[]> {
    return this.getAllFromShoppingList().pipe(
      map((list) => list.map((u) => u.listItem))
    );
  }
}
