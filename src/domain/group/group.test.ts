import { describe, expect, it } from "vitest";
import { Group, type CreateGroupProps } from "./group.js";

function makeGroup(overrides: Partial<CreateGroupProps> = {}): Group {
  return Group.create({
    creatorId: "ana",
    name: "Viagem",
    ...overrides,
  });
}

describe("Group", () => {
  describe("criação", () => {
    it("cria um grupo com o id gerado", () => {
      const group = makeGroup();

      expect(typeof group.id).toBe("string");
      expect(group.id.length).toBeGreaterThan(0);
    });

    it("cria o grupo com o criador como membro", () => {
      const group = makeGroup();

      expect(group.members).toEqual(["ana"]);
    });

    it("remove os espaços das pontas do nome do grupo", () => {
      const group = makeGroup({ name: "      Viagem      " });

      expect(group.name).toBe("Viagem");
    });
  });

  describe("validação do nome", () => {
    it("rejeita nome vazio", () => {
      expect(() => makeGroup({ name: "" })).toThrow(
        "O nome do grupo não deve ser vazio.",
      );
    });

    it("rejeita nome só com espaços", () => {
      expect(() => makeGroup({ name: "              " })).toThrow(
        "O nome do grupo não deve ser vazio.",
      );
    });
  });

  describe("adição de membros", () => {
    it("o criador adiciona um membro", () => {
      const group = makeGroup();

      group.addMember({
        requesterId: "ana",
        newMemberId: "lucas",
      });

      expect(group.members).toEqual(["ana", "lucas"]);
    });

    it("rejeita adição feita por quem não é criador", () => {
      const group = makeGroup();

      expect(() =>
        group.addMember({
          requesterId: "bruno",
          newMemberId: "lucas",
        }),
      ).toThrow("Apenas o criador do grupo pode adicionar novos membros.");

      expect(group.members).toEqual(["ana"]);
    });

    it("rejeita membro repetido", () => {
      const group = makeGroup();

      group.addMember({
        requesterId: "ana",
        newMemberId: "lucas",
      });

      expect(() =>
        group.addMember({
          requesterId: "ana",
          newMemberId: "lucas",
        }),
      ).toThrow("Esse usuário já é um membro do grupo.");

      expect(group.members).toEqual(["ana", "lucas"]);
    });
  });

  describe("consulta", () => {
    it("informa se um usuário é membro", () => {
      const group = makeGroup();

      expect(group.isMember("ana")).toBe(true);
    });

    it("informa se um usuário não é membro", () => {
      const group = makeGroup();

      expect(group.isMember("lucas")).toBe(false);
    });
  });

  describe("proteção da lista", () => {
    it("alterar a lista recebida não altera os membros do grupo", () => {
      const group = makeGroup();

      const members = group.members as string[];
      members.push("bruno");

      expect(group.members).toEqual(["ana"]);
    });
  });
});
