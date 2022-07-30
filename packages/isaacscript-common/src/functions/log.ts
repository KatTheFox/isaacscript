import {
  DamageFlag,
  EntityFlag,
  GameStateFlag,
  GridRoom,
  HeartSubType,
  LevelStateFlag,
  ProjectileFlag,
  SeedEffect,
  SoundEffect,
  TearFlag,
  UseFlag,
} from "isaac-typescript-definitions";
import { game, sfxManager } from "../core/cachedClasses";
import { arrayToString } from "./array";
import { getCollectibleName } from "./collectibles";
import { getEntityID } from "./entities";
import { getEnumEntries } from "./enums";
import { hasFlag } from "./flag";
import { getIsaacAPIClassName } from "./isaacAPIClass";
import { getPlayerHealth } from "./playerHealth";
import { getEffectsList, getPlayerName } from "./players";
import { getRoomData, getRoomGridIndex, getRoomListIndex } from "./roomData";
import { combineSets, getSortedSetValues } from "./set";
import { iterateTableInOrder } from "./table";
import { getTrinketName } from "./trinkets";
import { isTable, isUserdata } from "./types";
import { printConsole } from "./utils";
import { vectorToString } from "./vector";

/**
 * Helper function to prefix the name of the function and the line number before a debug message.
 */
export function getDebugPrependString(
  msg: string,
  // We use 3 as a default because:
  // - 1 - getDebugPrependString
  // - 2 - calling function
  // - 3 - the function that calls the calling function
  numParentFunctions = 3,
): string {
  // "debug" is not always defined like the Lua definitions imply.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (debug !== undefined) {
    // The "--luadebug" launch flag is enabled.
    const debugTable = debug.getinfo(numParentFunctions);
    if (debugTable !== undefined) {
      return `${debugTable.name}:${debugTable.linedefined} - ${msg}`;
    }
  }

  if (getParentFunctionDescription !== undefined) {
    // The Racing+ sandbox is enabled.
    return `${getParentFunctionDescription(numParentFunctions + 1)} - ${msg}`;
  }

  return msg;
}

/**
 * Helper function to avoid typing out `Isaac.DebugString()`.
 *
 * If you have the "--luadebug" launch flag turned on or the Racing+ sandbox enabled, then this
 * function will also prepend the function name and the line number before the string.
 */
export function log(this: void, msg: string): void {
  const debugMsg = getDebugPrependString(msg);
  Isaac.DebugString(debugMsg);
}

export function logArray<T>(this: void, array: T[] | readonly T[]): void {
  const arrayString = arrayToString(array);
  log(`Array: ${arrayString}`);
}

export function logColor(this: void, color: Color): void {
  log(
    `Color: R${color.R}, G${color.G}, B${color.B}, A${color.A}, RO${color.RO}, BO${color.BO}, GO${color.GO}`,
  );
}

/** Helper function for printing out every damage flag that is turned on. Useful when debugging. */
export function logDamageFlags(
  this: void,
  flags: DamageFlag | BitFlags<DamageFlag>,
): void {
  logFlags(flags, DamageFlag, "damage");
}

/** Helper function for printing out every entity flag that is turned on. Useful when debugging. */
export function logEntityFlags(
  this: void,
  flags: EntityFlag | BitFlags<EntityFlag>,
): void {
  logFlags(flags, EntityFlag, "entity");
}

export function logEntityID(this: void, entity: Entity): void {
  const entityID = getEntityID(entity);
  log(`Entity: ${entityID}`);
}

/**
 * Helper function to log an error message and also print it to the console for better visibility.
 *
 * This is useful in situations where using the `error` function would be dangerous (since it
 * prevents all of the subsequent code in the callback from running).
 */
export function logError(this: void, msg: string): void {
  const errorMsg = `Error: ${msg}`;
  log(errorMsg);
  printConsole(errorMsg);
}

