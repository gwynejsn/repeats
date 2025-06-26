import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Meal, MealType } from '../../meal.model';

enum BorderColors {
  BREAKFAST = '--color-breakfast',
  LUNCH = '--color-lunch',
  DINNER = '--color-dinner',
}
@Component({
  selector: 'app-meal-item',
  imports: [CommonModule],
  templateUrl: './meal-item.component.html',
  styleUrl: './meal-item.component.css',
})
export class MealItemComponent implements OnInit {
  @Input() meal!: Meal;
  @Input() skeleton: boolean = false;

  borderColor!: string;
  ngOnInit(): void {
    if (this.meal) {
      switch (this.meal.type) {
        case MealType.BREAKFAST:
          this.borderColor = 'var(' + BorderColors.BREAKFAST + ')';
          break;
        case MealType.LUNCH:
          this.borderColor = 'var(' + BorderColors.LUNCH + ')';
          break;
        case MealType.DINNER:
          this.borderColor = 'var(' + BorderColors.DINNER + ')';
          break;
        default:
          this.borderColor = 'var(' + BorderColors.BREAKFAST + ')';
      }
    }
  }
}
