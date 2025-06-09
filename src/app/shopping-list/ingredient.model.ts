export class Ingredient {
  constructor(
    private name: string,
    private price: number,
    private expiration: Date
  ) {}

  // Getters
  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }

  public getExpiration(): Date {
    return this.expiration;
  }

  // Setters
  public setName(name: string): void {
    this.name = name;
  }

  public setPrice(price: number): void {
    this.price = price;
  }

  public setExpiration(expiration: Date): void {
    this.expiration = expiration;
  }

  public compareTo(i: Ingredient): boolean {
    return (
      i.getName().toLocaleLowerCase().trim() === this.name.toLowerCase().trim()
    );
  }
  public stringCompareTo(i: string): boolean {
    return i.toLocaleLowerCase().trim() === this.name.toLowerCase().trim();
  }
}
