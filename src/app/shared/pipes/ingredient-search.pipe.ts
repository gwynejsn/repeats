import { Pipe, PipeTransform } from '@angular/core';
import { IngredientListItem } from '../../shopping-list/shopping-list.service';

@Pipe({
  name: 'ingredientSearch',
})
export class IngredientSearchPipe implements PipeTransform {
  transform(
    ingredientListItems: IngredientListItem[],
    keyword: string
  ): IngredientListItem[] {
    if (ingredientListItems.length === 0) return ingredientListItems;
    const matchingIngredientListItem: IngredientListItem[] = [];
    ingredientListItems.forEach((ingredientListItem) => {
      if (
        ingredientListItem.ingredient.name
          .toLowerCase()
          .trim()
          .includes(keyword.toLowerCase().trim())
      )
        matchingIngredientListItem.push(ingredientListItem);
    });
    return matchingIngredientListItem;
  }
}
