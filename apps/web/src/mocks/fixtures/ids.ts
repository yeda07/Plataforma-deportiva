import type { Identifier } from "@competencias-platform/contracts";

export function createMockId(value: number): Identifier {
  return `01926000-0000-7000-8000-${value.toString().padStart(12, "0")}` as Identifier;
}
