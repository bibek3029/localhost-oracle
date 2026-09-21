import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

try {
  console.log("Loading QVAC model...");

  const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    onProgress: (p) => {
      console.log(`Downloading: ${p.percentage.toFixed(0)}%`);
    }
  });

  console.log("\nModel loaded!");
  console.log("Asking QVAC a question...\n");

  const result = completion({
    modelId,
    history: [
      {
        role: "user",
        content: "Say hello in one short sentence."
      }
    ],
    stream: true
  });

  for await (const token of result.tokenStream) {
    process.stdout.write(token);
  }

  console.log("\n\nFinished!");

  await unloadModel({ modelId });

  console.log("Model unloaded successfully.");
} catch (error) {
  console.error("QVAC error:", error);
  process.exit(1);
}