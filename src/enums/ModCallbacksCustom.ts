/**
 * These are the custom callbacks available for use once the mod object has been upgraded.
 * Also see the [[`upgradeMod`]] function.
 *
 * For a better listing of all custom callbacks, check out the
 * [Function Signatures](https://isaacscript.github.io/docs/function-signatures#custom-callbacks).
 */
export enum ModCallbacksCustom {
  MC_POST_BOMB_INIT_LATE,
  MC_POST_BONE_SWING,
  MC_POST_COLLECTIBLE_INIT_FIRST,
  MC_POST_CURSED_TELEPORT,
  MC_POST_CUSTOM_DOOR_ENTER,
  MC_POST_CUSTOM_REVIVE,
  MC_POST_EFFECT_INIT_LATE,
  MC_POST_EFFECT_STATE_CHANGED,
  MC_POST_ESAU_JR,
  MC_POST_FAMILIAR_INIT_LATE,
  MC_POST_FAMILIAR_STATE_CHANGED,
  MC_POST_FIRST_ESAU_JR,
  MC_POST_FIRST_FLIP,
  MC_POST_FLIP,
  MC_POST_GAME_STARTED_REORDERED,
  MC_POST_GRID_ENTITY_BROKEN,
  MC_POST_GRID_ENTITY_COLLISION,
  MC_POST_GRID_ENTITY_INIT,
  MC_POST_GRID_ENTITY_REMOVE,
  MC_POST_GRID_ENTITY_STATE_CHANGED,
  MC_POST_GRID_ENTITY_UPDATE,
  // MC_POST_HOLY_MANTLE_REMOVED,
  MC_POST_ITEM_DISCHARGE,
  MC_POST_ITEM_PICKUP,
  MC_POST_KNIFE_INIT_LATE,
  MC_POST_LASER_INIT_LATE,
  MC_POST_NEW_LEVEL_REORDERED,
  MC_POST_NEW_ROOM_EARLY,
  MC_POST_NEW_ROOM_REORDERED,
  MC_POST_NPC_INIT_LATE,
  MC_POST_NPC_STATE_CHANGED,
  MC_POST_PEFFECT_UPDATE_REORDERED,
  MC_POST_PICKUP_COLLECT,
  MC_POST_PICKUP_INIT_LATE,
  MC_POST_PICKUP_STATE_CHANGED,
  MC_POST_PLAYER_CHANGE_HEALTH,
  MC_POST_PLAYER_CHANGE_TYPE,
  MC_POST_PLAYER_FATAL_DAMAGE,
  MC_POST_PLAYER_INIT_LATE,
  MC_POST_PLAYER_INIT_REORDERED,
  MC_POST_PLAYER_RENDER_REORDERED,
  MC_POST_PLAYER_UPDATE_REORDERED,
  MC_POST_PROJECTILE_INIT_LATE,
  MC_POST_PURCHASE,
  MC_POST_ROOM_CLEAR_CHANGED,
  MC_POST_SACRIFICE,
  MC_POST_SLOT_ANIMATION_CHANGED,
  MC_POST_SLOT_DESTROYED,
  MC_POST_SLOT_INIT,
  MC_POST_SLOT_RENDER,
  MC_POST_SLOT_UPDATE,
  MC_POST_TEAR_INIT_LATE,
  MC_POST_TEAR_INIT_VERY_LATE,
  MC_POST_TRANSFORMATION,
  MC_POST_TRINKET_BREAK,

  MC_PRE_BERSERK_DEATH,
  MC_PRE_CUSTOM_REVIVE,
  MC_PRE_ITEM_PICKUP,
  MC_PRE_NEW_LEVEL,
}
