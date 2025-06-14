export class Ingredient {
  constructor(
    private _name: string,
    private _price: number,
    private _expiration: Date
  ) {}

  // Getters
  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get expiration(): Date {
    return this._expiration;
  }

  // Setters
  set name(value: string) {
    this._name = value;
  }

  set price(value: number) {
    this._price = value;
  }

  set expiration(value: Date) {
    this._expiration = value;
  }

  compareTo(i: Ingredient): boolean {
    return i.name.toLowerCase().trim() === this._name.toLowerCase().trim();
  }

  stringCompareTo(i: string): boolean {
    return i.toLowerCase().trim() === this._name.toLowerCase().trim();
  }
}
