import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGroundedAnswer,
  retrieveKnowledge,
  tokenize,
} from "../lib/retrieval";

test("tokenize normalizes recruiter questions", () => {
  assert.deepEqual(tokenize("What are Ankit's Python + FastAPI skills?"), [
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

test("retrieval refuses unsupported topics instead of guessing", () => {
  assert.deepEqual(retrieveKnowledge("What is Ankit's favorite restaurant?"), []);
});

test("grounded fallback includes only retrieved evidence and its source", () => {
  const matches = retrieveKnowledge("What did Ankit build at Blue Purpose?", 2);
  const answer = buildGroundedAnswer(matches);

  assert.match(answer, /Verified knowledge-base answer/);
  assert.match(answer, /Experience: Blue Purpose/);
  assert.match(answer, /1,500 users/);
});
