import assert from "node:assert/strict";
import test from "node:test";
import { retrieveKnowledge, tokenize } from "../lib/retrieval";

test("tokenize normalizes recruiter questions", () => {
  assert.deepEqual(tokenize("What are Ankit's Python + FastAPI skills?"), [
    "ankit",
    "python",
    "fastapi",
    "skills",
  ]);
});

test("retrieval finds the healthcare case study", () => {
  const [top] = retrieveKnowledge("Tell me about the clinical healthcare platform");
  assert.equal(top.id, "blue-purpose");
});

test("retrieval finds the EY impact story", () => {
  const [top] = retrieveKnowledge("What impact did he have at Ernst and Young?");
  assert.equal(top.id, "ey");
});
