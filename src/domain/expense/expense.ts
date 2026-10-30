import { DomainError } from "../shared/domain-error.js";
import type { Money } from "../shared/money.js";
import type { Share } from "./split/share.js";
import type { SplitMethod } from "./split/split-method.js";

type CreateExpenseProps = {
  authorId: string;
  payerId: string;
  description: string;
  total: Money;
  splitMethod: SplitMethod;
};

type ExpenseProps = CreateExpenseProps & { id: string };

export class Expense {
  readonly id: string;
  readonly authorId: string;
  readonly payerId: string;
  readonly description: string;
  readonly total: Money;
  readonly shares: readonly Share[];

  private constructor({
    id,
    authorId,
    payerId,
    description,
    total,
    splitMethod,
  }: ExpenseProps) {
    if (!total.isPositive()) {
      throw new DomainError("O valor total deve ser maior que zero.");
    }

    const shares = splitMethod.calculate(total);
    const participantIds = shares.map((share) => share.participantId);
    const idsSet = new Set(participantIds);

    if (participantIds.length !== idsSet.size) {
      throw new DomainError("A lista não pode conter participantes repetidos.");
    }

    if (shares.length === 1 && shares[0]?.participantId === payerId) {
      throw new DomainError("O pagador não pode ser o único participante.");
    }

    this.id = id;
    this.authorId = authorId;
    this.payerId = payerId;
    this.description = description;
    this.total = total;
    this.shares = shares;
  }

  static create(props: CreateExpenseProps): Expense {
    return new Expense({ ...props, id: crypto.randomUUID() });
  }
}
