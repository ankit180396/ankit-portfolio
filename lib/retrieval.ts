import { knowledgeBase, type KnowledgeChunk } from "./profile";

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "for",
  "from",
  "has",
  "he",
  "his",
  "how",
  "in",
  "is",
  "of",
  "on",
  "the",
  "to",
  "what",
  "which",
  "with",
]);

export function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

export function retrieveKnowledge(query: string, limit = 4): KnowledgeChunk[] {
  const queryTokens = new Set(tokenize(query));

  const ranked = knowledgeBase
    .map((chunk, index) => {
      const keywordTokens = chunk.keywords.flatMap(tokenize);
      const textTokens = tokenize(chunk.text);
      const keywordScore = keywordTokens.reduce(
        (score, token) => score + (queryTokens.has(token) ? 4 : 0),
        0,
      );
      const textScore = textTokens.reduce(
        (score, token) => score + (queryTokens.has(token) ? 1 : 0),
        0,
      );

      return { chunk, score: keywordScore + textScore, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const matches = ranked.filter((item) => item.score > 0).slice(0, limit);

  if (matches.length > 0) {
    return matches.map((item) => item.chunk);
  }

  return knowledgeBase.slice(0, Math.min(limit, 2));
}

export function formatKnowledge(chunks: KnowledgeChunk[]): string {
  return chunks
    .map((chunk) => `[${chunk.source}]\n${chunk.text}`)
    .join("\n\n");
}
