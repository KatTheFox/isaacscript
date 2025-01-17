import path from "node:path";
import { Config } from "./classes/Config.js";
import type { ValidatedConfig } from "./classes/ValidatedConfig.js";
import { getModsDir } from "./commands/init/getModsDir.js";
import { promptSaveSlot } from "./commands/init/promptSaveSlot.js";
import { CONFIG_FILE_NAME, CONFIG_FILE_PATH, CWD } from "./constants.js";
import { fileExists, writeFile } from "./file.js";
import { fatalError } from "./isaacScriptCommonTS.js";
import { getJSONC } from "./json.js";
import type { Args } from "./parseArgs.js";

const NUM_INDENT_SPACES = 2;

export async function getConfigFromFile(
  args: Args,
  typeScript: boolean,
): Promise<ValidatedConfig> {
  const verbose = args.verbose === true;
  const yes = args.yes === true;
  const dev = args.dev === true;

  const existingConfig = getExistingConfig(verbose);
  if (existingConfig !== undefined) {
    return existingConfig;
  }

  // No config file exists, so prompt the user for some information and create one.
  const modsDirectory = await getModsDir(args, typeScript, verbose);
  const saveSlot = await promptSaveSlot(args, yes);
  const config = new Config(modsDirectory, saveSlot, dev) as ValidatedConfig;
  createConfigFile(CWD, config, typeScript, verbose);

  return config;
}

function getExistingConfig(verbose: boolean): ValidatedConfig | undefined {
  if (!fileExists(CONFIG_FILE_PATH, verbose)) {
    return undefined;
  }

  const config = getJSONC(CONFIG_FILE_PATH, verbose);
  validateMandatoryConfigFields(config);

  return config as unknown as ValidatedConfig;
}

/**
 * Even though some fields are always initialized in the class, it may not be necessarily exist in
 * the JSON file.
 */
function validateMandatoryConfigFields(config: Record<string, unknown>) {
  if (config["modsDirectory"] === undefined) {
    errorMissing(
      "modsDirectory",
      "This should be equal to the directory where Isaac mods live on your system.",
    );
  }

  if (config["saveSlot"] === undefined) {
    errorMissing(
      "saveSlot",
      "This should be equal to the save slot that you test your mods on.",
    );
  }
}

function errorMissing(field: string, description: string): never {
  fatalError(
    `The "${CONFIG_FILE_NAME}" file is missing a "${field}" value. ${description} Please add it.`,
  );
}

export function createConfigFile(
  projectPath: string,
  config: Config,
  typeScript: boolean,
  verbose: boolean,
): void {
  if (typeScript) {
    return;
  }

  const configFilePath = path.join(projectPath, CONFIG_FILE_NAME);
  const configContents = JSON.stringify(config, undefined, NUM_INDENT_SPACES);

  // Add a newline at the end to satisfy Prettier.
  const configContentsWithNewline = `${configContents}\n`;

  writeFile(configFilePath, configContentsWithNewline, verbose);
}