/** Helper function for printing out every flag that is turned on. Useful when debugging. */
export function logFlags<T extends BitFlag | BitFlag128>(
  this: void,
  flags: T | BitFlags<T>,
  flagEnum: Record<string, T>,
  description = "",
): void {
  if (description !== "") {
    description = "flag";
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  log(`Logging ${description} values for: ${flags}`);
  let hasNoFlags = true;
  for (const [key, value] of getEnumEntries(flagEnum)) {
    if (hasFlag(flags, value)) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      log(`  Has flag: ${key} (${value})`);
      hasNoFlags = false;
    }
  }

  if (hasNoFlags) {
    log("  n/a (no flags)");
  }
}

/**
 * Helper function for printing out every game state flag that is turned on. Useful when debugging.
 */
export function logGameStateFlags(this: void): void {
  log("Logging game state flags:");

  const gameStateFlagEntries = getEnumEntries(GameStateFlag);

  let hasNoFlags = true;
  for (const [key, gameStateFlag] of gameStateFlagEntries) {
    const flagValue = game.GetStateFlag(gameStateFlag);
    if (flagValue) {
      log(`  Has flag: ${key} (${gameStateFlag})`);
      hasNoFlags = false;
    }
  }

  if (hasNoFlags) {
    log("  n/a (no flags)");
  }
}

export function logKColor(this: void, kColor: KColor): void {
  log(
    `Color: R${kColor.Red}, G${kColor.Green}, B${kColor.Blue}, A${kColor.Alpha}`,
  );
}

/**
 * Helper function for printing out every level state flag that is turned on. Useful when debugging.
 */
export function logLevelStateFlags(this: void): void {
  const level = game.GetLevel();

  const levelStateFlagEntries = getEnumEntries(LevelStateFlag);

  log("Logging level state flags:");
  let hasNoFlags = true;
  for (const [key, levelStateFlag] of levelStateFlagEntries) {
    const flagValue = level.GetStateFlag(levelStateFlag);
    if (flagValue) {
      log(`  Has flag: ${key} (${levelStateFlag})`);
      hasNoFlags = false;
    }
  }

  if (hasNoFlags) {
    log("  n/a (no flags)");
  }
}

export function logMap(this: void, map: Map<AnyNotNil, unknown>): void {
  log("Printing out a TSTL Map:");

  const mapKeys = [...map.keys()];
  mapKeys.sort();

  for (const key of mapKeys) {
    const value = map.get(key);
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    log(`  ${key} --> ${value}`);
  }

  log(`  The size of the map was: ${map.size}`);
}

export function logPlayerEffects(this: void, player: EntityPlayer): void {
  const effects = getEffectsList(player);

  log("Logging player effects:");

  if (effects.length === 0) {
    log("  n/a (no effects)");
    return;
  }

  effects.forEach((effect, i) => {
    let effectDescription: string;
    if (effect.Item.IsCollectible()) {
      const collectibleName = getCollectibleName(effect.Item.ID);
      effectDescription = `Collectible: ${collectibleName}`;
    } else if (effect.Item.IsTrinket()) {
      const trinketName = getTrinketName(effect.Item.ID);
      effectDescription = `Trinket: ${trinketName}`;
    } else if (effect.Item.IsNull()) {
      effectDescription = `Null item: ${effect.Item.ID}`;
    } else {
      effectDescription = `Unknown type of effect: ${effect.Item.ID}`;
    }

    log(`  ${i + 1}) ${effectDescription} (x${effect.Count})`);
  });
}

export function logPlayerHealth(this: void, player: EntityPlayer): void {
  const playerName = getPlayerName(player);
  const playerHealth = getPlayerHealth(player);

  log(`Player health for ${playerName}:`);
  log(`  Max hearts: ${playerHealth.maxHearts}`);
  log(`  Hearts: ${playerHealth.hearts}`);
  log(`  Eternal hearts: ${playerHealth.eternalHearts}`);
  log(`  Soul hearts: ${playerHealth.soulHearts}`);
  log(`  Bone hearts: ${playerHealth.boneHearts}`);
  log(`  Golden hearts: ${playerHealth.goldenHearts}`);
  log(`  Rotten hearts: ${playerHealth.rottenHearts}`);
  log(`  Broken hearts: ${playerHealth.brokenHearts}`);
  log(`  Soul charges: ${playerHealth.soulCharges}`);
  log(`  Blood charges: ${playerHealth.bloodCharges}`);
  log("  Soul heart types: [");
  for (const soulHeartType of playerHealth.soulHeartTypes) {
    log(`    HeartSubType.${HeartSubType[soulHeartType]}`);
  }
  log("  ]");
}

