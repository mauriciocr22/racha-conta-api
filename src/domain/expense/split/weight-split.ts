import { DomainError } from "../../shared/domain-error.js";
import type { Money } from "../../shared/money.js";
import type { Share } from "./share.js";
import type { SplitMethod } from "./split-method.js";

type ParticipantWeight = {
  participantId: string;
  weight: number;
};

export class WeightSplit implements SplitMethod {
  readonly weightList: readonly ParticipantWeight[];

  constructor(weightList: ParticipantWeight[]) {
    if (weightList.length === 0) {
      throw new DomainError("A lista de pesos não deve ser vazia.");
    }
    if (
      weightList.some(
        (item) => item.weight <= 0 || !Number.isInteger(item.weight),
      )
    ) {
      throw new DomainError(
        "Os pesos de cada participante devem ser inteiros e positivos.",
      );
    }

    this.weightList = weightList;
  }

  calculate(total: Money): Share[] {
    const weights = this.weightList.map((item) => item.weight);

    const amounts = total.allocate(weights);

    return this.weightList.map((item, index) => {
      return {
        participantId: item.participantId,
        amount: amounts[index]!,
      };
    });
  }
}
