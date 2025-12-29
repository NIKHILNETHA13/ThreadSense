import { searchReddit, getThreadContent } from './lib/reddit.js';
import { extractComments } from './lib/cleaner.js';

// Mock console.log to keep output clean or just let it print
async function test() {
    console.log("1. Testing Reddit Search for 'Sony WH-1000XM5'...");
    try {
        const results = await searchReddit("Sony WH-1000XM5");
        console.log(`Found ${results.length} threads.`);
        if (results.length > 0) {
            console.log(`Top result: ${results[0].title} (${results[0].url})`);

            console.log("\n2. Testing Thread Fetch...");
            const threadData = await getThreadContent(results[0].url);
            if (threadData) {
                console.log("Thread data fetched successfully.");

                console.log("\n3. Testing Cleaner...");
                const text = extractComments(threadData);
                console.log(`Extracted text length: ${text.length} characters.`);
                console.log("Sample text start:", text.substring(0, 100).replace(/\n/g, ' '));
            } else {
                console.error("Failed to fetch thread data.");
            }
        } else {
            console.error("No results found. Search might be blocked or broken.");
        }
    } catch (e) {
        console.error("Test failed with error:", e);
    }
}

test();
