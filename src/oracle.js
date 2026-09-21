export function createOracleChart(scanResult) {
  return {
    totalFiles: scanResult.totalFiles,
    totalSizeBytes: scanResult.totalSize,
    deepestFolder: scanResult.deepestFolder,
    finalPatternCount: scanResult.finalPatternCount,
    fileTypes: scanResult.extensionCounts
  };
}