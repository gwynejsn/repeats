import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import {
  IngredientListItem,
  ShoppingListService,
} from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [ShoppingEditComponent, CommonModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent implements OnInit {
  private shoppingListService = inject(ShoppingListService);

  shoppingList!: IngredientListItem[];

  ngOnInit(): void {
    this.shoppingListService
      .getAllUserShoppingList()
      .subscribe((userShoppingList) => (this.shoppingList = userShoppingList));
  }
}
