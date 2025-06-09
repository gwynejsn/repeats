import { Ingredient } from '../shopping-list/ingredient.model';

export class Meal {
  constructor(
    private name: string,
    private type: string,
    private imgSrc: string,
    private description: string,
    private nutritionFacts: {
      calories: number;
      protein: number;
      fats: number;
      carbohydrates: number;
      vitamins: string[];
    },
    private ingredients: Ingredient[]
  ) {}

  // Getters
  public getName(): string {
    return this.name;
  }

  public getType(): string {
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
    const vit = this.nutritionFacts.vitamins;
    for (let i = 0; i < vit.length; i++)
      vitamins += i + 1 === vit.length ? vit[i] : vit[i] + ', ';
    return vitamins;
  }

  public getVitaminsArray(): string[] {
    return this.nutritionFacts.vitamins;
  }

  public getIngredients(): Ingredient[] {
    return this.ingredients;
  }
  public getIngredientsNames(): string[] {
    return this.ingredients.map((i) => i.getName());
  }

  // Setters
  public setName(name: string): void {
    this.name = name;
  }

  public setType(type: string): void {
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

  public setIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients;
  }
}
