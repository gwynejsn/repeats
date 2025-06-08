import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ShoppingListService } from '../../shopping-list/shopping-list.service';
import { Meal } from '../meal.model';
import { MealsService } from '../meals.service';

@Component({
  selector: 'app-meal-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meal-edit.component.html',
  styleUrl: './meal-edit.component.css',
})
export class MealEditComponent implements OnInit {
  private mealsService = inject(MealsService);
  private shoppingListService = inject(ShoppingListService);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  mealSelected: Meal | undefined;
  mealEdit: FormGroup | undefined;
  previewImgSrc: string | undefined;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      const foundMeal = this.mealsService.getMeal(param['meal-name']);
      if (foundMeal) this.mealSelected = foundMeal;
      else
        this.mealSelected = new Meal(
          'Name',
          'Specify Type',
          'Link to image',
          'Describe how you make the Meal.',
          {
            calories: 0,
            protein: 0,
            fats: 0,
            carbohydrates: 0,
            vitamins: [],
          },
          []
        );
    });

    this.previewImgSrc = this.mealSelected?.getImgSrc();

    this.mealEdit = this.fb.group({
      headingInfo: this.fb.group({
        imgSrc: [this.mealSelected?.getImgSrc()],
        name: [this.mealSelected?.getName()],
      }),
      details: this.fb.group({
        aboutMeal: this.fb.group({
          description: [this.mealSelected?.getDescription()],
          mealType: [this.mealSelected?.getType()],
          nutritionFacts: this.fb.group({
            calories: [this.mealSelected?.getNutritionFacts().calories],
            protein: [this.mealSelected?.getNutritionFacts().protein],
            fats: [this.mealSelected?.getNutritionFacts().fats],
            carbohydrates: [
              this.mealSelected?.getNutritionFacts().carbohydrates,
            ],
            vitamins: this.fb.array(
              this.mealSelected
                ?.getVitaminsArray()
                .map((vitamin) => this.fb.control(vitamin)) || []
            ),
          }),
          mealIngredients: this.fb.array(
            this.mealSelected
              ?.getIngredients()
              .map((ingredient) => this.fb.control(ingredient.getName())) || []
          ),
        }),
      }),
    });

    this.mealEdit
      .get('headingInfo.imgSrc')
      ?.valueChanges.subscribe((value) => (this.previewImgSrc = value));
  }

  get vitamins() {
    return this.mealEdit?.get(
      'details.aboutMeal.nutritionFacts.vitamins'
    ) as FormArray;
  }

  get mealIngredients() {
    return this.mealEdit?.get('details.aboutMeal.mealIngredients') as FormArray;
  }

  addVitamin() {
    this.vitamins.push(this.fb.control(''));
  }

  addIngredient() {
    this.mealIngredients.push(this.fb.control(''));
  }

  onSubmit() {
    const allIngredients =
      this.shoppingListService.getAllAvailableIngredients();
    if (this.mealEdit) {
      const formValue = this.mealEdit.value;

      const updatedMeal = new Meal(
        formValue.headingInfo.name,
        formValue.details.aboutMeal.mealType,
        formValue.headingInfo.imgSrc,
        formValue.details.aboutMeal.description,
        {
          calories: formValue.details.aboutMeal.nutritionFacts.calories,
          protein: formValue.details.aboutMeal.nutritionFacts.protein,
          fats: formValue.details.aboutMeal.nutritionFacts.fats,
          carbohydrates:
            formValue.details.aboutMeal.nutritionFacts.carbohydrates,
          vitamins: formValue.details.aboutMeal.nutritionFacts.vitamins,
        },
        formValue.details.aboutMeal.mealIngredients.map(
          (ingredient: string) => {
            allIngredients.find((i) => i.getName() === ingredient);
          }
        )
      );

      this.mealsService.patchMeal(this.mealSelected?.getName()!, updatedMeal);
    }
  }
}
