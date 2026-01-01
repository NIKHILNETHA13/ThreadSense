'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function App() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('url'); // 'url' or 'topic'

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!input) return;

        setLoading(true);
        setError(null);
        setResult(null);
        setStatus('Gathering intelligence...');

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode, input }),
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
        <>
            <div className="bg-mesh">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* App Navigation */}
            <nav className="navbar">
                <div className="logo" style={{ gap: '0' }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <img
                            src="/redeco-logo.png"
                            alt="Redeco Logo"
                            style={{
                                height: '45px',
                                width: 'auto',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </Link>
                </div>
                <div className="nav-links">
                    <Link href="/" className="nav-link">← Back to Home</Link>
                </div>
            </nav>

            <section className="section hero-section" style={{ paddingTop: '6rem' }}>

                {/* Input Card */}
                <div className="card-glass" style={{ maxWidth: '800px', margin: '0 auto' }}>

                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>What are we analyzing today?</h2>

                    <div className="toggle-group" style={{ justifyContent: 'center', display: 'flex' }}>
                        <button
                            onClick={() => setMode('url')}
                            className={`toggle-btn ${mode === 'url' ? 'active' : ''}`}
                        >
                            Link Analysis
                        </button>
                        <button
                            onClick={() => setMode('topic')}
                            className={`toggle-btn ${mode === 'topic' ? 'active' : ''}`}
                        >
                            Topic Discovery
                        </button>
                    </div>

                    <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <input
                            type={mode === 'url' ? 'url' : 'text'}
                            className="input-clean"
                            placeholder={mode === 'url' ? 'Paste Reddit Thread URL...' : 'e.g. "Linear vs Jira for startups"'}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{
                                justifyContent: 'center',
                                width: '100%',
                                padding: '16px 32px',
                                fontSize: '1.05rem',
                                fontWeight: '600'
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                                        <span className="loader-dot" style={{ width: '8px', height: '8px', margin: '0' }}></span>
                                        <span className="loader-dot" style={{ width: '8px', height: '8px', margin: '0' }}></span>
                                        <span className="loader-dot" style={{ width: '8px', height: '8px', margin: '0' }}></span>
                                        Analyzing...
                                    </span>
                                </>
                            ) : (
                                '✨ Reveal Insights'
                            )}
                        </button>
                    </form>

                    {loading && (
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <div className="loader-dot"></div>
                            <div className="loader-dot"></div>
                            <div className="loader-dot"></div>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            background: '#fef2f2',
                            color: '#ef4444',
                            borderRadius: '12px',
                            textAlign: 'left'
                        }}>
                            ⚠ {error}
                        </div>
                    )}
                </div>

                {/* Results Dashboard */}
                {result && (
                    <div style={{ marginTop: '4rem', textAlign: 'left' }}>

                        {/* Executive Verdict Banner */}
                        <div className="card-glass" style={{
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2rem',
                            animation: 'slideUp 0.5s ease-out'
                        }}>
                            {/* Sentiment Gauge */}
                            <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                                <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#eee"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke={result.analysis.sentimentScore >= 7 ? '#10b981' : result.analysis.sentimentScore >= 4 ? '#fbbf24' : '#ef4444'}
                                        strokeWidth="3"
                                        strokeDasharray={`${(result.analysis.sentimentScore || 0) * 10}, 100`}
                                        style={{ transition: 'stroke-dasharray 1s ease-out' }}
                                    />
                                </svg>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '2.5rem'
                                }}>
                                    {result.analysis.emoji || '😐'}
                                </div>
                            </div>

                            <div>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '100px',
                                    background: '#f1f5f9',
                                    fontWeight: '700',
                                    fontSize: '0.85rem',
                                    marginBottom: '0.5rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    VERDICT: {result.analysis.verdict || 'PENDING'}
                                </div>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', lineHeight: '1.2' }}>
                                    {result.analysis.sentiment}
                                </h2>
                                <div style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>
                                    <ReactMarkdown>{result.analysis.summary}</ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* 2-Column Grid */}
                        <div className="grid-cols-2">
                            <div className="card-glass" style={{ animation: 'slideUp 0.5s ease-out 0.1s backwards' }}>
                                <h3 style={{ marginBottom: '1.5rem', color: '#10b981' }}>The Highlights</h3>
                                {result.analysis.pros.map((pro, i) => (
                                    <div key={i} className="list-item">
                                        <span className="icon icon-ok">✓</span> {pro}
                                    </div>
                                ))}
                            </div>

                            <div className="card-glass" style={{ animation: 'slideUp 0.5s ease-out 0.2s backwards' }}>
                                <h3 style={{ marginBottom: '1.5rem', color: '#f43f5e' }}>The Issues</h3>
                                {result.analysis.cons.map((con, i) => (
                                    <div key={i} className="list-item">
                                        <span className="icon icon-bad">✕</span> {con}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Risks and Competitors */}
                        <div className="grid-cols-2" style={{ marginTop: '2rem' }}>
                            <div className="card-glass" style={{ borderLeft: '4px solid #f43f5e', animation: 'slideUp 0.5s ease-out 0.3s backwards' }}>
                                <h3 style={{ marginBottom: '1rem' }}>⚠ Risk Radar</h3>
                                {result.analysis.risks && result.analysis.risks.length > 0 ? (
                                    result.analysis.risks.map((r, i) => <p key={i} style={{ marginBottom: '8px' }}>• {r}</p>)
                                ) : <p>No major risks detected.</p>}
                            </div>

                            <div className="card-glass" style={{ borderLeft: '4px solid #3b82f6', animation: 'slideUp 0.5s ease-out 0.4s backwards' }}>
                                <h3 style={{ marginBottom: '1rem' }}>⚡ Competitors</h3>
                                {result.analysis.competitors && result.analysis.competitors.length > 0 ? (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {result.analysis.competitors.map((c, i) => (
                                            <span key={i} style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 12px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '600' }}>{c}</span>
                                        ))}
                                    </div>
                                ) : <p>No specific competitors named.</p>}
                            </div>
                        </div>

                        {/* Referenced Threads */}
                        {result.sources && result.sources.length > 0 && (
                            <div className="card-glass" style={{
                                marginTop: '2rem',
                                animation: 'slideUp 0.5s ease-out 0.5s backwards'
                            }}>
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    🎯 Referenced Threads
                                    <span style={{ fontSize: '0.9rem', fontWeight: '400', color: 'var(--text-muted)' }}>({result.sources.length})</span>
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {result.sources.map((source, i) => (
                                        <a
                                            key={i}
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="card-feature"
                                            style={{
                                                textDecoration: 'none',
                                                padding: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                transition: 'all 0.2s ease',
                                                border: '1px solid rgba(0,0,0,0.05)',
                                                background: 'rgba(255,255,255,0.5)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateX(8px)';
                                                e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.2)';
                                                e.currentTarget.style.background = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateX(0)';
                                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',
                                                    background: 'rgba(255, 69, 0, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#FF4500'
                                                }}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.687 0 1.25.562 1.25 1.25 0 .687-.563 1.25-1.25 1.25-.477 0-.899-.192-1.208-.49a7.16 7.16 0 0 1-4.823 1.28c-.144 1.137-.411 2.41-.61 3.52-.392.203-.865.318-1.366.318-.687 0-1.25-.563-1.25-1.25 0-.256.079-.49.213-.685l.407-2.31c-1.845.03-3.08-.26-4.04-1.09-.308.309-.73.501-1.207.501-.687 0-1.25-.562-1.25-1.25 0-.688.563-1.25 1.25-1.25.477 0 .899.193 1.207.492.355-.304.815-.558 1.36-.742l.533-2.52.01-.054c.006-.027.013-.053.021-.08l.79-3.703c.03-.13.14-.23.27-.23.013 0 .027.001.04.003L15.38 4.77c.18-.02.344.02.483.11.14-.09.303-.136.483-.136zm-4.704 8.243c.414 0 .75.336.75.75s-.336.75-.75.75-.75-.336-.75-.75.336-.75.75-.75zm4.39 0c.414 0 .75.336.75.75s-.336.75-.75.75-.75-.336-.75-.75.336-.75.75-.75z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>{source.title}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{source.url}</div>
                                                </div>
                                            </div>
                                            <div className="icon" style={{ opacity: 0.3 }}>↗</div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </section>
        </>
    );
}
