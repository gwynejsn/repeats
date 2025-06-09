import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IngredientValidator } from '../../shared/validators/ingredient.validator';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent {
  private shoppingListService = inject(ShoppingListService);
  private fb = inject(FormBuilder);
  private ingredientValidator = inject(IngredientValidator);

  shoppingEditInput = this.fb.group({
    ingredientName: [
      '',
      [Validators.required],
      [this.ingredientValidator.ingredientExistAsync()],
    ],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  get quantityInvalid(): boolean | undefined {
    return (
      this.shoppingEditInput.get('quantity')?.invalid &&
      this.shoppingEditInput.get('quantity')?.touched &&
      this.shoppingEditInput.get('quantity')?.dirty
    );
  }
  get ingredientNameInvalid(): boolean | undefined {
    return (
      this.shoppingEditInput.get('ingredientName')?.invalid &&
      this.shoppingEditInput.get('ingredientName')?.touched &&
      this.shoppingEditInput.get('ingredientName')?.dirty
    );
  }

  add() {
    const ingredientName = this.shoppingEditInput.get('ingredientName')?.value;
    const quantity = this.shoppingEditInput.get('quantity')?.value;
    if (ingredientName && quantity)
      this.shoppingListService.addToUserShoppingList(ingredientName, quantity);
  }

  remove() {
    const ingredientName = this.shoppingEditInput.get('ingredientName')?.value;
    const quantity = this.shoppingEditInput.get('quantity')?.value;
    if (ingredientName && quantity)
      this.shoppingListService.removeFromUserShoppingList(
        ingredientName,
        quantity
      );
  }

  clear() {
    this.shoppingListService.clearUserShoppingList();
  }
}
