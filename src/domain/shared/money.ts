export class Money {
  readonly cents: number;

  private constructor(cents: number) {
    if (!Number.isInteger(cents)) {
      throw new Error("O valor deve ser um número inteiro.");
    }
    this.cents = cents;
  }

  static fromCents(cents: number): Money {
    return new Money(cents);
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    return new Money(this.cents - other.cents);
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  isZero(): boolean {
    return this.cents === 0;
  }

  isPositive(): boolean {
    return this.cents > 0;
  }

  isNegative(): boolean {
    return this.cents < 0;
  }

  split(parts: number): Money[] {
    if (parts <= 0 || !Number.isInteger(parts)) {
      throw new Error("O número de partes deve ser um inteiro maior que zero.");
    }

    const proportions = new Array<number>(parts).fill(1);

    return this.allocate(proportions);
  }

  allocate(proportions: number[]): Money[] {
    if (proportions.length === 0) {
      throw new Error("A proporção não deve ser vazia.");
    }

    if (
      proportions.some(
        (proportion) => proportion <= 0 || !Number.isInteger(proportion),
      )
    ) {
      throw new Error(
        "A proporção deve conter apenas números inteiros maiores que zero.",
      );
    }

    if (this.isNegative()) {
      throw new Error("Não é possível dividir centavos negativos.");
    }

    const proportionsSum = proportions.reduce(
      (accumulator, current) => accumulator + current,
      0,
    );

    const baseCents = proportions.map((proportion) =>
      Math.floor((this.cents * proportion) / proportionsSum),
    );

    const baseSum = baseCents.reduce(
      (accumulator, current) => accumulator + current,
      0,
    );

    const remainder = this.cents - baseSum;

    return baseCents.map(
      (base, index) => new Money(index < remainder ? base + 1 : base),
    );
  }
}
