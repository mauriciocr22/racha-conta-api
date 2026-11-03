import { DomainError } from "../shared/domain-error.js";
import type { Money } from "../shared/money.js";

export type CreatePaymentProps = {
  fromId: string;
  toId: string;
  authorId: string;
  amount: Money;
};

type PaymentProps = CreatePaymentProps & { id: string };

export class Payment {
  readonly id: string;
  readonly fromId: string;
  readonly toId: string;
  readonly authorId: string;
  readonly amount: Money;

  private constructor({ id, fromId, toId, authorId, amount }: PaymentProps) {
    if (!amount.isPositive()) {
      throw new DomainError("O valor deve ser maior que zero.");
    }

    if (fromId === toId) {
      throw new DomainError(
        "O pagamento não pode ser feito para o próprio pagador.",
      );
    }

    if (authorId !== fromId && authorId !== toId) {
      throw new DomainError(
        "Só quem pagou ou recebeu pode registrar um pagamento.",
      );
    }

    this.id = id;
    this.fromId = fromId;
    this.toId = toId;
    this.authorId = authorId;
    this.amount = amount;
  }

  static create(props: CreatePaymentProps): Payment {
    return new Payment({ ...props, id: crypto.randomUUID() });
  }
}
