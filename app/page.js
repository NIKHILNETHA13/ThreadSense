'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function LandingPage() {

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Premium Scroll Reveal Animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1, // Wait until 10% visible to trigger (better "load on scroll" feel)
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, observerOptions);

    // Observe all scroll-reveal elements
    const revealElements = document.querySelectorAll('[class*="scroll-reveal"]');
    revealElements.forEach(el => observer.observe(el));

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="bg-mesh">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo" style={{ gap: '0' }}>
          <img
            src="/redeco-logo.png"
            alt="Redeco Logo"
            style={{
              height: '45px',
              width: 'auto',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        </div>
        <div className="nav-links">
          <Link href="/app" className="nav-link" style={{ fontWeight: '700' }}>Launch App</Link>
          <a onClick={() => scrollToSection('why-use')} className="nav-link">Why Use</a>
          <a onClick={() => scrollToSection('pricing')} className="nav-link">Pricing</a>
          <a onClick={() => scrollToSection('faqs')} className="nav-link">FAQs</a>
          <a onClick={() => scrollToSection('contact')} className="nav-link">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section hero-section">
        <div className="badge-premium scroll-reveal-scale" style={{ marginBottom: '2rem' }}>
          ✨ AI-Powered Review Intelligence
        </div>

        <h1 className="scroll-reveal-up scroll-reveal-delay-1" style={{
          fontSize: '4.5rem',
          marginBottom: '1.5rem',
          color: '#0f172a',
          lineHeight: '1.1'
        }}>
          Decode Real Reviews from <br />
          <span className="gradient-text">Real Discussions.</span>
        </h1>

        <p className="scroll-reveal-up scroll-reveal-delay-2" style={{
          fontSize: '1.3rem',
          marginBottom: '1rem',
          maxWidth: '750px',
          margin: '0 auto 1rem auto',
          color: 'var(--text-muted)',
          fontWeight: '400'
        }}>
          <strong style={{ color: 'var(--text-main)' }}>Redeco</strong> (Review Decoder) uses advanced AI to analyze thousands of Reddit comments, filtering noise to reveal honest product insights in seconds.
        </p>

        <p className="scroll-reveal-up scroll-reveal-delay-3" style={{
          fontSize: '1.05rem',
          marginBottom: '3rem',
          color: 'var(--text-light)',
          fontStyle: 'italic'
        }}>
          Because authentic opinions matter more than paid reviews.
        </p>

        <div className="scroll-reveal-up scroll-reveal-delay-4" style={{
          display: 'flex',
          gap: '1.2rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/app">
            <button className="btn-primary" style={{ padding: '17px 36px', fontSize: '1.1rem' }}>
              Launch App →
            </button>
          </Link>
          <button
            onClick={() => scrollToSection('why-use')}
            className="btn-secondary"
            style={{ padding: '17px 36px', fontSize: '1.1rem' }}
          >
            Learn More
          </button>
        </div>

        {/* Hero Image */}
        <div className="scroll-reveal-scale scroll-reveal-delay-5" style={{
          marginTop: '5rem',
          maxWidth: '55%',
          margin: '5rem auto 0 auto',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 30px 70px -15px rgba(139, 92, 246, 0.3), 0 15px 40px -12px rgba(0,0,0,0.15)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          background: 'white',
          transition: 'transform 0.5s ease, box-shadow 0.5s ease'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 40px 90px -15px rgba(139, 92, 246, 0.4), 0 20px 50px -12px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 30px 70px -15px rgba(139, 92, 246, 0.3), 0 15px 40px -12px rgba(0,0,0,0.15)';
          }}
        >
          <img
            src="/hero_illustration.png"
            alt="Redeco Dashboard Interface"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* Why Use Section */}
      <section id="why-use" className="section" style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '36px', margin: '4rem auto', padding: '5rem 2rem' }}>
        <h2 className="section-title scroll-reveal-rotate" style={{ marginBottom: '3rem' }}>
          Why <span className="gradient-text">Redeco</span>?
        </h2>

        <div className="grid-cols-2" style={{ gap: '2rem' }}>

          {/* Card 1: Authentic Insights */}
          <div className="card-glass card-gradient-1 scroll-reveal-rotate scroll-reveal-delay-1">
            <div style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>🎯</div>
            <h3 style={{
              background: 'linear-gradient(135deg, #e11d48, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Unfiltered Truth
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Skip the fake 5-star reviews on Amazon. Access raw, honest user experiences from real discussions.
            </p>
          </div>

          {/* Card 2: AI Scoring */}
          <div className="card-glass card-gradient-2 scroll-reveal-rotate scroll-reveal-delay-2">
            <div style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>📊</div>
            <h3 style={{
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Smart Sentiment
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Instantly gauge the community "vibe". Our AI scores threads on a 1-10 scale so you can decide in seconds.
            </p>
          </div>

          {/* Card 3: Comparison */}
          <div className="card-glass card-gradient-3 scroll-reveal-rotate scroll-reveal-delay-3">
            <div style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>🆚</div>
            <h3 style={{
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Better Comparisons
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Stuck between two options? See what real users who switched from Product A to Product B have to say.
            </p>
          </div>

          {/* Card 4: Time Saving */}
          <div className="card-glass card-gradient-4 scroll-reveal-rotate scroll-reveal-delay-4">
            <div style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>⚡</div>
            <h3 style={{
              background: 'linear-gradient(135deg, #f97316, #e11d48)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Save Hours
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Stop reading hundreds of comments. Get a concise executive summary of the consensus in under 10 seconds.
            </p>
          </div>

          {/* Card 5: Trend Discovery */}
          <div className="card-glass card-gradient-1 scroll-reveal-rotate scroll-reveal-delay-5">
            <div style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>📈</div>
            <h3 style={{
              background: 'linear-gradient(135deg, #e11d48, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Spot Trends
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Discover rising products and topics before they hit the mainstream. Stay ahead of the curve.
            </p>
          </div>

          {/* Card 6: Problem Detection */}
          <div className="card-glass card-gradient-2 scroll-reveal-rotate scroll-reveal-delay-6">
            <div style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>🐛</div>
            <h3 style={{
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Identify Issues
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Quickly find common complaints, bugs, or deal-breakers mentioned repeatedly by the community.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section">
        <h2 className="section-title scroll-reveal-up">
          Simple <span className="gradient-text-alt">Pricing</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '950px', margin: '0 auto' }}>

          {/* Free Plan */}
          <div className="card-glass scroll-reveal-left scroll-reveal-delay-1" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: '700' }}>Hobby</h3>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              margin: '1.5rem 0',
              background: 'linear-gradient(135deg, #0f172a, #475569)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              $0
            </div>
            <p style={{ marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>For product research.</p>
            <ul style={{ textAlign: 'left', listStyle: 'none', marginBottom: '2.5rem' }}>
              <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span> 5 Searches / Day
              </li>
              <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span> Basic Sentiment Analysis
              </li>
              <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span> Topic/Product Reviewing
              </li>
            </ul>
            <Link href="/app">
              <button className="btn-primary" style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0f172a, #475569)',
                boxShadow: '0 6px 16px rgba(15, 23, 42, 0.25)'
              }}>
                Get Started
              </button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="card-glass scroll-reveal-zoom scroll-reveal-delay-2" style={{
            textAlign: 'center',
            border: '2px solid rgba(139, 92, 246, 0.4)',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(245, 243, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
            paddingTop: '3.5rem' // Increased padding into prevent badge overlap
          }}>
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '100px',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              boxShadow: '0 6px 16px rgba(139, 92, 246, 0.4)',
              letterSpacing: '0.5px'
            }}>
              ⭐ MOST POPULAR
            </div>
            <h3 style={{
              fontSize: '1.6rem',
              marginBottom: '0.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Pro
            </h3>
            <div style={{ fontSize: '3.5rem', fontWeight: '800', margin: '1.5rem 0' }} className="gradient-text">
              $29
            </div>
            <p style={{ marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>For founders & product teams.</p>
            <ul style={{ textAlign: 'left', listStyle: 'none', marginBottom: '2.5rem' }}>
              <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>✓</span> Unlimited Searches
              </li>
              <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>✓</span> <b>Competitor & Risk Intel</b>
              </li>
              <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>✓</span> <b>Real-time Brand Alerts</b>
              </li>
              <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '28px' }}>
                (Get notified if your product name is mentioned)
              </li>
            </ul>
            <button className="btn-primary" style={{ width: '100%' }}>Start Free Trial</button>
          </div>

        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="section" style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '36px', margin: '4rem auto', padding: '5rem 2rem' }}>
        <h2 className="section-title scroll-reveal-up">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div className="card-glass scroll-reveal-up scroll-reveal-delay-1" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: 'var(--text-main)', fontWeight: '700' }}>
              Does this work on any subreddit?
            </h4>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Yes. Redeco can parse any public Reddit thread. However, it works best on discussion-heavy subreddits like r/technology, r/startups, or r/BuyItForLife.
            </p>
          </div>
          <div className="card-glass scroll-reveal-up scroll-reveal-delay-2" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: 'var(--text-main)', fontWeight: '700' }}>
              How accurate is the sentiment analysis?
            </h4>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              We use state-of-the-art LLMs (Gemini Pro) to understand context, sarcasm, and nuance. It is significantly more accurate than keyword-based sentiment tools.
            </p>
          </div>
          <div className="card-glass scroll-reveal-up scroll-reveal-delay-3" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: 'var(--text-main)', fontWeight: '700' }}>
              Is my search data private?
            </h4>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Yes. We do not store your search history or the content of the threads you analyze. All processing is done on-the-fly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section scroll-reveal-up">
        <h2 className="section-title">
          Get in <span className="gradient-text-alt">Touch</span>
        </h2>
        <div className="card-glass" style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
          <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
            Have questions? Need a custom enterprise integration? We'd love to hear from you.
          </p>
          <a href="mailto:katkamnikhil1305@gmail.com" style={{
            fontSize: '1.6rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #e11d48, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'brightness(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            katkamnikhil1305@gmail.com
          </a>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
            <button className="btn-secondary" style={{ padding: '14px 28px' }}>
              Twitter
            </button>
            <button className="btn-secondary" style={{ padding: '14px 28px' }}>
              LinkedIn
            </button>
          </div>
        </div>
      </section>

      <footer style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        borderTop: '1px solid rgba(139, 92, 246, 0.15)',
        color: '#94a3b8',
        background: 'linear-gradient(180deg, transparent 0%, rgba(245, 243, 255, 0.4) 100%)',
        marginTop: '5rem'
      }}>
        <div style={{ marginBottom: '1.2rem' }}>
          <img
            src="/redeco-logo.png"
            alt="Redeco Logo"
            style={{
              height: '50px',
              width: 'auto',
              opacity: '0.8',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
          © 2026 Redeco - Review Decoder. All rights reserved.
        </p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-light)' }}>
          Decode authentic insights from real discussions.
        </p>
      </footer>
    </>
  );
}
