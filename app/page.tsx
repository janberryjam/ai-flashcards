"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);

  async function generate() {
    if (!topic) return;

    setLoading(true);
    setFlipped(false);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    const parsed = parseFlashcard(data.result);

    setCard(parsed);
    setLoading(false);
  }

  function parseFlashcard(text: string) {
    const question = text.match(/QUESTION:\s*([\s\S]*?)ANSWER:/)?.[1]?.trim();
    const answer = text.match(/ANSWER:\s*([\s\S]*?)KEY POINTS:/)?.[1]?.trim();
    const points = text.match(/KEY POINTS:\s*([\s\S]*)/)?.[1]?.trim();

    return { question, answer, points };
  }

  return (
    <div className="page">
      <h1 className="title">AI Flashcards</h1>

      <div className="controls">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic..."
        />
        <button onClick={generate}>
          {loading ? "Generating..." : "Create"}
        </button>
      </div>

      {card && (
        <div
          className={`flashcard ${flipped ? "flipped" : ""}`}
          onClick={() => setFlipped(!flipped)}
        >
          <div className="card-inner">
            {/* FRONT */}
            <div className="card-front">
              <p>{card.question}</p>
              <span>Click to flip</span>
            </div>

            {/* BACK */}
            <div className="card-back">
              <p>{card.answer}</p>

              <div className="points">
                <strong>Key Points:</strong>
                <pre>{card.points}</pre>
              </div>

              <span>Click to flip back</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}