import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IngredientSearchPipe } from '../shared/pipes/ingredient-search.pipe';
import { IngredientSortPipe } from '../shared/pipes/ingredient-sort.pipe';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import {
  IngredientListItem,
  ShoppingListService,
} from './shopping-list.service';

export enum Order {
  INCREASING = 'increasing',
  DECREASING = 'decreasing',
}

export enum SortBy {
  EXPIRATION = 'expiration',
  QUANTITY = 'quantity',
  PRICE = 'price',
}

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [
    ShoppingEditComponent,
    CommonModule,
    IngredientSearchPipe,
    IngredientSortPipe,
    FormsModule,
  ],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent implements OnInit {
  private shoppingListService = inject(ShoppingListService);

  sortByValues = Object.values(SortBy);
  orderValues = Object.values(Order);

  sortBy = SortBy.EXPIRATION;
  order = Order.INCREASING;

  shoppingList: IngredientListItem[] = [];
  searchTerm = '';

  ngOnInit(): void {
    this.shoppingListService
      .getAllUserShoppingList()
      .subscribe((userShoppingList) => (this.shoppingList = userShoppingList));
  }
}
