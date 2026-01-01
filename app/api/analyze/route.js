import { NextResponse } from 'next/server';
import { getThreadContent, searchReddit } from '@/lib/reddit';
import { extractComments } from '@/lib/cleaner';
import { analyzeReviews } from '@/lib/ai';

export async function POST(request) {
    try {
        const { url, mode, input } = await request.json();

        // HARDCODED API KEY - REPLACE THIS WITH YOUR ACTUAL KEY
        const apiKey = "AIzaSyBinKdOVohb9tMvJfgoU3uGigYrw52-Glg";

        if (!apiKey || apiKey === "REPLACE_WITH_YOUR_GEMINI_API_KEY") {
            return NextResponse.json({ error: 'Server configuration error: API Key not set' }, { status: 500 });
        }

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

            // Extract content - Updated to handle the structure returned by extractComments
            // Note: extractComments returns 'text' string (previously 'comments') based on your viewer
            // Let's assume extractComments returns the string directly or an object. 
            // Checking viewer: extractComments(threadData) returns { text, title } or just text? 
            // Previous code: const comments = extractComments(threadData); -> implies string
            // Let's use the cleaner properly.

            const cleanerResult = extractComments(threadData);
            let text = "";
            let title = "Reddit Thread";

            // Handle potential return types
            if (typeof cleanerResult === 'string') {
                text = cleanerResult;
                title = threadData[0]?.data?.children[0]?.data?.title || "Reddit Thread";
            } else {
                text = cleanerResult.text;
                title = cleanerResult.title || "Reddit Thread";
            }

            if (!text) {
                return NextResponse.json({ error: 'No readable comments found in thread' }, { status: 400 });
            }

            combinedText = text;
            sources.push({ title: title, url: targetUrl });
            queryFunc = title;
        }

        // MODE 2: Topic Search
        else if (mode === 'topic') {
            if (!input) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

            console.log(`Analyzing topic: ${input}`);
            queryFunc = input;

            // 1. Search Reddit for top threads
            const searchResults = await searchReddit(input);
            if (!searchResults || searchResults.length === 0) {
                return NextResponse.json({ error: 'No relevant Reddit threads found for this topic' }, { status: 404 });
            }

            console.log(`Found ${searchResults.length} threads. Analyzing top 3...`);

            // 2. Fetch content for top 3 threads
            const topThreads = searchResults.slice(0, 3);

            for (const thread of topThreads) {
                const threadData = await getThreadContent(thread.url);
                if (threadData) {
                    const cleanerResult = extractComments(threadData);
                    let text = "";
                    let title = "";

                    if (typeof cleanerResult === 'string') {
                        text = cleanerResult;
                        title = threadData[0]?.data?.children[0]?.data?.title;
                    } else {
                        text = cleanerResult.text;
                        title = cleanerResult.title;
                    }

                    if (text && text.length > 100) { // Only add if substantial content
                        combinedText += `\n\n--- THREAD: ${title} ---\n${text}`;
                        sources.push({ title: title, url: thread.url });
                    }
                }
            }
        } else {
            return NextResponse.json({ error: 'Invalid mode specified' }, { status: 400 });
        }

        if (!combinedText) {
            return NextResponse.json({ error: 'Could not extract sufficient text for analysis.' }, { status: 400 });
        }

        // Limit text length to prevent token overflow (Gemini 1.5/2.0 Flash has huge context, but good practice)
        // 50,000 chars is roughly 12k tokens, safe for almost all models
        const truncatedText = combinedText.substring(0, 50000);

        // 3. Analyze with AI
        const analysis = await analyzeReviews(truncatedText, queryFunc, apiKey);

        return NextResponse.json({
            analysis,
            sources
        });

    } catch (error) {
        console.error("API Handler Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
