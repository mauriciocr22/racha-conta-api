import type { Money } from "../../shared/money.js";
import type { Share } from "./share.js";

export interface SplitMethod {
  calculate(total: Money): Share[];
}
