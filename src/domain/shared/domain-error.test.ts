import { describe, expect, it } from "vitest";
import { DomainError } from "./domain-error.js";

describe("DomainError", () => {
  it("é uma instância de Error", () => {
    const error = new DomainError("mensagem de teste");

    expect(error).toBeInstanceOf(Error);
  });

  it("é uma instância de DomainError", () => {
    const error = new DomainError("mensagem de teste");

    expect(error).toBeInstanceOf(DomainError);
  });

  it("guarda a mensagem", () => {
    const error = new DomainError("mensagem de teste");

    expect(error.message).toBe("mensagem de teste");
  });
});
