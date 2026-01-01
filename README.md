# ⚡ Redeco - Review Decoder

**Real Intelligence from Real Discussions.**

Redeco (Review Decoder) validates products and ideas by analyzing Reddit discussions. It uses AI to filter out the noise, detect sentiment, and summarize the community consensus in seconds.

## ✨ Features

- **🛡️ Unfiltered Truth**: Bypasses SEO blogs and fake reviews to get real user opinions.
- **📊 Sentiment Gauge**: Visualizes the "vibe" of a product with a dynamic meter and emoji.
- **⚡ Competitor Recon**: Identifies alternatives mentioned by users.
- **🎯 Referenced Threads**: View and visit the exact Reddit discussions used for the analysis.
- **🧠 AI-Powered**: Uses Google Gemini 1.5/2.0 Flash for blazing fast analysis.

## 🚀 How to Run

### Prerequisites
- Node.js 18+ installed.
- A free [Google Gemini API Key](https://aistudio.google.com/app/apikey).

### Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/NIKHILNETHA13/ThreadSense.git
    cd ThreadSense
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    - Create a file named `.env.local` in the root directory.
    - Add your key: `GEMINI_API_KEY=your_key_here`

4.  **Run the App**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    - Visit [http://localhost:3000](http://localhost:3000).

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS, Glassmorphism
- **AI**: Google Gemini API (Free Tier)
- **Data**: Reddit Public JSON API

