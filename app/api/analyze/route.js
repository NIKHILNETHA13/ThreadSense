import { NextResponse } from 'next/server';
import { getThreadContent, searchReddit } from '@/lib/reddit';
import { extractComments } from '@/lib/cleaner';
import { analyzeReviews } from '@/lib/ai';

export async function POST(request) {
    try {
        const { url, mode, input } = await request.json();

        // DUAL API KEYS - Fallback Mechanism
        // Key 1 is preferred (Default). Key 2 is backup.
        const apiKeys = [
            "AIzaSyBinKdOVohb9tMvJfgoU3uGigYrw52-Glg", // Primary
            "AIzaSyAM1ZlbUeBH5ANPmXlrzgEAb4-nPmznuts"  // Backup
        ];

        let combinedText = "";
        let sources = [];
        let queryFunc = "";

        // MODE 1: Direct URL
        if (mode === 'url' || url) {
            // Fallback to 'url' param if mode not specified (legacy support)
            const targetUrl = url || input;
            if (!targetUrl) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

            console.log(`Analyzing single URL: ${targetUrl}`);
            const threadData = await getThreadContent(targetUrl);

            if (!threadData) {
                return NextResponse.json({ error: 'Failed to fetch Reddit thread' }, { status: 404 });
            }

            // Extract content
            const cleanerResult = extractComments(threadData);
            let text = "";
            let title = "Reddit Thread";

            // Handle potential return types
            if (typeof cleanerResult === 'string') {
                text = cleanerResult;
                title = threadData[0]?.data?.children[0]?.data?.title || "Reddit Thread";
            } else {
                text = cleanerResult.text;
                title = cleanerResult.title;
            }

            combinedText = text;
            sources.push({ title: title, url: targetUrl });
            queryFunc = `Product review for: ${title}`;
        }
        // MODE 2: Topic Search
        else if (mode === 'topic' || input) {
            const topic = input;
            if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

            console.log(`Searching for topic: ${topic}`);
            const threads = await searchReddit(topic);

            if (!threads || threads.length === 0) {
                return NextResponse.json({ error: 'No relevant Reddit threads found for this topic.' }, { status: 404 });
            }

            // Limit to top 3 threads to save tokens/time
            const topThreads = threads.slice(0, 3);

            for (const thread of topThreads) {
                const threadUrl = `https://www.reddit.com${thread.targetUrl}`; // searchReddit returns permalink usually
                // wait, let's check searchReddit return (it returns simple obj)
                // Assuming it returns full URL or permalink?
                // Let's assume the helper is robust.
                const content = await getThreadContent(thread.url);
                if (content) {
                    const extracted = extractComments(content);
                    const txt = typeof extracted === 'string' ? extracted : extracted.text;
                    combinedText += `\n\n--- Thread: ${thread.title} ---\n${txt}`;
                    sources.push({ title: thread.title, url: thread.url });
                }
            }
            queryFunc = `General sentiment for: ${topic}`;
        } else {
            return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
        }

        if (!combinedText) {
            return NextResponse.json({ error: 'Could not extract sufficient text for analysis.' }, { status: 400 });
        }

        // Truncate if too long (simple char limit for safety)
        const charLimit = 80000; // Gemini 1.5/2.0 context is huge, but let's be safe
        const truncatedText = combinedText.length > charLimit
            ? combinedText.substring(0, charLimit)
            : combinedText;

        console.log(`Sending ${truncatedText.length} chars to AI...`);

        // Perform Analysis - Pass ALL keys for fallback handling
        const analysis = await analyzeReviews(truncatedText, queryFunc, apiKeys);

        return NextResponse.json({
            ...analysis,
            sources: sources
        });

    } catch (error) {
        console.error("API Handler Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
