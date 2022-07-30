import { ModCallback } from "isaac-typescript-definitions";
import { getPoops } from "../functions/gridEntitiesSpecific";
import {
  postPoopUpdateFire,
  postPoopUpdateHasSubscriptions,
} from "./subscriptions/postPoopUpdate";

export function postPoopUpdateInit(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_UPDATE, postUpdate); // 1
}

function hasSubscriptions() {
  return postPoopUpdateHasSubscriptions();
}

// ModCallback.POST_UPDATE (1)
function postUpdate() {
  if (!hasSubscriptions()) {
    return;
  }

  for (const poop of getPoops()) {
    postPoopUpdateFire(poop);
  }
}
