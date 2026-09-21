import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

export async function askOracle(chart) {
  console.log("Loading local QVAC model...");

  const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    onProgress: (p) => {
      console.log(`Loading model: ${p.percentage.toFixed(0)}%`);
    }
  });

  const prompt = `
You are the Localhost Oracle.

Write a playful fortune using these exact facts:

TOTAL FILES: ${chart.totalFiles}
DEEPEST FOLDER LEVEL: ${chart.deepestFolder}
DOMINANT FILE TYPE: ${chart.dominantFileType}
DOMINANT FILE TYPE COUNT: ${chart.dominantFileTypeCount}

Write exactly 2 sentences.

You may make the writing playful, but the numbers and facts must remain literal.

Do NOT:
- invent information
- claim to know file contents
- describe anything as secret or hidden
- describe anything as ancient or mysterious
- describe files as recent
- say that files contain knowledge, treasures, wisdom, or secrets
- say that a statistic represents something other than the exact statistic
- mention people
- mention real-world events
- add facts not listed above

Use the facts directly.
Output only the 2-sentence fortune.
`;
  try {
    const result = completion({
      modelId,
      history: [
        {
          role: "user",
          content: prompt
        }
      ],
      stream: true
    });

    let fortune = "";

    for await (const token of result.tokenStream) {
      process.stdout.write(token);
      fortune += token;
    }

    return fortune;
  } finally {
    await unloadModel({ modelId });
    console.log("\n\nQVAC model unloaded.");
  }
}