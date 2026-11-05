import { DomainError } from "../shared/domain-error.js";

export type CreateGroupProps = {
  name: string;
  creatorId: string;
};

type GroupProps = CreateGroupProps & { id: string; members: string[] };

export class Group {
  readonly id: string;
  readonly name: string;
  readonly creatorId: string;
  private readonly _members: string[];

  private constructor({ id, name, creatorId, members }: GroupProps) {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      throw new DomainError("O nome do grupo não deve ser vazio.");
    }

    this.id = id;
    this.name = trimmedName;
    this.creatorId = creatorId;
    this._members = members;
  }

  static create(props: CreateGroupProps): Group {
    return new Group({
      ...props,
      id: crypto.randomUUID(),
      members: [props.creatorId],
    });
  }

  get members(): readonly string[] {
    return [...this._members];
  }

  isMember(userId: string): boolean {
    return this._members.includes(userId);
  }

  addMember({
    requesterId,
    newMemberId,
  }: {
    requesterId: string;
    newMemberId: string;
  }): void {
    if (requesterId !== this.creatorId) {
      throw new DomainError(
        "Apenas o criador do grupo pode adicionar novos membros.",
      );
    }

    if (this.isMember(newMemberId)) {
      throw new DomainError("Esse usuário já é um membro do grupo.");
    }

    this._members.push(newMemberId);
  }
}
