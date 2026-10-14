import { Money } from "../../shared/money.js";
import type { Share } from "./share.js";
import type { SplitMethod } from "./split-method.js";

export class ExactSplit implements SplitMethod {
  readonly shares: readonly Share[];

  constructor(shares: Share[]) {
    if (shares.length === 0) {
      throw new Error("A lista de participantes não deve ser vazia");
    }
    if (shares.some((share) => !share.amount.isPositive())) {
      throw new Error("Os valores devem ser maiores que zero.");
    }

    this.shares = shares;
  }

  calculate(total: Money): Share[] {
    const sharesSum = this.shares.reduce(
      (accumulator, share) => accumulator.add(share.amount),
      Money.zero(),
    );

    if (sharesSum.equals(total)) {
      return [...this.shares];
    }

    const difference = sharesSum.subtract(total);

    if (difference.isPositive()) {
      throw new Error(
        `A soma dos valores excede o total em ${difference.cents} centavos.`,
      );
    }

    throw new Error(
      `Faltam ${Math.abs(difference.cents)} centavos para a soma atingir o valor total.`,
    );
  }
}
