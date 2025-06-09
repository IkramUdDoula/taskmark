import React, { useState } from 'react';
import { useNotes } from './NotesContext';

const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function fetchChecklist(prompt) {
  // System prompt to instruct the model to return a checklist as JSON
  const systemPrompt =
    'You are an expert assistant. When asked "How to learn X", always respond with a JSON array of checklist items like [{"text": "Step 1"}, {"text": "Step 2"}]. Do not include explanations.';
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: 0.6,
    max_tokens: 512,
  };
  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to fetch checklist');
  const data = await res.json();
  // Try to extract JSON from the response
  let checklist = [];
  try {
    const text = data.choices?.[0]?.message?.content || '';
    checklist = JSON.parse(text);
  } catch (e) {
    // fallback: try to extract JSON from text
    const text = data.choices?.[0]?.message?.content || '';
    const match = text.match(/\[.*\]/s);
    if (match) {
      try {
        checklist = JSON.parse(match[0]);
      } catch {}
    }
  }
  return checklist;
}

export default function AIChecklist({ onAdd }) {
  const [input, setInput] = useState('How to learn React?');
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState(null);
  const [error, setError] = useState('');
  const { addOrUpdateNote } = useNotes();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setChecklist(null);
    setError('');
    try {
      const cl = await fetchChecklist(input);
      if (!Array.isArray(cl) || cl.length === 0) throw new Error('No checklist found');
      setChecklist(cl);
    } catch (err) {
      setError('Could not generate checklist. Try again.');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    if (!checklist) return;
    const note = {
      id: Date.now().toString(),
      title: input,
      content: '',
      checklist,
      created: new Date().toISOString(),
    };
    addOrUpdateNote(note);
    if (onAdd) onAdd(note);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="How to learn X?"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Ask AI'}
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {checklist && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 mb-4">
          <h3 className="font-semibold mb-2">Checklist</h3>
          <ul className="list-disc pl-6">
            {checklist.map((item, idx) => (
              <li key={idx}>{item.text}</li>
            ))}
          </ul>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAdd}
          >Add this checklist to my notes</button>
        </div>
      )}
    </div>
  );
}
