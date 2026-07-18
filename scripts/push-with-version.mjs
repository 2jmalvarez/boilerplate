import { spawnSync } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

function runGit(args, options = {}) {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function readGit(args) {
  const result = runGit(args, { capture: true });

  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }

  return result.stdout.trim();
}

const pushArgs = process.argv.slice(2);
const status = readGit(["status", "--porcelain"]);

if (status) {
  console.error("Commit or stash all changes before running pnpm push.");
  process.exit(1);
}

const pendingPath = readGit([
  "rev-parse",
  "--git-path",
  "version-push-pending",
]);
const head = readGit(["rev-parse", "HEAD"]);
let pendingCommit;

try {
  pendingCommit = (await readFile(pendingPath, "utf8")).trim();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

if (pendingCommit !== head) {
  await rm(pendingPath, { force: true });
  pendingCommit = undefined;
}

if (!pendingCommit) {
  const dryRun = runGit(["push", "--dry-run", ...pushArgs]);
  if (dryRun.status !== 0) process.exit(dryRun.status ?? 1);

  const bump = spawnSync(
    process.execPath,
    [fileURLToPath(new URL("bump-version.mjs", import.meta.url)), "patch"],
    { stdio: "inherit" },
  );
  if (bump.status !== 0) process.exit(bump.status ?? 1);

  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  if (runGit(["add", "package.json"]).status !== 0) process.exit(1);
  if (
    runGit([
      "commit",
      "-m",
      `chore: bump version to ${packageJson.version}`,
      "--",
      "package.json",
    ]).status !== 0
  ) {
    process.exit(1);
  }

  pendingCommit = readGit(["rev-parse", "HEAD"]);
  await writeFile(pendingPath, `${pendingCommit}\n`);
}

const push = runGit(["push", ...pushArgs]);
if (push.status !== 0) {
  console.error(
    "Push failed. Run pnpm push again to retry without another bump.",
  );
  process.exit(push.status ?? 1);
}

await rm(pendingPath, { force: true });
