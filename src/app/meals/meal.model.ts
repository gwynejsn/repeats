import { Ingredient } from '../shopping-list/ingredient.model';

export interface MealIngredient {
  ingredient: Ingredient;
  quantity: number;
}

export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  ALL = 'All',
}

export class Meal {
  constructor(
    private name: string,
    private type: MealType,
    private imgSrc: string,
    private description: string,
    private nutritionFacts: {
      calories: number;
      protein: number;
      fats: number;
      carbohydrates: number;
      vitamins: string[];
    },
    private ingredients: MealIngredient[]
  ) {}

  // Getters
  public getName(): string {
    return this.name;
  }

  public getType(): MealType {
    return this.type;
  }

  public getImgSrc(): string {
    return this.imgSrc;
  }

  public getDescription(): string {
    return this.description;
  }

  public getNutritionFacts(): {
    calories: number;
    protein: number;
    fats: number;
    carbohydrates: number;
    vitamins: string[];
  } {
    return this.nutritionFacts;
  }

  public getVitamins(): string {
    let vitamins = '';
    if (this.nutritionFacts.vitamins.length > 0) {
      const vit = this.nutritionFacts.vitamins;
      for (let i = 0; i < vit.length; i++)
        vitamins += i + 1 === vit.length ? vit[i] : vit[i] + ', ';
    } else vitamins = 'None';

    return vitamins;
  }

  public getVitaminsArray(): string[] {
    return this.nutritionFacts.vitamins;
  }

  public getIngredients(): MealIngredient[] {
    return this.ingredients;
  }
  public getIngredientsNames(): string[] {
    return this.ingredients.map((i) => i.ingredient.getName());
  }

  // Setters
  public setName(name: string): void {
    this.name = name;
  }

  public setType(type: MealType): void {
    this.type = type;
  }

  public setImgSrc(imgSrc: string): void {
    this.imgSrc = imgSrc;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public setNutritionFacts(nutritionFacts: {
    calories: number;
    protein: number;
    fats: number;
    carbohydrates: number;
    vitamins: string[];
  }): void {
    this.nutritionFacts = nutritionFacts;
  }

  public setIngredients(ingredients: MealIngredient[]) {
    this.ingredients = ingredients;
  }

  public static generateEmptyMeal(): Meal {
    return new Meal(
      '',
      MealType.ALL,
      '',
      '',
      {
        calories: 0,
        protein: 0,
        fats: 0,
        carbohydrates: 0,
        vitamins: [],
      },
      []
    );
  }

  public toObject(): {
    name: string;
    type: MealType;
    imgSrc: string;
    description: string;
    nutritionFacts: {
      calories: number;
      protein: number;
      fats: number;
      carbohydrates: number;
      vitamins: string[];
    };
    ingredients: { ingredient: Ingredient; quantity: number }[];
  } {
    return {
      name: this.name,
      type: this.type,
      imgSrc: this.imgSrc,
      description: this.description,
      nutritionFacts: this.nutritionFacts,
      ingredients: this.ingredients,
    };
  }
}
