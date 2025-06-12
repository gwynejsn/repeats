import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { map } from 'rxjs';
import { Ingredient } from '../../shopping-list/ingredient.model';
import { ShoppingListFetchService } from '../../shopping-list/shopping-list-fetch.service';

@Injectable({ providedIn: 'root' })
export class IngredientValidator {
  private shoppingListFetchService = inject(ShoppingListFetchService);

  public ingredientExist(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let foundIngredient: Ingredient | undefined;
      this.shoppingListFetchService
        .getAllAvailableIngredientsNotUnique()
        .subscribe((availableIngredients) => {
          foundIngredient = availableIngredients.find((ingredient) =>
            ingredient.stringCompareTo(control.value + '')
          );
        });

      return !foundIngredient
        ? { notExistence: { value: control.value } }
        : null;
    };
  }

  public ingredientExistAsync(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.shoppingListFetchService
        .getAllAvailableIngredientsNotUnique()
        .pipe(
          map((availableIngredients) => {
            const found = availableIngredients.find((ingredient) =>
              ingredient.stringCompareTo(control.value + '')
            );
            return found ? null : { nonExistence: true };
          })
        );
    };
  }
}
