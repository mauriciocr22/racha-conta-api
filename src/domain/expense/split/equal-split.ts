import type { Money } from "../../shared/money.js";
import type { Share } from "./share.js";
import type { SplitMethod } from "./split-method.js";

export class EqualSplit implements SplitMethod {
  readonly participantIds: readonly string[];

  constructor(participantIds: string[]) {
    if (participantIds.length === 0) {
      throw new Error("A lista de participantes não pode ser vazia.");
    }
    this.participantIds = participantIds;
  }

  calculate(total: Money): Share[] {
    const parts = total.split(this.participantIds.length);

    return this.participantIds.map((participantId, index) => {
      return {
        participantId,
        amount: parts[index]!,
      };
    });
  }
}
