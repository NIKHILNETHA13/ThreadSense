# ⚡ Redeco - Review Decoder

**Real Intelligence from Real Discussions.**

Redeco (Review Decoder) validates products and ideas by analyzing Reddit discussions. It uses AI to filter out the noise, detect sentiment, and summarize the community consensus in seconds.

## ✨ Features

- **🛡️ Unfiltered Truth**: Bypasses SEO blogs and fake reviews to get real user opinions.
- **📊 Sentiment Gauge**: Visualizes the "vibe" of a product with a dynamic meter and emoji.
- **⚡ Competitor Recon**: Identifies alternatives mentioned by users.
- **🧠 AI-Powered**: Uses Google Gemini 1.5/2.0 Flash for blazing fast analysis.

## 🚀 How to Run

### Prerequisities
- Node.js 18+ installed.
- A free [Google Gemini API Key](https://aistudio.google.com/app/apikey).

### Setup

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd redeco
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    - Open `lib/ai.js`.
    - Ensure your API key is set.
    - *Note: In a production app, use `.env.local`.*

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

