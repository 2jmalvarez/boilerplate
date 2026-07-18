import { readFile, writeFile } from "node:fs/promises";

const release = process.argv[2] ?? "patch";
const releaseIndexes = { major: 0, minor: 1, patch: 2 };

if (!(release in releaseIndexes)) {
  console.error("Usage: pnpm version:bump [major|minor|patch]");
  process.exit(1);
}

const packagePath = new URL("../package.json", import.meta.url);
const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(packageJson.version);

if (!match) {
  console.error(`Invalid version in package.json: ${packageJson.version}`);
  process.exit(1);
}

const version = match.slice(1).map(Number);
const releaseIndex = releaseIndexes[release];

version[releaseIndex] += 1;
for (let index = releaseIndex + 1; index < version.length; index += 1) {
  version[index] = 0;
}

packageJson.version = version.join(".");
await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log(`Version bumped to ${packageJson.version}`);
