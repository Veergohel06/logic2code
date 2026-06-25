/**
 * Pre-compute Embeddings Cache
 * 
 * Run this script during build/CI to generate all RAG chunk embeddings upfront.
 * This eliminates runtime embedding generation and cold-start delays.
 * 
 * Usage:
 *   npx tsx scripts/precompute-embeddings.ts
 * 
 * Requires GEMINI_API_KEY or GOOGLE_API_KEY in environment.
 */

import fs from 'fs';
import path from 'path';

const CHUNKS_DIR = path.join(process.cwd(), 'src', 'lib', 'rag', 'chunks');
const CACHE_PATH = path.join(CHUNKS_DIR, 'embeddings_cache.json');
const EMBEDDING_MODEL = 'text-embedding-004';
const BATCH_DELAY_MS = 200; // Rate limit: 200ms between API calls

interface KnowledgeChunk {
  id: string;
  tags: string[];
  title: string;
  content: string;
}

async function getEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] }
      })
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Embedding API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.embedding?.values || [];
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing GEMINI_API_KEY or GOOGLE_API_KEY environment variable.');
    process.exit(1);
  }

  // Load existing cache
  let cache: Record<string, number[]> = {};
  try {
    if (fs.existsSync(CACHE_PATH)) {
      cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
      console.log(`📦 Loaded existing cache with ${Object.keys(cache).length} entries.`);
    }
  } catch {
    console.warn('⚠️ Could not load existing cache. Starting fresh.');
  }

  // Find all chunk JSON files
  const chunkFiles = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.json') && f !== 'embeddings_cache.json');
  console.log(`📂 Found ${chunkFiles.length} chunk files to process.`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of chunkFiles) {
    const filePath = path.join(CHUNKS_DIR, file);
    let chunks: KnowledgeChunk[];
    try {
      chunks = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      console.warn(`⚠️ Could not parse ${file}, skipping.`);
      continue;
    }

    console.log(`\n📄 Processing ${file} (${chunks.length} chunks)...`);

    for (const chunk of chunks) {
      if (cache[chunk.id]) {
        skipped++;
        continue;
      }

      const text = `${chunk.title} ${chunk.tags.join(' ')} ${chunk.content}`;
      try {
        const vec = await getEmbedding(text, apiKey);
        if (vec.length > 0) {
          cache[chunk.id] = vec;
          generated++;
          process.stdout.write(`  ✅ ${chunk.id} (${chunk.title})\n`);
        }
      } catch (err) {
        errors++;
        console.error(`  ❌ Failed for ${chunk.id}: ${err}`);
      }

      // Rate limit
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  // Write cache
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Pre-computation complete!`);
  console.log(`   Generated: ${generated} new embeddings`);
  console.log(`   Skipped:   ${skipped} (already cached)`);
  console.log(`   Errors:    ${errors}`);
  console.log(`   Total:     ${Object.keys(cache).length} cached embeddings`);
  console.log(`   Output:    ${CACHE_PATH}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
