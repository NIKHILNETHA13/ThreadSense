import { NextResponse } from 'next/server';
import { getThreadContent } from '@/lib/reddit';
import { extractComments } from '@/lib/cleaner';
import { analyzeReviews } from '@/lib/ai';

export async function POST(request) {
    try {
        const { url, apiKey } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'Reddit URL is required' }, { status: 400 });
        }
        if (!apiKey) {
            return NextResponse.json({ error: 'API Key is required' }, { status: 400 });
        }

        // 1. Fetch content from the provided URL
        console.log(`Step 1: Fetching content from ${url}...`);

        // Ensure URL is a valid Reddit link
        if (!url.includes("reddit.com")) {
            return NextResponse.json({ error: 'Please provide a valid reddit.com URL' }, { status: 400 });
        }

        const threadData = await getThreadContent(url);

        if (!threadData) {
            return NextResponse.json({ error: 'Failed to fetch thread. It might be private or deleted.' }, { status: 404 });
        }

        // 2. Extract Comments
        const comments = extractComments(threadData);
        const threadTitle = threadData[0]?.data?.children[0]?.data?.title || "Reddit Thread";

        if (!comments || comments.trim().length === 0) {
            return NextResponse.json({ error: 'Could not extract any human comments from this thread.' }, { status: 404 });
        }

        // 3. Analyze with AI
        console.log(`Step 2: Analyzing with AI...`);
        // Use the Thread Title as the "Query" context for the AI
        const analysis = await analyzeReviews(comments, threadTitle, apiKey);

        return NextResponse.json({
            analysis,
            sources: [{ title: threadTitle, url: url }]
        });

    } catch (error) {
        console.error("API Handler Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
