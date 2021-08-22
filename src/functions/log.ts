import { hasFlag } from "./flag";

// This function is part of the sandbox provided by the Racing+ client
declare global {
  function getParentFunctionDescription(this: void, levels: int): string;
}

export function getDebugPrependString(
  msg: string,
  // We use 3 as a default because:
  // 1 - getDebugPrependString
  // 2 - calling function
  // 3 - the function that calls the calling function
  numParentFunctions = 3,
): string {
  if (debug !== undefined) {
    // The --luadebug launch flag is enabled
    const debugTable = debug.getinfo(numParentFunctions);
    if (debugTable !== undefined) {
      return `${debugTable.name}:${debugTable.linedefined} - ${msg}`;
    }
  }

  if (getParentFunctionDescription !== undefined) {
    // The Racing+ sandbox is enabled
    return `${getParentFunctionDescription(numParentFunctions + 1)} - ${msg}`;
  }

  return msg;
}

/**
 * Helper function to avoid typing out `Isaac.DebugString()`.
 * If you have the --luadebug launch flag turned on or the Racing+ sandbox enabled,
 * then this function will also prepend the function name and the line number before the string.
 */
export function log(msg: string): void {
  const debugMsg = getDebugPrependString(msg);
  Isaac.DebugString(debugMsg);
}

/**
 * Helper function for printing out every damage flag that is turned on. Helpful when debugging.
 */
export function logAllDamageFlags(flags: int): void {
  logAllFlags(flags, DamageFlag as unknown as LuaTable, "damage");
}

/**
 * Helper function for printing out every entity flag that is turned on. Helpful when debugging.
 */
export function logAllEntityFlags(flags: int): void {
  logAllFlags(flags, EntityFlag as unknown as LuaTable, "entity");
}

/**
 * Helper function for printing out every flag that is turned on. Helpful when debugging.
 */
export function logAllFlags(
  flags: int,
  flagEnum: LuaTable,
  description = "",
): void {
  if (description !== "") {
    description += " ";
  }
  log(`Logging all ${description}flags:`);
  for (const [key, value] of pairs(flagEnum)) {
    if (hasFlag(flags, value)) {
      log(`- Has flag: ${key}`);
    }
  }
}

export function logAllGameStateFlags(): void {
  const game = Game();

  log("Logging all game state flags:");
  for (const [key, value] of Object.entries(GameStateFlag)) {
    const gameStateFlag = value as GameStateFlag;
    const flagValue = game.GetStateFlag(gameStateFlag);
    if (flagValue) {
      log(`- Has flag: ${key}`);
    }
  }
}

/**
 * Helper function for printing out every projectile flag that is turned on. Helpful when debugging.
 */
export function logAllProjectileFlags(flags: int): void {
  logAllFlags(flags, ProjectileFlags as unknown as LuaTable, "projectile");
}

/**
 * Helper function for printing out every use flag that is turned on. Helpful when debugging.
 */
export function logAllUseFlags(flags: int): void {
  logAllFlags(flags, UseFlag as unknown as LuaTable, "use");
}
