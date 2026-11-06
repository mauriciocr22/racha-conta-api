import type { Expense } from "../expense/expense.js";
import type { Payment } from "../payment/payment.js";
import { DomainError } from "../shared/domain-error.js";

export type CreateGroupProps = {
  name: string;
  creatorId: string;
};

type GroupProps = CreateGroupProps & {
  id: string;
  members: string[];
  expenses: Expense[];
  payments: Payment[];
};

export class Group {
  readonly id: string;
  readonly name: string;
  readonly creatorId: string;
  private readonly _members: string[];
  private readonly _expenses: Expense[];
  private readonly _payments: Payment[];

  private constructor({
    id,
    name,
    creatorId,
    members,
    expenses,
    payments,
  }: GroupProps) {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      throw new DomainError("O nome do grupo não deve ser vazio.");
    }

    this.id = id;
    this.name = trimmedName;
    this.creatorId = creatorId;
    this._members = members;
    this._expenses = expenses;
    this._payments = payments;
  }

  static create(props: CreateGroupProps): Group {
    return new Group({
      ...props,
      id: crypto.randomUUID(),
      members: [props.creatorId],
      expenses: [],
      payments: [],
    });
  }

  get members(): readonly string[] {
    return [...this._members];
  }

  get expenses(): readonly Expense[] {
    return [...this._expenses];
  }

  get payments(): readonly Payment[] {
    return [...this._payments];
  }

  isMember(userId: string): boolean {
    return this._members.includes(userId);
  }

  addMember({
    requesterId,
    newMemberId,
  }: {
    requesterId: string;
    newMemberId: string;
  }): void {
    if (requesterId !== this.creatorId) {
      throw new DomainError(
        "Apenas o criador do grupo pode adicionar novos membros.",
      );
    }

    if (this.isMember(newMemberId)) {
      throw new DomainError("Esse usuário já é um membro do grupo.");
    }

    this._members.push(newMemberId);
  }

  addExpense(expense: Expense): void {
    if (!this.isMember(expense.authorId)) {
      throw new DomainError("O autor da despesa deve ser membro do grupo.");
    }

    if (!this.isMember(expense.payerId)) {
      throw new DomainError("O pagador deve ser membro do grupo.");
    }

    if (!expense.shares.every((share) => this.isMember(share.participantId))) {
      throw new DomainError(
        "Todos os participantes devem ser membros do grupo.",
      );
    }

    this._expenses.push(expense);
  }

  addPayment(payment: Payment): void {
    if (!this.isMember(payment.fromId)) {
      throw new DomainError("Quem paga deve ser membro do grupo.");
    }

    if (!this.isMember(payment.toId)) {
      throw new DomainError("Quem recebe deve ser membro do grupo.");
    }

    this._payments.push(payment);
  }
}
