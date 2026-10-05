import type { Money } from "../../shared/money.js";

export type Share = {
  readonly participantId: string;
  readonly amount: Money;
};
