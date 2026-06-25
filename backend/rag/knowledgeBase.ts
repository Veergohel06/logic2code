import fs from 'fs';
import path from 'path';
import { getEmbedding, cosineSimilarity as vectorCosineSimilarity } from './embeddingService';

export interface KnowledgeChunk {
  id: string;
  tags: string[];
  title: string;
  content: string;
  difficulty?: string;
  topic?: string;
}

// ── TF-IDF Retrieval Engine (Fallback) ──────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

const STOPWORDS = new Set([
  'a','an','the','is','it','in','on','at','to','of','for','and','or','but',
  'with','this','that','are','was','be','as','by','from','we','you','your',
  'can','will','have','has','not','so','do','use','used','using','which',
  'how','when','where','what','why','its','they','them','their','our','also',
]);

function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) {
    if (!STOPWORDS.has(t)) tf.set(t, (tf.get(t) || 0) + 1);
  }
  return tf;
}

function cosineSimilarityTfidf(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, magA = 0, magB = 0;
  for (const [term, val] of a) {
    dot += val * (b.get(term) || 0);
    magA += val * val;
  }
  for (const val of b.values()) magB += val * val;
  return magA === 0 || magB === 0 ? 0 : dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// Cache loaded chunks to avoid repeated disk reads
const chunkCache = new Map<string, KnowledgeChunk[]>();

function loadChunks(language: string): KnowledgeChunk[] {
  const lang = language.toLowerCase();
  if (chunkCache.has(lang)) return chunkCache.get(lang)!;

  const fileMap: Record<string, string> = {
    cpp: 'cpp',
    'c++': 'cpp',
    c: 'c',
    javascript: 'javascript',
    js: 'javascript',
    typescript: 'typescript',
    ts: 'typescript',
    java: 'java',
    python: 'python',
    py: 'python',
    go: 'go',
    r: 'r',
  };

  const fileName = fileMap[lang] || lang;
  const filePath = path.join(process.cwd(), 'src', 'lib', 'rag', 'chunks', `${fileName}.json`);

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const chunks: KnowledgeChunk[] = JSON.parse(raw);
    chunkCache.set(lang, chunks);
    return chunks;
  } catch {
    return [];
  }
}

// Global cache for embeddings — read-only at runtime (pre-computed during build)
const cachePath = path.join(process.cwd(), 'src', 'lib', 'rag', 'chunks', 'embeddings_cache.json');

const MAX_CACHE_ENTRIES = 500;
let _cachedEmbeddings: Record<string, number[]> | null = null;

function loadEmbeddingsCache(): Record<string, number[]> {
  if (_cachedEmbeddings) return _cachedEmbeddings;
  try {
    if (fs.existsSync(cachePath)) {
      const raw = fs.readFileSync(cachePath, 'utf-8');
      const parsed = JSON.parse(raw);
      // LRU-style eviction: if cache exceeds limit, keep only the newest entries
      const keys = Object.keys(parsed);
      if (keys.length > MAX_CACHE_ENTRIES) {
        const trimmed: Record<string, number[]> = {};
        keys.slice(-MAX_CACHE_ENTRIES).forEach(k => { trimmed[k] = parsed[k]; });
        _cachedEmbeddings = trimmed;
        return trimmed;
      }
      _cachedEmbeddings = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('Error loading embeddings cache:', err);
  }
  _cachedEmbeddings = {};
  return {};
}

/**
 * Retrieve the top-K most relevant knowledge chunks for a given query and language.
 * Uses Gemini semantic embeddings if API key is available, falling back to local TF-IDF.
 */
export async function retrieveChunks(
  query: string,
  language: string,
  topK = 3,
  filters?: { difficulty?: string; topic?: string }
): Promise<KnowledgeChunk[]> {
  let chunks = loadChunks(language);
  if (chunks.length === 0) return [];

  // Metadata pre-filtering
  if (filters) {
    chunks = chunks.filter((chunk) => {
      if (filters.difficulty && chunk.difficulty && chunk.difficulty.toLowerCase() !== filters.difficulty.toLowerCase()) {
        return false;
      }
      if (filters.topic && chunk.topic && chunk.topic.toLowerCase() !== filters.topic.toLowerCase()) {
        return false;
      }
      return true;
    });
  }

  if (chunks.length === 0) return [];

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      console.log(`[RAG] Initiating semantic vector retrieval for query: "${query}" in lang: "${language}"`);
      const cache = loadEmbeddingsCache();

      // Check if all chunks have pre-computed embeddings
      const allCached = chunks.every(chunk => !!cache[chunk.id]);
      if (!allCached) {
        console.warn('[RAG] Some chunk embeddings missing from cache. Run `scripts/precompute-embeddings.ts` to rebuild. Falling back to TF-IDF.');
        // Fall through to TF-IDF below
      } else {

      // Fetch query embedding
      const queryVec = await getEmbedding(query, apiKey);
      if (queryVec && queryVec.length > 0) {
        const scored = chunks.map((chunk) => {
          const chunkVec = cache[chunk.id];
          const score = chunkVec ? vectorCosineSimilarity(queryVec, chunkVec) : 0;
          return { chunk, score };
        });

        // Filter and sort by score descending
        const results = scored
          .filter(({ score }) => score > 0.3) // threshold for embedding similarity
          .sort((a, b) => b.score - a.score)
          .slice(0, topK)
          .map(({ chunk }) => chunk);

        console.log(`[RAG] Semantic search complete. Retrieved ${results.length} chunks.`);
        return results;
      }
      }
    } catch (err) {
      console.warn('[RAG] Semantic embedding retrieval failed, falling back to TF-IDF:', err);
    }
  }

  // Fallback to traditional TF-IDF keyword search
  const queryTokens = tokenize(query);
  const queryTF = termFrequency(queryTokens);

  const scored = chunks.map((chunk) => {
    const chunkText = `${chunk.title} ${chunk.tags.join(' ')} ${chunk.content}`;
    const chunkTF = termFrequency(tokenize(chunkText));
    const score = cosineSimilarityTfidf(queryTF, chunkTF);
    return { chunk, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ chunk }) => chunk);
}

/**
 * Format retrieved chunks into a prompt-injectable context block.
 */
export function formatRAGContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return '';
  return [
    '## Retrieved Knowledge Base Context',
    'Use the following curated knowledge to ground and improve your answer:',
    '',
    ...chunks.map((c, i) =>
      `### [${i + 1}] ${c.title}\n${c.content}`
    ),
    '',
    '---',
    '',
  ].join('\n');
}
