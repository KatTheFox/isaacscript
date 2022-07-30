import { GridEntityType } from "isaac-typescript-definitions";

export type PostGridEntityCustomUpdateRegisterParameters = [
  callback: (
    gridEntity: GridEntity,
    gridEntityTypeCustom: GridEntityType,
  ) => void,
  gridEntityTypeCustom?: GridEntityType,
];

const subscriptions: PostGridEntityCustomUpdateRegisterParameters[] = [];

export function postGridEntityCustomUpdateHasSubscriptions(): boolean {
  return subscriptions.length > 0;
}

export function postGridEntityCustomUpdateRegister(
  ...args: PostGridEntityCustomUpdateRegisterParameters
): void {
  subscriptions.push(args);
}

export function postGridEntityCustomUpdateFire(
  gridEntity: GridEntity,
  gridEntityTypeCustom: GridEntityType,
): void {
  for (const [callback, callbackGridEntityTypeCustom] of subscriptions) {
    // Handle the optional 2nd callback argument.
    if (
      callbackGridEntityTypeCustom !== undefined &&
      callbackGridEntityTypeCustom !== gridEntityTypeCustom
    ) {
      continue;
    }

    callback(gridEntity, gridEntityTypeCustom);
  }
}
