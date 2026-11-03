import { describe, expect, it } from "vitest";
import { Payment, type CreatePaymentProps } from "./payment.js";
import { Money } from "../shared/money.js";

function makePayment(overrides: Partial<CreatePaymentProps> = {}): Payment {
  return Payment.create({
    amount: Money.fromCents(1000),
    authorId: "ana",
    fromId: "ana",
    toId: "bruno",
    ...overrides,
  });
}

describe("Payment", () => {
  describe("criação", () => {
    it("cria um pagamento com um id gerado", () => {
      const payment = makePayment();

      expect(typeof payment.id).toBe("string");
      expect(payment.id.length).toBeGreaterThan(0);
    });

    it("aceita registro feito por quem pagou", () => {
      const payment = makePayment();

      expect(payment.authorId).toBe("ana");
    });

    it("aceita registro feito por quem recebeu", () => {
      const payment = makePayment({ authorId: "bruno" });

      expect(payment.authorId).toBe("bruno");
    });
  });

  describe("validação do valor", () => {
    it("rejeita valor zero", () => {
      expect(() => makePayment({ amount: Money.fromCents(0) })).toThrow();
    });

    it("rejeita valor negativo", () => {
      expect(() => makePayment({ amount: Money.fromCents(-10000) })).toThrow();
    });
  });

  describe("validação dos participantes", () => {
    it("rejeita pagamento feito para si mesmo", () => {
      expect(() => makePayment({ toId: "ana" })).toThrow();
    });

    it("rejeita registro feito por um terceiro", () => {
      expect(() => makePayment({ authorId: "carlos" })).toThrow();
    });
  });
});
