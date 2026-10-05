import { describe, it, expect } from "vitest";
import { EqualSplit } from "./equal-split.js";
import { Money } from "../../shared/money.js";

describe("EqualSplit", () => {
  it("divide o total igualmente entre os participantes", () => {
    const total = Money.fromCents(9000);
    const participants = ["ana", "bruno", "carlos"];
    const b = new EqualSplit(participants);

    const shares = b.calculate(total);

    expect(shares.map((share) => share.amount.cents)).toEqual([
      3000, 3000, 3000,
    ]);
  });

  it("distribui a sobra na ordem dos participantes", () => {
    const total = Money.fromCents(9002);
    const participants = ["ana", "bruno", "carlos"];
    const b = new EqualSplit(participants);

    const shares = b.calculate(total);

    expect(shares.map((share) => share.amount.cents)).toEqual([
      3001, 3001, 3000,
    ]);
  });

  it("certifica que cada parte pertence ao participante correto", () => {
    const total = Money.fromCents(10000);
    const participants = ["ana", "bruno", "carlos"];
    const equalSplit = new EqualSplit(participants);

    const shares = equalSplit.calculate(total);

    const shareList = shares.map((share) => {
      return [share.participantId, share.amount.cents];
    });
    console.log(shareList);
    expect(shareList).toEqual([
      ["ana", 3334],
      ["bruno", 3333],
      ["carlos", 3333],
    ]);
  });

  it("rejeita lista de participantes vazia", () => {
    expect(() => new EqualSplit([])).toThrow();
  });
});
