import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/database.js";

const seedsDirectory = resolve(
  fileURLToPath(new URL("../../../../database/seeds", import.meta.url)),
);

async function seed(): Promise<void> {
  const files = (await readdir(seedsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right));

  for (const file of files) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(await readFile(resolve(seedsDirectory, file), "utf8"));
      await client.query("COMMIT");
      console.info(`Applied seed ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

try {
  await seed();
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
