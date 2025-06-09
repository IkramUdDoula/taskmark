import React, { useState, useRef } from 'react';
import { useNotes } from './NotesContext';

const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function fetchSummary(transcript) {
  const systemPrompt =
    'You are a helpful assistant. Summarize the following meeting transcript into concise bullet points as meeting minutes. Only output the summary.';
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: transcript },
    ],
    temperature: 0.5,
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
  if (!res.ok) throw new Error('Failed to summarize');
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export default function MeetingRecorder() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const { addOrUpdateNote } = useNotes();

  // Start recording audio and speech recognition
  const startRecording = async () => {
    setError('');
    setTranscript('');
    setSummary('');
    setAudioUrl(null);
    try {
      // MediaRecorder for audio
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(audioBlob));
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      // Web Speech API for real-time transcription
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError('Web Speech API not supported in this browser.');
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      let finalTranscript = '';
      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript + interim);
      };
      recognition.onerror = (e) => setError('Speech recognition error: ' + e.error);
      recognitionRef.current = recognition;
      recognition.start();

      setRecording(true);
    } catch (e) {
      setError('Could not start recording: ' + e.message);
    }
  };

  // Stop recording audio and speech recognition
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setRecording(false);
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    setError('');
    try {
      const sum = await fetchSummary(transcript);
      setSummary(sum);
    } catch (e) {
      setError('Could not summarize: ' + e.message);
    }
    setSummarizing(false);
  };

  const handleSave = () => {
    const note = {
      id: Date.now().toString(),
      title: 'Meeting Minutes',
      content: summary,
      checklist: [],
      transcript,
      created: new Date().toISOString(),
    };
    addOrUpdateNote(note);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded text-white ${recording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {audioUrl && (
          <audio controls src={audioUrl} className="mt-2 w-full" />
        )}
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Transcript</label>
        <textarea
          className="w-full min-h-[80px] p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
          value={transcript}
          readOnly
        />
      </div>
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleSummarize}
          disabled={!transcript || summarizing}
        >
          {summarizing ? 'Summarizing...' : 'Summarize & Generate Minutes'}
        </button>
      </div>
      {summary && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Summary (Minutes)</label>
          <textarea
            className="w-full min-h-[80px] p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
            value={summary}
            readOnly
          />
          <button
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleSave}
          >Save summary & transcript as note</button>
        </div>
      )}
    </div>
  );
}
