// Testing file

import { createEmbedding } from "./services/embeddingService.js";

try {
  const embedding = await createEmbedding(
    "I know Java, React, Node.js and MongoDB."
  );

  console.log("Embedding Length:", embedding.length);
  console.log("First 10 Values:");
  console.log(embedding.slice(0, 10));

} catch (error) {
  console.error(error);
}