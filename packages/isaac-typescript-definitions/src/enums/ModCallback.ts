export enum ModCallback {
  POST_NPC_UPDATE = 0,
  POST_UPDATE = 1,
  POST_RENDER = 2,
  POST_USE_ITEM = 3,
  POST_PEFFECT_UPDATE = 4,
  POST_USE_CARD = 5,
  POST_FAMILIAR_UPDATE = 6,

  /**
   * Unlike in Afterbirth+, in Repentance this callback properly populates the following fields:
   *
   * - `Position`
   * - `SpawnerEntity`
   * - `SpawnerType`
   * - `SpawnerVariant`
   * - `Velocity`
   */
  POST_FAMILIAR_INIT = 7,

  EVALUATE_CACHE = 8,

  /** This will fire at the beginning of a run and upon continuing a saved run. */
  POST_PLAYER_INIT = 9,

  POST_USE_PILL = 10,
  ENTITY_TAKE_DMG = 11,
  POST_CURSE_EVAL = 12,
  INPUT_ACTION = 13,
  POST_GAME_STARTED = 15,
  POST_GAME_END = 16,
  PRE_GAME_EXIT = 17,
  POST_NEW_LEVEL = 18,
  POST_NEW_ROOM = 19,
  GET_CARD = 20,
  GET_SHADER_PARAMS = 21,
  EXECUTE_CMD = 22,
  PRE_USE_ITEM = 23,
  PRE_ENTITY_SPAWN = 24,
  POST_FAMILIAR_RENDER = 25,
  PRE_FAMILIAR_COLLISION = 26,

  /**
   * Unlike in Afterbirth+, in Repentance this callback properly populates the following fields:
   *
   * - `Position`
   * - `SpawnerEntity`
   * - `SpawnerType`
   * - `SpawnerVariant`
   * - `Velocity`
   */
  POST_NPC_INIT = 27,

  POST_NPC_RENDER = 28,
  POST_NPC_DEATH = 29,
  PRE_NPC_COLLISION = 30,
  POST_PLAYER_UPDATE = 31,
  POST_PLAYER_RENDER = 32,
  PRE_PLAYER_COLLISION = 33,

  /**
   * Unlike in Afterbirth+, in Repentance this callback properly populates the following fields:
   *
   * - `Position`
   * - `SpawnerEntity`
   * - `SpawnerType`
   * - `SpawnerVariant`
   * - `Velocity`
   */
  POST_PICKUP_INIT = 34,

  POST_PICKUP_UPDATE = 35,
  POST_PICKUP_RENDER = 36,
  POST_PICKUP_SELECTION = 37,
  PRE_PICKUP_COLLISION = 38,

  /**
   * Unlike in Afterbirth+, in Repentance this callback properly populates the following fields:
   *
   * - `Position`
   * - `SpawnerEntity`
   * - `SpawnerType`
   * - `SpawnerVariant`
   * - `Velocity`
   */
  POST_TEAR_INIT = 39,

  POST_TEAR_UPDATE = 40,
  POST_TEAR_RENDER = 41,
  PRE_TEAR_COLLISION = 42,

  /**
   * Unlike in Afterbirth+, in Repentance this callback properly populates the following fields:
   *
   * - `Position`
   * - `SpawnerEntity`
   * - `SpawnerType`
   * - `SpawnerVariant`
   * - `Velocity`
   */
  POST_PROJECTILE_INIT = 43,

  POST_PROJECTILE_UPDATE = 44,
  POST_PROJECTILE_RENDER = 45,
  PRE_PROJECTILE_COLLISION = 46,

  /**
   * Unlike in Afterbirth+, in Repentance this callback properly populates the following fields:
   *
   * - `Position`
   * - `SpawnerEntity`
   * - `SpawnerType`
   * - `SpawnerVariant`
   * - `Velocity`
   */
  POST_LASER_INIT = 47,

  POST_LASER_UPDATE = 48,
  POST_LASER_RENDER = 49,

  /**
   * Unlike in Afterbirth+, in Repentance this callback properly populates the following fields:
   *
   * - `Position`
   * - `SpawnerEntity`
   * - `SpawnerType`
   * - `SpawnerVariant`
   * - `Velocity`
   */
  POST_KNIFE_INIT = 50,

  POST_KNIFE_UPDATE = 51,
  POST_KNIFE_RENDER = 52,
  PRE_KNIFE_COLLISION = 53,

  /**
   * Unlike in Afterbirth+, in Repentance this callback properly populates the following fields:
   *
   * - `Position`
   * - `SpawnerEntity`
   * - `SpawnerType`
   * - `SpawnerVariant`
   * - `Velocity`
   */
  POST_EFFECT_INIT = 54,

  POST_EFFECT_UPDATE = 55,
  POST_EFFECT_RENDER = 56,

  /**
   * Unlike in Afterbirth+, in Repentance this callback properly populates the following fields:
   *
   * - `Position`
   * - `SpawnerEntity`
   * - `SpawnerType`
   * - `SpawnerVariant`
   * - `Velocity`
   */
  POST_BOMB_INIT = 57,

  POST_BOMB_UPDATE = 58,
  POST_BOMB_RENDER = 59,
  PRE_BOMB_COLLISION = 60,
  POST_FIRE_TEAR = 61,
  PRE_GET_COLLECTIBLE = 62,
  POST_GET_COLLECTIBLE = 63,
  GET_PILL_COLOR = 64,
  GET_PILL_EFFECT = 65,
  GET_TRINKET = 66,
  POST_ENTITY_REMOVE = 67,
  POST_ENTITY_KILL = 68,
  PRE_NPC_UPDATE = 69,
  PRE_SPAWN_CLEAN_AWARD = 70,
  PRE_ROOM_ENTITY_SPAWN = 71,
}
