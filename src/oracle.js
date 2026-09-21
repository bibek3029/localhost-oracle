export function createOracleChart(scanResult) {
  const fileTypes = scanResult.extensionCounts;

  const dominantType = Object.entries(fileTypes).reduce(
    (largest, current) => {
      if (!largest || current[1] > largest[1]) {
        return current;
      }

      return largest;
    },
    null
  );

  return {
    totalFiles: scanResult.totalFiles,
    totalSizeBytes: scanResult.totalSize,
    deepestFolder: scanResult.deepestFolder,
    finalPatternCount: scanResult.finalPatternCount,

    dominantFileType: dominantType
      ? dominantType[0]
      : null,

    dominantFileTypeCount: dominantType
      ? dominantType[1]
      : 0,

    fileTypes
  };
}