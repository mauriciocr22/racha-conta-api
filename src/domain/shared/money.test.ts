import { describe, it, expect } from "vitest";
import { Money } from "./money.js";

describe("Money", () => {
  describe("criação", () => {
    it("cria a partir de centavos inteiros", () => {
      const money = Money.fromCents(500);

      expect(money.cents).toBe(500);
    });

    it("aceita zero", () => {
      const money = Money.fromCents(0);

      expect(money.cents).toBe(0);
    });

    it("aceita valor negativo", () => {
      const money = Money.fromCents(-500);

      expect(money.cents).toBe(-500);
    });

    it("rejeita valor não inteiro", () => {
      expect(() => Money.fromCents(500.5)).toThrow();
    });

    it("cria um valor de zero centavos com zero()", () => {
      const money = Money.zero();

      expect(money.cents).toBe(0);
    });
  });

  describe("operações", () => {
    it("soma dois valores", () => {
      const a = Money.fromCents(500);
      const b = Money.fromCents(400);

      expect(a.add(b).cents).toBe(900);
    });

    it("subtrai dois valores", () => {
      const a = Money.fromCents(500);
      const b = Money.fromCents(400);

      expect(a.subtract(b).cents).toBe(100);
    });

    it("subtrair valor maior resulta em negativo", () => {
      const a = Money.fromCents(400);
      const b = Money.fromCents(500);

      expect(a.subtract(b).cents).toBe(-100);
    });

    it("somar não altera o valor original", () => {
      const a = Money.fromCents(500);
      const b = Money.fromCents(400);

      a.add(b);

      expect(a.cents).toBe(500);
    });
  });

  describe("igualdade", () => {
    it("dois valores com os mesmos centavos são iguais", () => {
      const a = Money.fromCents(500);
      const b = Money.fromCents(500);

      expect(a.equals(b)).toBe(true);
    });

    it("dois valores com centavos diferentes não são iguais", () => {
      const a = Money.fromCents(500);
      const b = Money.fromCents(400);

      expect(a.equals(b)).toBe(false);
    });
  });

  describe("consultas", () => {
    it("informa se o valor é zero", () => {
      const money = Money.fromCents(0);

      expect(money.isZero()).toBe(true);
    });

    it("informa se o valor é positivo", () => {
      const money = Money.fromCents(500);

      expect(money.isPositive()).toBe(true);
    });

    it("informa se o valor é negativo", () => {
      const money = Money.fromCents(-500);

      expect(money.isNegative()).toBe(true);
    });

    it("zero não é positivo nem negativo", () => {
      const money = Money.fromCents(0);

      expect(money.isPositive()).toBe(false);
      expect(money.isNegative()).toBe(false);
    });
  });

  describe("divisão em partes", () => {
    it("divide 9000 centavos em 3 partes iguais", () => {
      const money = Money.fromCents(9000);

      const cents = money.split(3).map((part) => part.cents);

      expect(cents).toEqual([3000, 3000, 3000]);
    });

    it("distribui a sobra a partir da primeira parte", () => {
      const money = Money.fromCents(10000);

      const cents = money.split(3).map((part) => part.cents);

      expect(cents).toEqual([3334, 3333, 3333]);
    });

    it("divide 2 centavos em 3 partes", () => {
      const money = Money.fromCents(2);

      const cents = money.split(3).map((part) => part.cents);

      expect(cents).toEqual([1, 1, 0]);
    });

    it("divide zero centavos em partes zeradas", () => {
      const money = Money.fromCents(0);

      const cents = money.split(2).map((part) => part.cents);

      expect(cents).toEqual([0, 0]);
    });

    it("a soma das partes é igual ao valor original", () => {
      const money = Money.fromCents(9001);

      const total = money
        .split(3)
        .map((part) => part.cents)
        .reduce((sum, cents) => sum + cents, 0);

      expect(total).toBe(9001);
    });

    it("rejeita dividir em zero partes", () => {
      const money = Money.fromCents(10000);

      expect(() => money.split(0)).toThrow();
    });

    it("rejeita dividir em número negativo de partes", () => {
      const money = Money.fromCents(10000);

      expect(() => money.split(-2)).toThrow();
    });

    it("rejeita dividir em número não inteiro de partes", () => {
      const money = Money.fromCents(30000);

      expect(() => money.split(1.5)).toThrow();
    });

    it("rejeita dividir um valor negativo", () => {
      const money = Money.fromCents(-101);

      expect(() => money.split(2)).toThrow();
    });
  });
});