/**
 * Helper function for printing out every projectile flag that is turned on. Useful when debugging.
 */
export function logProjectileFlags(
  this: void,
  flags: ProjectileFlag | BitFlags<ProjectileFlag>,
): void {
  logFlags(flags, ProjectileFlag, "projectile");
}

/** Helper function for logging information about the current room. */
export function logRoom(this: void): void {
  const roomGridIndex = getRoomGridIndex();
  const roomListIndex = getRoomListIndex();
  const roomData = getRoomData();

  if (roomData === undefined) {
    log("Current room data is undefined.");
  } else {
    log(`Current room stage ID: ${roomData.StageID}`);
    log(
      `Current room type/variant/sub-type: ${roomData.Type}.${roomData.Variant}.${roomData.Subtype}`,
    );
    log(`Current room name: ${roomData.Name}`);
  }

  const roomGridIndexName = GridRoom[roomGridIndex];
  if (roomGridIndexName === undefined) {
    log(`Current room grid index: ${roomGridIndex}`);
  } else {
    log(
      `Current room grid index: ${roomGridIndex} (GridRoom.${roomGridIndexName})`,
    );
  }

  log(`Current room list index: ${roomListIndex}`);
}

/**
 * Helper function for printing out every seed effect (i.e. Easter Egg) that is turned on for the
 * particular run.
 */
export function logSeedEffects(this: void): void {
  const seeds = game.GetSeeds();

  const seedEffectEntries = getEnumEntries(SeedEffect);

  log("Logging seed effects:");
  let hasNoSeedEffects = true;
  for (const [key, seedEffect] of seedEffectEntries) {
    if (seeds.HasSeedEffect(seedEffect)) {
      log(`  ${key} (${seedEffect})`);
      hasNoSeedEffects = false;
    }
  }

  if (hasNoSeedEffects) {
    log("  n/a (no seed effects)");
  }
}

export function logSet(
  this: void,
  set: Set<AnyNotNil> | ReadonlySet<AnyNotNil>,
): void {
  log("Printing out a TSTL Set:");

  const setValues = getSortedSetValues(set);
  for (const value of setValues) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    log(`  Value: ${value}`);
  }

  log(`  The size of the set was: ${set.size}`);
}

/** Helper function for logging every sound effect that is currently playing. */
export function logSounds(this: void): void {
  const soundEffects = getEnumEntries(SoundEffect);

  for (const [key, soundEffect] of soundEffects) {
    if (sfxManager.IsPlaying(soundEffect)) {
      log(`Currently playing sound effect: ${key} (${soundEffect})`);
    }
  }
}

/**
 * Helper function for logging every key and value of a table. This is a deep log; the function will
 * recursively call itself if it counters a table within a table.
 *
 * This function will only work on tables that have string keys (because it logs the keys in order,
 * instead of randomly). It will throw a run-time error if it encounters a non-string key.
 */
export function logTable(
  this: void,
  luaTable: unknown,
  parentTables = 0,
): void {
  if (parentTables === 0) {
    log("Printing out a Lua table:");
  }

  const numSpaces = (parentTables + 1) * 2; // 2, 4, 6, etc.
  const indentation = " ".repeat(numSpaces);

  if (!isTable(luaTable)) {
    // Put it in an IIFE so that the it will show as "func" instead of "logTable" and align with the
    // other text.
    (() => {
      log(
        `${indentation}n/a (encountered a variable of type "${typeof luaTable}" instead of a table)`,
      );
    })();

    return;
  }

  let numElements = 0;
  iterateTableInOrder(luaTable, (key, value) => {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    log(`${indentation}${key} --> ${value}`);

    if (isTable(value)) {
      if (key === "__class") {
        log(
          `${indentation}  (skipping enumerating this key to avoid infinite recursion)`,
        );
      } else {
        logTable(value, parentTables + 1);
      }
    }

    numElements++;
  });

  // Put it in an IIFE so that the it will show as "func" instead of "logTable" and align with the
  // other text.
  (() => {
    log(`${indentation}The size of the table was: ${numElements}`);
  })();
}

