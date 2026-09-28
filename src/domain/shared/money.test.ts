import { describe, it, expect } from "vitest";
import { Money } from "./money.js";

describe("Money", () => {

    it("cria a partir de centavos inteiros.", () => {
        const money = Money.fromCents(500);
    
        expect(money.cents).toBe(500);
    });

    it("aceita valor 0", () => {
        const money = Money.fromCents(0);

        expect(money.cents).toBe(0);
    });

    it("aceita valor negativo", () => {
        const money = Money.fromCents(-500);

        expect(money.cents).toBe(-500);
    });

    it("rejeita valor não inteiro", () => {
        expect(() => Money.fromCents(500.50)).toThrow()
    });

    it("soma dois moneys", () => {
        const a = Money.fromCents(500);
        const b = Money.fromCents(400);

        expect(a.add(b).cents).toBe(900);
    });

    it("subtrai dois moneys", () => {
        const a = Money.fromCents(500);
        const b = Money.fromCents(400);

        expect(a.subtract(b).cents).toBe(100);
    });

    it("soma nao altera valor original", () => {
        const a = Money.fromCents(500);
        const b = Money.fromCents(400);

        a.add(b).cents;

        expect(a.cents).toBe(500);
    });

    it("subtrair valor maior resulta em negativo", () => {
        const a = Money.fromCents(400);
        const b = Money.fromCents(500);

        expect(a.subtract(b).cents).toBe(-100)
    });

    it("dois valores com os mesmos centavos são iguais.", () => {
        const a = Money.fromCents(500);
        const b = Money.fromCents(500);

        expect(a.equals(b)).toBe(true)
    });

    it("dois valores com centavos diferentes não são iguais.", () => {
        const a = Money.fromCents(500);
        const b = Money.fromCents(400);

        expect(a.equals(b)).toBe(false)
    })

    it("informa se o valor é zero", () => {
        const a = Money.fromCents(0);

        expect(a.isZero()).toBe(true);
    });

    it("informa se o valor é negativo", () => {
        const a = Money.fromCents(-500);

        expect(a.isNegative()).toBe(true);
    });

    it("informa se o valor é positivo", () => {
        const a = Money.fromCents(500);

        expect(a.isPositive()).toBe(true);
    });

    it("checa se zero é diferente de positivo e negativo", () => {
        const a = Money.fromCents(0);

        expect(a.isNegative()).toBe(false);
        expect(a.isPositive()).toBe(false);
        expect(a.isZero()).toBe(true);
    });

    it("cria um valor de zero centavos.", () => {
        const a = Money.zero();

        expect(a.cents).toBe(0);
    });
});
