import { describe, it, expect } from "vitest";
import { PercentageSplit } from "./percentage-split.js";
import { Money } from "../../shared/money.js";

describe("PercentageSplit", () => {
  describe("comportamento", () => {
    it("divide o total conforme as porcentagens de cada participante", () => {
      const total = Money.fromCents(1000);

      const percentageSplit = new PercentageSplit([
        { participantId: "ana", percentage: 60 },
        { participantId: "bruno", percentage: 40 },
      ]);

      const shares = percentageSplit.calculate(total);

      const shareList = shares.map((share) => {
        return {
          participantId: share.participantId,
          amount: share.amount.cents,
        };
      });

      expect(shareList).toEqual([
        { participantId: "ana", amount: 600 },
        { participantId: "bruno", amount: 400 },
      ]);
    });

    it("distribui a sobra a partir do primeiro participante", () => {
      const total = Money.fromCents(1001);

      const percentageSplit = new PercentageSplit([
        { participantId: "ana", percentage: 60 },
        { participantId: "bruno", percentage: 40 },
      ]);

      const shares = percentageSplit.calculate(total);

      const shareList = shares.map((share) => {
        return {
          participantId: share.participantId,
          amount: share.amount.cents,
        };
      });

      expect(shareList).toEqual([
        { participantId: "ana", amount: 601 },
        { participantId: "bruno", amount: 400 },
      ]);
    });
  });

  describe("validações do construtor", () => {
    it("rejeita lista vazia", () => {
      expect(() => new PercentageSplit([])).toThrow();
    });

    it("rejeita porcentagem zero", () => {
      expect(
        () =>
          new PercentageSplit([
            { participantId: "ana", percentage: 100 },
            { participantId: "bruno", percentage: 0 },
          ]),
      ).toThrow(
        "As porcentagens de cada participante devem ser inteiras e positivas.",
      );
    });

    it("rejeita porcentagem negativa", () => {
      expect(
        () =>
          new PercentageSplit([
            { participantId: "ana", percentage: -99 },
            { participantId: "bruno", percentage: 1 },
          ]),
      ).toThrow(
        "As porcentagens de cada participante devem ser inteiras e positivas.",
      );
    });

    it("rejeita porcentagem não inteira", () => {
      expect(
        () =>
          new PercentageSplit([
            { participantId: "ana", percentage: 50.5 },
            { participantId: "bruno", percentage: 49.5 },
          ]),
      ).toThrow(
        "As porcentagens de cada participante devem ser inteiras e positivas.",
      );
    });

    it("rejeita quando a soma das porcentagens é maior que 100", () => {
      expect(
        () =>
          new PercentageSplit([
            { participantId: "ana", percentage: 100 },
            { participantId: "bruno", percentage: 1 },
          ]),
      ).toThrow("A soma das porcentagens deve ser igual a 100.");
    });

    it("rejeita quando a soma das porcentagens é menor que 100", () => {
      expect(
        () =>
          new PercentageSplit([
            { participantId: "ana", percentage: 98 },
            { participantId: "bruno", percentage: 1 },
          ]),
      ).toThrow("A soma das porcentagens deve ser igual a 100.");
    });
  });
});
