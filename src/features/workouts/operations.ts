import { randomUUID } from "expo-crypto";

// Date.now() repeats ids when several are created in the same millisecond.
export const newId = (): string => randomUUID();
