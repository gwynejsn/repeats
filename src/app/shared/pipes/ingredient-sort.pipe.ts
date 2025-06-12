import { Pipe, PipeTransform } from '@angular/core';
import { Order, SortBy } from '../../shopping-list/shopping-list.component';
import { IngredientListItem } from '../../shopping-list/shopping-list.service';

@Pipe({
  name: 'ingredientSort',
})
export class IngredientSortPipe implements PipeTransform {
  transform(
    ingredientListItems: IngredientListItem[],
    sortBy: SortBy,
    order: Order
  ): IngredientListItem[] {
    if (ingredientListItems.length === 0) return ingredientListItems;
    const matchedIngredients: IngredientListItem[] = [];
    const i = ingredientListItems.map((i) => i);
    switch (sortBy) {
      case SortBy.EXPIRATION:
        if (order === Order.INCREASING)
          return i.sort(
            (a, b) =>
              a.ingredient.getExpiration().getTime() -
              b.ingredient.getExpiration().getTime()
          );
        else
          return i.sort(
            (a, b) =>
              b.ingredient.getExpiration().getTime() -
              a.ingredient.getExpiration().getTime()
          );
      case SortBy.PRICE:
        if (order === Order.INCREASING)
          return i.sort(
            (a, b) => a.ingredient.getPrice() - b.ingredient.getPrice()
          );
        else
          return i.sort(
            (a, b) => b.ingredient.getPrice() - a.ingredient.getPrice()
          );
      case SortBy.QUANTITY:
        if (order === Order.INCREASING)
          return i.sort((a, b) => a.quantity - b.quantity);
        else return i.sort((a, b) => b.quantity - a.quantity);
    }
    return matchedIngredients;
  }
}
