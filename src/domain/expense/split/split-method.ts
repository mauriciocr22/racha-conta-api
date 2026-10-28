import type { Money } from "../../shared/money.js";
import type { Share } from "./share.js";

export interface SplitMethod {
  /**
   * Divide o total de uma despesa entre os participantes.
   *
   * @param total  valor total da despesa a ser dividido
   * @returns      uma parte para cada participante, na mesma ordem em que
   *               foram informados. A soma das partes é sempre exatamente
   *               igual ao total, sem sobrar nem faltar nenhum centavo.
   * @throws {DomainError} quando não é possível dividir esse total com os
   *               valores informados (ex.: no ExactSplit, quando a soma dos
   *               valores não bate com o total). Nunca devolve partes que
   *               não somam o total.
   */
  calculate(total: Money): Share[];
}
