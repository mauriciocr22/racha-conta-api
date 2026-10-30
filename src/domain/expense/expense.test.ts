import { describe, it, expect } from "vitest";
import { Expense, type CreateExpenseProps } from "./expense.js";
import { Money } from "../shared/money.js";
import { EqualSplit } from "./split/equal-split.js";
import { ExactSplit } from "./split/exact-split.js";

function makeExpense(overrides: Partial<CreateExpenseProps> = {}): Expense {
  return Expense.create({
    authorId: "ana",
    payerId: "ana",
    description: "Pizza",
    total: Money.fromCents(9000),
    splitMethod: new EqualSplit(["ana", "bruno", "carla"]),
    ...overrides,
  });
}

describe("Expense", () => {
  describe("criação", () => {
    it("cria uma despesa com o id gerado", () => {
      const expense = makeExpense();

      expect(typeof expense.id).toBe("string");
      expect(expense.id.length).toBeGreaterThan(0);
    });

    it("duas despesas criadas têm id diferente", () => {
      const expense = makeExpense();
      const expense2 = makeExpense();

      expect(expense.id).not.toBe(expense2.id);
    });

    it("calcula as partes usando o método de divisão informado", () => {
      const expense = makeExpense();

      const shares = expense.shares.map((share) => share.amount.cents);

      expect(shares).toEqual([3000, 3000, 3000]);
    });

    it("aceita que o pagador não esteja entre os participantes", () => {
      const expense = makeExpense({ payerId: "lucas" });
      const expenseParticipants = expense.shares.map(
        (share) => share.participantId,
      );

      expect(expense.payerId).toBe("lucas");
      expect(expenseParticipants).toEqual(["ana", "bruno", "carla"]);
    });
  });

  describe("validação do total", () => {
    it("rejeita total zero", () => {
      expect(() => makeExpense({ total: Money.fromCents(0) })).toThrow();
    });

    it("rejeita total negativo", () => {
      expect(() => makeExpense({ total: Money.fromCents(-1000) })).toThrow();
    });
  });

  describe("validação dos participantes", () => {
    it("rejeita participante repetido", () => {
      expect(() =>
        makeExpense({ splitMethod: new EqualSplit(["bruno", "ana", "bruno"]) }),
      ).toThrow();
    });

    it("rejeita despesa em que o único participante é o pagador", () => {
      expect(() =>
        makeExpense({ splitMethod: new EqualSplit(["ana"]) }),
      ).toThrow();
    });
  });

  describe("método de divisão", () => {
    it("repassa o erro do método de divisão", () => {
      expect(() =>
        makeExpense({
          splitMethod: new ExactSplit([
            { participantId: "ana", amount: Money.fromCents(3000) },
            { participantId: "bruno", amount: Money.fromCents(3000) },
          ]),
        }),
      ).toThrow("Faltam 3000 centavos para a soma atingir o valor total.");
    });
  });
});
