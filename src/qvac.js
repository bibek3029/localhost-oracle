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
You are the Localhost Oracle, a playful digital fortune teller.

The facts below have already been calculated by a JavaScript program.
Treat them as verified facts.

Your ONLY job is to turn these facts into an entertaining fortune.

FACTS:
- Total files: ${chart.totalFiles}
- Total size: ${chart.totalSizeBytes} bytes
- Deepest folder level: ${chart.deepestFolder}
- Dominant file type: ${chart.dominantFileType}
- Dominant file type count: ${chart.dominantFileTypeCount}
- Detected final-version patterns: ${chart.finalPatternCount}

RULES:
- Use at least TWO of the facts above.
- Keep every number accurate.
- You may use creative metaphors based on the facts.
- Do not invent facts.
- Do not claim to know what any file contains.
- Do not call files secrets.
- Do not mention people, intentions, hidden information, or real-world events.
- A final-version pattern count of 0 ONLY means that this scanner detected zero matching filenames. Do not interpret it as anything more.
- Do not explain these rules.
- Write exactly 2-4 sentences.
- Write only the fortune.

Begin.
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