/**
 * Helper function to print out the differences between the entries of two tables. Note that this
 * will only do a shallow comparison.
 */
export function logTableDifferences<K, V>(
  this: void,
  table1: LuaMap<K, V>,
  table2: LuaMap<K, V>,
): void {
  log("Comparing two Lua tables:");

  const table1Keys = Object.keys(table1);
  const table1KeysSet = new Set(table1Keys);

  const table2Keys = Object.keys(table2);
  const table2KeysSet = new Set(table2Keys);

  const keysSet = combineSets(table1KeysSet, table2KeysSet);
  const keys = [...keysSet.values()];
  keys.sort();

  for (const key of keys) {
    if (!table1KeysSet.has(key)) {
      log(`  Table 1 is missing key: ${key}`);
    } else if (!table2KeysSet.has(key)) {
      log(`  Table 2 is missing key: ${key}`);
    } else {
      const value1 = table1.get(key as unknown as K);
      const value2 = table2.get(key as unknown as K);
      if (value1 !== value2) {
        log(`  ${key} --> "${value1}" versus "${value2}"`);
      }
    }
  }
}

/** Helper function for printing out every tear flag that is turned on. Useful when debugging. */
export function logTearFlags(
  this: void,
  flags: TearFlag | BitFlags<TearFlag>,
): void {
  logFlags(flags, TearFlag, "tear");
}

/** Helper function for printing out every use flag that is turned on. Useful when debugging. */
export function logUseFlags(
  this: void,
  flags: UseFlag | BitFlags<UseFlag>,
): void {
  logFlags(flags, UseFlag, "use");
}

/**
 * Helper function to enumerate all of the properties of a "userdata" object (i.e. an object from
 * the Isaac API).
 */
export function logUserdata(this: void, userdata: unknown): void {
  if (isUserdata(userdata)) {
    log("Userdata: [not userdata]");
    return;
  }

  const metatable = getmetatable(userdata) as
    | LuaMap<AnyNotNil, unknown>
    | undefined;
  if (metatable === undefined) {
    log("Userdata: [no metatable]");
    return;
  }

  const classType = getIsaacAPIClassName(userdata);
  if (classType === undefined) {
    log("Userdata: [no class type]");
  } else {
    log(`Userdata: ${classType}`);
  }

  logTable(metatable);
}

export function logVector(this: void, vector: Vector, round = false): void {
  const vectorString = vectorToString(vector, round);
  log(`Vector: ${vectorString}`);
}

/**
 * Converts every `isaacscript-common` function that begins with "log" to a global function.
 *
 * This is useful when printing out variables from the in-game debug console.
 */
export function setLogFunctionsGlobal(): void {
  const globals = _G as Record<string, unknown>;

  globals["log"] = log;
  globals["logArray"] = logArray;
  globals["logColor"] = logColor;
  globals["logDamageFlags"] = logDamageFlags;
  globals["logEntityID"] = logEntityID;
  globals["logEntityFlags"] = logEntityFlags;
  globals["logError"] = logError;
  globals["logFlags"] = logFlags;
  globals["logGameStateFlags"] = logGameStateFlags;
  globals["logKColor"] = logKColor;
  globals["logLevelStateFlags"] = logLevelStateFlags;
  globals["logMap"] = logMap;
  globals["logPlayerEffects"] = logPlayerEffects;
  globals["logPlayerHealth"] = logPlayerHealth;
  globals["logProjectileFlags"] = logProjectileFlags;
  globals["logRoom"] = logRoom;
  globals["logSeedEffects"] = logSeedEffects;
  globals["logSet"] = logSet;
  globals["logSounds"] = logSounds;
  globals["logTable"] = logTable;
  globals["logTableDifferences"] = logTableDifferences;
  globals["logTearFlags"] = logTearFlags;
  globals["logUseFlags"] = logUseFlags;
  globals["logUserdata"] = logUserdata;
  globals["logVector"] = logVector;
}
