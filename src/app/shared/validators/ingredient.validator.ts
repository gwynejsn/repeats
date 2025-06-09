import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { of } from 'rxjs';
import { ShoppingListService } from '../../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class IngredientValidator {
  private shoppingListService = inject(ShoppingListService);
  public ingredientExist(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const foundIngredient = this.shoppingListService
        .getAllAvailableIngredients()
        .find((ingredient) => ingredient.stringCompareTo(control.value + ''));
      return !foundIngredient
        ? { notExistence: { value: control.value } }
        : null;
    };
  }

  public ingredientExistAsync(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const foundIngredient = this.shoppingListService
        .getAllAvailableIngredients()
        .find((ingredient) => ingredient.stringCompareTo(control.value + ''));
      return of(foundIngredient ? null : { nonExistence: true });
    };
  }
}
