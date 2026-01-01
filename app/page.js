'use client';

import Link from 'next/link';

export default function LandingPage() {

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-mesh">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <span style={{ fontSize: '1.2em' }}>🔴</span> ThreadSense
        </div>
        <div className="nav-links">
          <Link href="/app" className="nav-link" style={{ fontWeight: '700', color: 'var(--primary)' }}>Launch App</Link>
          <a onClick={() => scrollToSection('why-use')} className="nav-link">Why Use</a>
          <a onClick={() => scrollToSection('pricing')} className="nav-link">Pricing</a>
          <a onClick={() => scrollToSection('faqs')} className="nav-link">FAQs</a>
          <a onClick={() => scrollToSection('contact')} className="nav-link">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section hero-section">
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', color: '#111827' }}>
          Real Intelligence from <br />
          <span style={{ color: 'var(--primary)' }}>Real Discussions.</span>
        </h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '3rem', maxWidth: '650px', margin: '0 auto 3rem auto', color: 'var(--text-muted)' }}>
          ThreadSense uses advanced AI to sift through thousands of Reddit comments, filtering out the noise to give you the honest truth about any product or company in seconds.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/app">
            <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Launch App →
            </button>
          </Link>
          <button onClick={() => scrollToSection('why-use')} className="btn-primary" style={{ background: 'white', color: 'var(--text-main)', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            Learn More
          </button>
        </div>

        {/* Hero Image */}
        <div style={{ marginTop: '4rem', maxWidth: '50%', margin: '4rem auto 0 auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.05)', background: 'white' }}>
          <img
            src="/hero_illustration.png"
            alt="ThreadSense Dashboard Interface"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* Why Use Section */}
      <section id="why-use" className="section reveal-on-scroll" style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '30px', margin: '4rem auto' }}>
        <h2 className="section-title">Why ThreadSense?</h2>
        <div className="grid-cols-2">
          <div className="card-glass" style={{ background: '#fff1f2' }}>
            <h3 style={{ color: 'var(--primary)' }}>Unfiltered Truth</h3>
            <p>Amazon reviews are faked. SEO blogs are bought. Reddit is the last place to find raw, unfiltered user opinions.</p>
          </div>
          <div className="card-glass" style={{ background: '#fff1f2' }}>
            <h3 style={{ color: 'var(--primary)' }}>Sentiment Metrics</h3>
            <p>Don't guess. We score every thread on a 1-10 scale and give you a clear "Buy" or "Avoid" verdict based on community sentiment.</p>
          </div>
          <div className="card-glass" style={{ background: '#fff1f2' }}>
            <h3 style={{ color: 'var(--primary)' }}>Competitor Recon</h3>
            <p>Paste a competitor's name and see exactly where they are failing. Fill the gap in the market they left open.</p>
          </div>
          <div className="card-glass" style={{ background: '#fff1f2' }}>
            <h3 style={{ color: 'var(--primary)' }}>Save 90% Time</h3>
            <p>Don't read 500 comments. Read one executive summary that synthesizes the consensus of the community.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section reveal-on-scroll">
        <h2 className="section-title">Simple Pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>

          {/* Free Plan */}
          <div className="card-glass" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Hobby</h3>
            <div style={{ fontSize: '3rem', fontWeight: '800', margin: '1rem 0' }}>$0</div>
            <p style={{ marginBottom: '2rem' }}>For personal research.</p>
            <ul style={{ textAlign: 'left', listStyle: 'none', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ 5 Searches / Day</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Basic Sentiment Analysis</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Link Analysis Only</li>
            </ul>
            <Link href="/app">
              <button className="btn-primary" style={{ width: '100%', background: 'var(--text-main)' }}>Get Started</button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="card-glass" style={{ textAlign: 'center', border: '2px solid var(--primary)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontWeight: 'bold', fontSize: '0.8rem' }}>MOST POPULAR</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Pro</h3>
            <div style={{ fontSize: '3rem', fontWeight: '800', margin: '1rem 0' }}>$29</div>
            <p style={{ marginBottom: '2rem' }}>For founders & product teams.</p>
            <ul style={{ textAlign: 'left', listStyle: 'none', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ Unlimited Searches</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ <b>Competitor & Risk Intel</b></li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Topic Discovery Mode</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Export to PDF/Notion</li>
            </ul>
            <button className="btn-primary" style={{ width: '100%' }}>Start Free Trial</button>
          </div>

        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="section reveal-on-scroll" style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '30px', margin: '4rem auto' }}>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="card-glass" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Does this work on any subreddit?</h4>
            <p>Yes. ThreadSense can parse any public Reddit thread. However, it works best on discussion-heavy subreddits like r/technology, r/startups, or r/BuyItForLife.</p>
          </div>
          <div className="card-glass" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>How accurate is the sentiment analysis?</h4>
            <p>We use state-of-the-art LLMs (Gemini Pro) to understand context, sarcasm, and nuance. It is significantly more accurate than keyword-based sentiment tools.</p>
          </div>
          <div className="card-glass" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is my search data private?</h4>
            <p>Yes. We do not store your search history or the content of the threads you analyze. All processing is done on-the-fly.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <h2 className="section-title">Get in Touch</h2>
        <div className="card-glass" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ marginBottom: '2rem' }}>Have questions? Need a custom enterprise integration? We'd love to hear from you.</p>
          <a href="mailto:katkamnikhil1305@gmail.com" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>katkamnikhil1305@gmail.com</a>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}>Twitter</button>
            <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}>LinkedIn</button>
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid #eee', color: '#999', background: 'white' }}>
        &copy; 2026 ThreadSense Inc. All rights reserved.
      </footer>
    </>
  );
}
