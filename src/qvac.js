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

You analyze filesystem statistics and create a short, entertaining
fortune based only on the statistics provided.

Do not claim to know the contents of files.
Do not invent personal information.
Do not give technical advice.

Filesystem statistics:

${JSON.stringify(chart, null, 2)}

Write a fortune in 2-4 sentences.
Give it a mysterious but humorous tone.
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