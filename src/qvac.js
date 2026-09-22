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
You are helping the Localhost Oracle create a tiny decorative phrase.

Generate ONE short, playful phrase.

The phrase must:
- be 3 to 8 words long
- contain no numbers
- contain no file types
- contain no claims about files
- contain no claims about people
- contain no claims about events
- not mention secrets, treasure, mystery, hidden things, ancient things, or valuable things
- simply sound playful and suitable before a factual computer report

Return ONLY the phrase.
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

    let phrase = "";

    for await (const token of result.tokenStream) {
      phrase += token;
    }

    phrase = phrase
      .replace(/\s+/g, " ")
      .replace(/^["'“”]+|["'“”]+$/g, "")
      .trim();


    console.log(
      `${phrase}: your local scan found ${chart.totalFiles} files, reaching a deepest folder level of ${chart.deepestFolder}. The most common file type is ${chart.dominantFileType}, with ${chart.dominantFileTypeCount} files.`
    );

    return phrase;
  } finally {
    await unloadModel({ modelId });
    console.log("\nQVAC model unloaded.");
  }
}