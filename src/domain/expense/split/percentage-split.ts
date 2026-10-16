import { Money } from "../../shared/money.js";
import type { Share } from "./share.js";
import type { SplitMethod } from "./split-method.js";

type ParticipantPercentage = {
  participantId: string;
  percentage: number;
};

export class PercentageSplit implements SplitMethod {
  readonly percentagesList: readonly ParticipantPercentage[];

  constructor(percentagesList: ParticipantPercentage[]) {
    if (percentagesList.length === 0) {
      throw new Error("A lista de participantes não deve ser vazia.");
    }
    if (
      percentagesList.some(
        (percentage) =>
          percentage.percentage <= 0 ||
          !Number.isInteger(percentage.percentage),
      )
    ) {
      throw new Error(
        "As porcentagens de cada participante devem ser inteiras e positivas.",
      );
    }

    const sum = percentagesList.reduce(
      (accumulator, percentage) => accumulator + percentage.percentage,
      0,
    );
    if (sum !== 100) {
      throw new Error("A soma das porcentagens deve ser igual a 100.");
    }

    this.percentagesList = percentagesList;
  }

  calculate(total: Money): Share[] {
    const percentages = this.percentagesList.map((item) => item.percentage);

    const amounts = total.allocate(percentages);

    return this.percentagesList.map((item, index) => {
      return {
        participantId: item.participantId,
        amount: amounts[index]!,
      };
    });
  }
}
