export async function getEmbedding(text: string, apiKey: string): Promise<number[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: {
            parts: [{ text }]
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini Embeddings API returned status ${response.status}: ${errText}`);
      throw new Error(`Embedding API failed: ${response.status}`);
    }

    const data = await response.json();
    return data.embedding?.values || [];
  } catch (error) {
    console.error('Error fetching embedding from Gemini:', error);
    throw error;
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
