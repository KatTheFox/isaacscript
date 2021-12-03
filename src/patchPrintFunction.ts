import { isLuaDebugEnabled } from "./functions/util";
import { isVector } from "./functions/vector";

declare let print: PrintFunction;

// eslint-disable-next-line no-underscore-dangle,@typescript-eslint/naming-convention
declare let __PATCHED_PRINT: boolean | undefined;

type PrintFunction = (this: void, ...args: unknown[]) => void;

/**
 * When the "--luadebug" flag is enabled, the `print` function will no longer print messages to the
 * "log.txt" file or the in-game console. This function monkey patches the `print` function to
 * restore this functionality.
 *
 * If the "--luadebug" flag is disabled, this function will do nothing.
 *
 * @internal
 */
export function patchPrintFunction() {
  // Only replace the function if the "--luadebug" launch flag is enabled
  if (!isLuaDebugEnabled()) {
    return;
  }

  // Do nothing if the function was already patched
  if (__PATCHED_PRINT !== undefined) {
    return;
  }
  __PATCHED_PRINT = true;

  print = printForLuaDebug; // eslint-disable-line @typescript-eslint/no-unused-vars
}

function printForLuaDebug(this: void, ...args: unknown[]) {
  const msg = getPrintMsg(args);

  // First, write it to the log.txt
  Isaac.DebugString(msg);

  // Second, write it to the console
  // (this needs to be terminated by a newline or else it won't display properly)
  const msgWithNewline = `${msg}\n`;
  Isaac.ConsoleOutput(msgWithNewline);
}

function getPrintMsg(args: unknown[]): string {
  if (args.length === 0) {
    return tostring(undefined);
  }

  let msg = "";
  for (const arg of args) {
    // Separate multiple arguments with a space
    // (a tab character appears as a circle in the console, which is unsightly)
    if (msg !== "") {
      msg += " ";
    }

    msg += getValueToPrint(arg);
  }

  return msg;
}

function getValueToPrint(arg: unknown) {
  // Provide special formatting for Vectors
  if (isVector(arg)) {
    const vector = arg as Vector;
    return `Vector(${vector.X}, ${vector.Y})`;
  }

  // By default, simply coerce the argument to a string, whatever it is
  return tostring(arg);
}
