import { describe, it, expect } from "vitest";
import { Money } from "../../shared/money.js";
import { WeightSplit } from "./weight-split.js";

describe("WeightSplit", () => {
  describe("comportamento", () => {
    it("divide o total conforme o peso de cada participante", () => {
      const total = Money.fromCents(30000);

      const weightSplit = new WeightSplit([
        { participantId: "ana", weight: 2 },
        { participantId: "bruno", weight: 1 },
        { participantId: "carla", weight: 1 },
      ]);

      const shares = weightSplit.calculate(total);

      const shareList = shares.map((share) => {
        return {
          participantId: share.participantId,
          amount: share.amount.cents,
        };
      });

      expect(shareList).toEqual([
        { participantId: "ana", amount: 15000 },
        { participantId: "bruno", amount: 7500 },
        { participantId: "carla", amount: 7500 },
      ]);
    });

    it("distribui a sobra a partir do primeiro participante", () => {
      const total = Money.fromCents(100);

      const weightSplit = new WeightSplit([
        { participantId: "ana", weight: 2 },
        { participantId: "bruno", weight: 1 },
      ]);

      const shares = weightSplit.calculate(total);

      const shareList = shares.map((share) => {
        return {
          participantId: share.participantId,
          amount: share.amount.cents,
        };
      });

      expect(shareList).toEqual([
        { participantId: "ana", amount: 67 },
        { participantId: "bruno", amount: 33 },
      ]);
    });
  });

  describe("validações do construtor", () => {
    it("rejeita lista vazia", () => {
      expect(() => new WeightSplit([])).toThrow();
    });

    it("rejeita peso zero", () => {
      expect(
        () =>
          new WeightSplit([
            { participantId: "ana", weight: 2 },
            { participantId: "bruno", weight: 0 },
          ]),
      ).toThrow();
    });

    it("rejeita peso negativo", () => {
      expect(
        () =>
          new WeightSplit([
            { participantId: "ana", weight: 2 },
            { participantId: "bruno", weight: -1 },
          ]),
      ).toThrow();
    });

    it("rejeita peso não inteiro", () => {
      expect(
        () =>
          new WeightSplit([
            { participantId: "ana", weight: 2 },
            { participantId: "bruno", weight: 1.5 },
          ]),
      ).toThrow();
    });
  });
});
