import os from "os";
import path from "path";

import { scanDirectory } from "./scanner.js";
import { createOracleChart } from "./oracle.js";
import { askOracle } from "./qvac.js";
const homeDirectory = os.homedir();

const foldersToScan = [
  path.join(homeDirectory, "Downloads"),
  path.join(homeDirectory, "Desktop"),
  path.join(homeDirectory, "Documents")
];

console.log("\n🔮 LOCALHOST ORACLE\n");
console.log("Scanning your local folders...\n");

console.log("Folders:");
for (const folder of foldersToScan) {
  console.log(`- ${folder}`);
}
const scanResults = [];

for (const folder of foldersToScan) {
  console.log(`\nScanning: ${folder}`);

  try {
    const result = await scanDirectory(folder);

    scanResults.push(result);

    console.log(`Files found: ${result.totalFiles}`);
  } catch (error) {
    console.log(`Could not scan this folder.`);
  }
}

console.log("\nScanning complete.");
console.log(`Folders scanned successfully: ${scanResults.length}`);
const combinedResult = {
  totalFiles: scanResults.reduce(
    (total, result) => total + result.totalFiles,
    0
  ),

  totalSize: scanResults.reduce(
    (total, result) => total + result.totalSize,
    0
  ),

  deepestFolder: scanResults.reduce(
    (deepest, result) =>
      Math.max(deepest, result.deepestFolder),
    0
  ),

  finalPatternCount: scanResults.reduce(
    (total, result) => total + result.finalPatternCount,
    0
  ),

  extensionCounts: {}
};
for (const result of scanResults) {
  for (const [extension, count] of Object.entries(
    result.extensionCounts
  )) {
    combinedResult.extensionCounts[extension] =
      (combinedResult.extensionCounts[extension] || 0) + count;
  }
}
const chart = createOracleChart(combinedResult);

console.log("\n=== ORACLE CHART ===\n");

console.log(`Files scanned: ${chart.totalFiles}`);
console.log(`Deepest folder level: ${chart.deepestFolder}`);
console.log(
  `Dominant file type: ${chart.dominantFileType} (${chart.dominantFileTypeCount} files)`
);
console.log("\n=== YOUR FORTUNE ===\n");

await askOracle(chart);