import chalk from "chalk";
import { repeat } from "isaacscript-common-ts";
import path from "node:path";
import { Config } from "../../classes/Config.js";
import { createConfigFile } from "../../configFile.js";
import {
  CI_YML,
  CI_YML_TEMPLATE_PATH,
  GITIGNORE,
  GITIGNORE_TEMPLATE_PATH,
  MAIN_DEV_TS_TEMPLATE_PATH,
  MAIN_TS,
  MAIN_TS_TEMPLATE_PATH,
  METADATA_XML,
  METADATA_XML_TEMPLATE_PATH,
  PACKAGE_JSON,
  PACKAGE_JSON_TEMPLATE_PATH,
  README_MD,
  README_MD_TEMPLATES_PATH,
  TEMPLATES_STATIC_DIR,
} from "../../constants.js";
import { PackageManager } from "../../enums/PackageManager.js";
import { execShell, execShellString } from "../../exec.js";
import * as file from "../../file.js";
import { initGitRepository } from "../../git.js";
import {
  getPackageManagerInstallCICommand,
  getPackageManagerInstallCommand,
  getPackageManagerLockFileName,
  getPackageManagerNPXCommand,
} from "../../packageManager.js";

export function createProject(
  projectName: string,
  authorName: string | undefined,
  projectPath: string,
  createNewDir: boolean,
  modsDirectory: string,
  saveSlot: number,
  gitRemoteURL: string | undefined,
  skipInstall: boolean,
  packageManager: PackageManager,
  dev: boolean,
  verbose: boolean,
): void {
  if (createNewDir) {
    file.makeDir(projectPath, verbose);
  }

  const config = new Config(modsDirectory, saveSlot, dev);
  createConfigFile(projectPath, config, verbose);

  copyStaticFiles(projectPath, verbose);
  copyDynamicFiles(
    projectName,
    authorName,
    projectPath,
    packageManager,
    dev,
    verbose,
  );
  updateNodeModules(projectPath, packageManager, verbose);
  installNodeModules(projectPath, skipInstall, packageManager, verbose);
  formatFiles(projectPath, packageManager, verbose);

  // Only make the initial commit once all of the files have been copied and formatted.
  initGitRepository(projectPath, gitRemoteURL, verbose);

  console.log(`Successfully created mod: ${chalk.green(projectName)}`);
}

/** Copy static files, like ".eslintrc.cjs", "tsconfig.json", etc. */
function copyStaticFiles(projectPath: string, verbose: boolean) {
  const staticFileList = file.getDirList(TEMPLATES_STATIC_DIR, verbose);
  for (const fileName of staticFileList) {
    const templateFilePath = path.join(TEMPLATES_STATIC_DIR, fileName);
    const destinationFilePath = path.join(projectPath, fileName);
    if (!file.exists(destinationFilePath, verbose)) {
      file.copy(templateFilePath, destinationFilePath, verbose);
    }
  }

  // Rename ".eslintrc.template.js" to ".eslintrc.cjs". (If it is kept as ".eslintrc.cjs", then
  // local linting will fail.)
  const ESLintConfigPath = path.join(projectPath, ".eslintrc.template.cjs");
  const correctESLintConfigPath = path.join(projectPath, ".eslintrc.cjs");
  file.rename(ESLintConfigPath, correctESLintConfigPath, verbose);

  // Rename "gitattributes" to ".gitattributes". (If it is kept as ".gitattributes", then it won't
  // be committed to git.)
  const gitAttributesPath = path.join(projectPath, "gitattributes");
  const correctGitAttributesPath = path.join(projectPath, ".gitattributes");
  file.rename(gitAttributesPath, correctGitAttributesPath, verbose);

  // Rename "cspell.template.json" to "cspell.json". (If it is kept as "cspell.json", then local
  // spell checking will fail.)
  const cSpellConfigPath = path.join(projectPath, "cspell.template.json");
  const correctCSpellConfigPath = path.join(projectPath, "cspell.json");
  file.rename(cSpellConfigPath, correctCSpellConfigPath, verbose);
}

