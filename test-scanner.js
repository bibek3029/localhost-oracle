import { scanDirectory } from "./src/scanner.js";
import { createOracleChart } from "./src/oracle.js";
import { askOracle } from "./src/qvac.js";

const targetPath = process.argv[2] || ".";

console.log(`\nScanning: ${targetPath}\n`);

const result = await scanDirectory(targetPath);
const chart = createOracleChart(result);

console.log("=== LOCALHOST ORACLE ===\n");

console.log(JSON.stringify(chart, null, 2));

console.log("\n=== YOUR FORTUNE ===\n");

await askOracle(chart);