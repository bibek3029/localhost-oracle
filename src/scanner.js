import fs from "fs/promises";
import path from "path";

const MAX_FILES = 20_000;
const MAX_DEPTH = 6;

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  ".venv",
  "venv",
  "__pycache__"
]);

export async function scanDirectory(rootPath) {
  const files = [];

  async function walk(currentPath, depth) {
    if (depth > MAX_DEPTH || files.length >= MAX_FILES) {
      return;
    }

    const entries = await fs.readdir(currentPath, {
      withFileTypes: true
    });

    for (const entry of entries) {
      if (files.length >= MAX_FILES) {
        return;
      }

      if (
        entry.isDirectory() &&
        IGNORED_DIRECTORIES.has(entry.name)
      ) {
        continue;
      }

      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath, depth + 1);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const stats = await fs.stat(fullPath);

      files.push({
        name: entry.name,
        extension: path.extname(entry.name).toLowerCase(),
        size: stats.size,
        modified: stats.mtime.toISOString(),
        depth
      });
    }
  }

  await walk(rootPath, 0);

  const extensionCounts = {};

  for (const file of files) {
    const extension = file.extension || "[no extension]";

    extensionCounts[extension] =
      (extensionCounts[extension] || 0) + 1;
  }

  const totalSize = files.reduce(
    (sum, file) => sum + file.size,
    0
  );

  const deepestFolder = files.reduce(
    (max, file) => Math.max(max, file.depth),
    0
  );

  const finalPatternCount = files.filter((file) =>
    /final[_ -]?v?\d+/i.test(file.name)
  ).length;

  return {
    rootPath,
    totalFiles: files.length,
    totalSize,
    deepestFolder,
    finalPatternCount,
    extensionCounts,
    files
  };
}