/** Copy files that need to have text replaced inside of them. */
function copyDynamicFiles(
  projectName: string,
  authorName: string | undefined,
  projectPath: string,
  packageManager: PackageManager,
  dev: boolean,
  verbose: boolean,
) {
  const workflowsPath = path.join(projectPath, ".github", "workflows");
  file.makeDir(workflowsPath, verbose);

  // `.github/workflows/ci.yml`
  {
    const fileName = CI_YML;
    const templatePath = CI_YML_TEMPLATE_PATH;
    const template = file.read(templatePath, verbose);

    const lockFileName = getPackageManagerLockFileName(packageManager);
    const installCommand = getPackageManagerInstallCICommand(packageManager);
    const ciYML = template
      .replaceAll("PACKAGE-MANAGER-NAME", packageManager)
      .replaceAll("PACKAGE-MANAGER-LOCK-FILE-NAME", lockFileName)
      .replaceAll("PACKAGE-MANAGER-INSTALL", installCommand)
      .replaceAll("PROJECT-NAME", projectName);

    const destinationPath = path.join(workflowsPath, fileName);
    file.write(destinationPath, ciYML, verbose);
  }

  // `.gitignore`
  {
    const fileName = GITIGNORE;
    const templatePath = GITIGNORE_TEMPLATE_PATH;
    const template = file.read(templatePath, verbose);

    // Prepend a header with the project name.
    let separatorLine = "# ";
    repeat(projectName.length, () => {
      separatorLine += "-";
    });
    separatorLine += "\n";
    const gitignoreHeader = `${separatorLine}# ${projectName}\n${separatorLine}\n`;
    const gitignore = gitignoreHeader + template;

    const destinationPath = path.join(projectPath, `.${fileName}`); // We need to prepend a period
    file.write(destinationPath, gitignore, verbose);
  }

  // `package.json`
  {
    // Modify and copy the file.
    const fileName = PACKAGE_JSON;
    const templatePath = PACKAGE_JSON_TEMPLATE_PATH;
    const template = file.read(templatePath, verbose);

    let packageJSON = template.replaceAll("MOD-NAME-TO-REPLACE", projectName);
    if (authorName === undefined) {
      // Remove the "author" line.
      packageJSON = packageJSON.replace(/^\s"author":.*$*/gm, "");
    } else {
      packageJSON = packageJSON.replaceAll("AUTHOR-NAME", authorName);
    }

    const destinationPath = path.join(projectPath, fileName);
    file.write(destinationPath, packageJSON, verbose);
  }

  // `README.md`
  {
    const fileName = README_MD;
    const templatePath = README_MD_TEMPLATES_PATH;
    const template = file.read(templatePath, verbose);
    const readmeMD = template.replaceAll("MOD-NAME-TO-REPLACE", projectName);
    const destinationPath = path.join(projectPath, fileName);
    file.write(destinationPath, readmeMD, verbose);
  }

  const modPath = path.join(projectPath, "mod");
  file.makeDir(modPath, verbose);

  // `mod/metadata.xml`
  {
    const fileName = METADATA_XML;
    const templatePath = METADATA_XML_TEMPLATE_PATH;
    const template = file.read(templatePath, verbose);
    const metadataXML = template.replaceAll("MOD-NAME-TO-REPLACE", projectName);
    const destinationPath = path.join(modPath, fileName);
    file.write(destinationPath, metadataXML, verbose);
  }

  const srcPath = path.join(projectPath, "src");
  file.makeDir(srcPath, verbose);

  // `src/main.ts`
  {
    // Convert snake_case and kebab-case to camelCase. (Kebab-case in particular will make the
    // example TypeScript file fail to compile.)
    const fileName = MAIN_TS;
    const templatePath = MAIN_TS_TEMPLATE_PATH;
    const template = file.read(templatePath, verbose);
    const mainTS = template.replaceAll("MOD-NAME-TO-REPLACE", projectName);
    const destinationPath = path.join(srcPath, fileName);
    file.write(destinationPath, mainTS, verbose);
  }

  // If we are initializing an IsaacScript project intended to be used for development, we can
  // include a better starter file.
  if (dev) {
    const fileName = MAIN_TS;
    const templatePath = MAIN_DEV_TS_TEMPLATE_PATH;
    const template = file.read(templatePath, verbose);
    const mainTS = template; // No replacements are necessary for this file.
    const destinationPath = path.join(srcPath, fileName);
    file.write(destinationPath, mainTS, verbose);
  }
}

/** The "package.json" file has to be copied first before this step. */
function updateNodeModules(
  projectPath: string,
  packageManager: PackageManager,
  verbose: boolean,
) {
  console.log(
    'Finding out the latest versions of the packages with "npm-check-updates"...',
  );
  const packageManagerNPXCommand = getPackageManagerNPXCommand(packageManager);
  execShell(
    packageManagerNPXCommand,
    [
      "npm-check-updates",
      "--upgrade",
      "--packageFile",
      "package.json",
      "--filterVersion",
      "^*",
    ],
    verbose,
    false,
    projectPath,
  );
}

function installNodeModules(
  projectPath: string,
  skipInstall: boolean,
  packageManager: PackageManager,
  verbose: boolean,
) {
  if (skipInstall) {
    return;
  }

  const command = getPackageManagerInstallCommand(packageManager);
  console.log(
    `Installing node modules with "${command}"... (This can take a long time.)`,
  );
  execShellString(command, verbose, false, projectPath);
}

function formatFiles(
  projectPath: string,
  packageManager: PackageManager,
  verbose: boolean,
) {
  const packageManagerNPXCommand = getPackageManagerNPXCommand(packageManager);
  execShell(
    packageManagerNPXCommand,
    ["prettier", "--write", projectPath],
    verbose,
    false,
    projectPath,
  );
}