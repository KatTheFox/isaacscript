import chalk from "chalk";
import commandExists from "command-exists";
import path from "node:path";
import { CWD, PROJECT_NAME } from "../../constants.js";
import { PackageManager } from "../../enums/PackageManager.js";
import {
  getPackageManagerNPXCommand,
  getPackageManagerUsedForNewProject,
} from "../../packageManager.js";
import { Args } from "../../parseArgs.js";
import { checkIfProjectPathExists } from "./checkIfProjectPathExists.js";
import { checkModSubdirectory } from "./checkModSubdirectory.js";
import { checkModTargetDirectory } from "./checkModTargetDirectory.js";
import { createMod } from "./createMod.js";
import { getModsDir } from "./getModsDir.js";
import { getProjectPath } from "./getProjectPath.js";
import { promptGitHubRepoOrGitRemoteURL } from "./git.js";
import { installVSCodeExtensions } from "./installVSCodeExtensions.js";
import { promptSaveSlot } from "./promptSaveSlot.js";
import { promptVSCode } from "./promptVSCode.js";

export async function init(args: Args): Promise<void> {
  const packageManager = getPackageManagerUsedForNewProject(args);
  const noGit = args.noGit === true;
  const skipInstall = args.skipInstall === true;
  const useCurrentDir = args.useCurrentDir === true;
  const verbose = args.verbose === true;
  const vscode = args.vscode === true;
  const yes = args.yes === true;
  const forceName = args.forceName === true;
  const dev = args.dev === true;

  // Prompt the end-user for some information (and validate it as we go).
  const [projectPath, createNewDir] = await getProjectPath(
    args,
    useCurrentDir,
    yes,
    forceName,
  );
  await checkIfProjectPathExists(projectPath, yes, verbose);
  const modsDirectory = await getModsDir(args, verbose);
  checkModSubdirectory(projectPath, modsDirectory);
  const projectName = path.basename(projectPath);
  await checkModTargetDirectory(modsDirectory, projectName, yes, verbose);
  const saveSlot = await promptSaveSlot(args, yes);
  const gitRemoteURL = await promptGitHubRepoOrGitRemoteURL(
    projectName,
    noGit,
    yes,
    dev,
    verbose,
  );

  // Now that we have asked the user all of the questions we need, we can create the project.
  createMod(
    projectName,
    projectPath,
    createNewDir,
    modsDirectory,
    saveSlot,
    gitRemoteURL,
    skipInstall,
    packageManager,
    dev,
    verbose,
  );

  await openVSCode(projectPath, vscode, yes, verbose);
  printFinishMessage(projectPath, projectName, packageManager);
}

async function openVSCode(
  projectPath: string,
  vscode: boolean,
  yes: boolean,
  verbose: boolean,
) {
  const VSCodeCommand = getVSCodeCommand();
  if (VSCodeCommand === undefined) {
    console.log(
      'VSCode does not seem to be installed. (The "code" command is not in the path.) Skipping VSCode-related things.',
    );
    return;
  }

  installVSCodeExtensions(projectPath, VSCodeCommand, verbose);
  await promptVSCode(projectPath, VSCodeCommand, vscode, yes, verbose);
}

function getVSCodeCommand(): string | undefined {
  for (const VSCodeCommand of ["code", "codium", "code-oss", "code-insiders"]) {
    if (commandExists.sync(VSCodeCommand)) {
      return VSCodeCommand;
    }
  }

  return undefined;
}

function printFinishMessage(
  projectPath: string,
  projectName: string,
  packageManager: PackageManager,
) {
  let commandsToType = "";
  if (projectPath !== CWD) {
    commandsToType += `"${chalk.green(`cd ${projectName}`)}" and `;
  }
  const packageManagerNPXCommand = getPackageManagerNPXCommand(packageManager);
  commandsToType += `"${chalk.green(
    `${packageManagerNPXCommand} isaacscript`,
  )}"`;
  console.log(`Now, start ${PROJECT_NAME} by typing ${commandsToType}.`);
}
