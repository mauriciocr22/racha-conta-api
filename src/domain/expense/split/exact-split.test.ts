import { describe, it, expect } from "vitest";
import { ExactSplit } from "./exact-split.js";
import { Money } from "../../shared/money.js";

describe("ExactSplit", () => {
  describe("comportamento", () => {
    it("retorna os valores informados para cada participante", () => {
      const exactSplit = new ExactSplit([
        { participantId: "ana", amount: Money.fromCents(8000) },
        { participantId: "bruno", amount: Money.fromCents(12000) },
      ]);
      const total = Money.fromCents(20000);

      const shares = exactSplit.calculate(total);

      const shareList = shares.map((share) => {
        return [share.participantId, share.amount.cents];
      });

      expect(shareList).toEqual([
        ["ana", 8000],
        ["bruno", 12000],
      ]);
    });
  });

  describe("calidações do construtor", () => {
    it("rejeita lista vazia", () => {
      expect(() => new ExactSplit([])).toThrow();
    });

    it("rejeita participante com valor zero", () => {
      expect(
        () =>
          new ExactSplit([
            { participantId: "ana", amount: Money.fromCents(8000) },
            { participantId: "bruno", amount: Money.fromCents(0) },
          ]),
      ).toThrow();
    });

    it("rejeita participante com valor negativo", () => {
      expect(
        () =>
          new ExactSplit([
            { participantId: "ana", amount: Money.fromCents(8000) },
            { participantId: "bruno", amount: Money.fromCents(-10000) },
          ]),
      ).toThrow();
    });
  });

  describe("validações do calculate", () => {
    it("rejeita quando a soma dos valores é menor que o total", () => {
      const exactSplit = new ExactSplit([
        { participantId: "ana", amount: Money.fromCents(8000) },
        { participantId: "bruno", amount: Money.fromCents(12000) },
      ]);

      const total = Money.fromCents(20001);

      expect(() => exactSplit.calculate(total)).toThrow(
        "Faltam 1 centavos para a soma atingir o valor total.",
      );
    });

    it("rejeita quando a soma dos valores é maior que o total", () => {
      const exactSplit = new ExactSplit([
        { participantId: "ana", amount: Money.fromCents(8000) },
        { participantId: "bruno", amount: Money.fromCents(12000) },
      ]);

      const total = Money.fromCents(19999);

      expect(() => exactSplit.calculate(total)).toThrow(
        "A soma dos valores excede o total em 1 centavos.",
      );
    });
  });
});
