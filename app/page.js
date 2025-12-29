'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query || !apiKey) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setStatus('Searching Reddit for honest discussions...');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <main className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="gradient-text">Reddit Review Analyzer</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Get the honest truth about any product or topic from real Reddit conversations, summarized by AI.
        </p>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto 4rem auto' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>1. Enter your Gemini API Key (Free)</label>
            <input
              type="password"
              placeholder="Paste your Google Gemini API Key here"
              className="input-field"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Don't have one? Get it for free at <a href="https://aistudio.google.com/app/apikey" target="_blank" style={{ color: 'var(--accent-secondary)' }}>Google AI Studio</a>.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>2. What do you want to research?</label>
            <input
              type="text"
              placeholder="e.g., Sony WH-1000XM5 issues, Herman Miller Aeron worth it?"
              className="input-field"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Analyzing...' : 'Analyze Reviews'}
          </button>
        </form>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem' }}>{status}</p>
          </div>
        )}

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid rgba(255, 0, 0, 0.3)', borderRadius: '8px', marginTop: '1rem', color: '#ff6b6b' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {result && (
        <div style={{ display: 'grid', gap: '2rem' }}>

          {/* Summary Section */}
          <div className="glass-card">
            <h2 className="gradient-text">The Verdict</h2>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>SENTIMENT ANALYSIS</strong>
              <p style={{ fontSize: '1.2rem', color: 'white' }}>{result.analysis.sentiment}</p>
            </div>

            <h3>Executive Summary</h3>
            <div style={{ lineHeight: '1.8', color: '#d4d4d4' }}>
              <ReactMarkdown>{result.analysis.summary}</ReactMarkdown>
            </div>
          </div>

          {/* Pros & Cons Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ color: '#00ff9d', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>👍 The Good</h3>
              <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
                {result.analysis.pros.map((pro, index) => (
                  <li key={index} className="pro-item">
                    <span className="pro-icon">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card">
              <h3 style={{ color: '#ff4d4d', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>👎 The Bad</h3>
              <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
                {result.analysis.cons.map((con, index) => (
                  <li key={index} className="con-item">
                    <span className="con-icon">✕</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quotes */}
          <div className="glass-card">
            <h3>Real User Voices</h3>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {result.analysis.quotes ? result.analysis.quotes.map((quote, i) => (
                <blockquote key={i} style={{ borderLeft: '4px solid var(--accent-primary)', paddingLeft: '1rem', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '1rem' }}>
                  "{quote}"
                </blockquote>
              )) : <p>No specific quotes extracted.</p>}
            </div>
          </div>

          {/* Sources */}
          <div style={{ opacity: 0.7, fontSize: '0.9rem', textAlign: 'center' }}>
            <p>Analyzed threads:</p>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {result.sources.map((source, i) => (
                <li key={i}>
                  <a href={source.url} target="_blank" style={{ color: 'var(--accent-secondary)', textDecoration: 'underline' }}>
                    {source.title.substring(0, 50)}...
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </main>
  );
}
