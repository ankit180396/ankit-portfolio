"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { suggestedQuestions } from "@/lib/profile";
import { Send, Sparkles } from "./icons";

export function ChatPanel() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
  const isBusy = status === "submitted" || status === "streaming";
  const userMessageCount = messages.filter((message) => message.role === "user").length;
  const isAtClientLimit = userMessageCount >= 6;

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy || isAtClientLimit) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div className="chatShell">
      <div className="chatHeader">
        <div className="chatIdentity">
          <span className="chatMark">
            <Sparkles width={18} height={18} />
          </span>
          <div>
            <strong>Ask Ankit AI</strong>
            <span>Answers from a curated public profile</span>
          </div>
        </div>
        <span className="statusPill">
          <i /> {isBusy ? "Thinking" : "Ready"}
        </span>
      </div>

      <div className="chatMessages" aria-live="polite" aria-label="Conversation">
        {messages.length === 0 ? (
          <div className="assistantMessage introMessage">
            <span className="messageRole">Portfolio assistant</span>
            <p>
              Ask about Ankit&apos;s production AI work, backend engineering experience,
              technical stack, or measurable project impact.
            </p>
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            className={message.role === "user" ? "userMessage" : "assistantMessage"}
            key={message.id}
          >
            <span className="messageRole">{message.role === "user" ? "You" : "Portfolio assistant"}</span>
            {message.parts.map((part, index) =>
              part.type === "text" ? <p key={`${message.id}-${index}`}>{part.text}</p> : null,
            )}
          </div>
        ))}

        {status === "submitted" ? (
          <div className="assistantMessage typingMessage" aria-label="Assistant is thinking">
            <span />
            <span />
            <span />
          </div>
        ) : null}

        {error ? (
          <p className="chatError">The assistant is temporarily unavailable. The rest of the portfolio remains fully accessible.</p>
        ) : null}
      </div>

      {messages.length === 0 ? (
        <div className="suggestionGrid">
          {suggestedQuestions.map((question) => (
            <button key={question} type="button" onClick={() => submit(question)}>
              {question}
            </button>
          ))}
        </div>
      ) : null}

      <form
        className="chatForm"
        onSubmit={(event) => {
          event.preventDefault();
          submit(input);
        }}
      >
        <label className="srOnly" htmlFor="portfolio-question">
          Ask a question about Ankit&apos;s background
        </label>
        <textarea
          id="portfolio-question"
          value={input}
          onChange={(event) => setInput(event.currentTarget.value.slice(0, 1_200))}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit(input);
            }
          }}
          placeholder={isAtClientLimit ? "Conversation limit reached" : "Ask about experience, impact, or technical fit…"}
          rows={2}
          disabled={isAtClientLimit}
        />
        <button type="submit" disabled={!input.trim() || isBusy || isAtClientLimit} aria-label="Send question">
          <Send width={19} height={19} />
        </button>
      </form>
      <p className="chatDisclaimer">
        Verified public facts only. Please do not enter confidential or personal information.
      </p>
    </div>
  );
}
