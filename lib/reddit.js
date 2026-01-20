// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getThreadContent(url, retries = 3) {
    const jsonUrl = url.replace(/\/$/, "") + ".json";

    // Minimal headers to avoid triggering Reddit's bot detection
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json',
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`[Attempt ${attempt}/${retries}] Fetching thread: ${jsonUrl}`);

            const response = await fetch(jsonUrl, {
                headers,
                cache: 'no-store',
                signal: AbortSignal.timeout(15000) // 15 second timeout
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Reddit fetch failed (${response.status}):`, errorText.substring(0, 200));

                // If it's a rate limit, wait and retry
                if (response.status === 429 && attempt < retries) {
                    const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
                    console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
                    await delay(waitTime);
                    continue;
                }

                throw new Error(`Failed to fetch thread: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`Successfully fetched thread with ${data[1]?.data?.children?.length || 0} comments`);
            return data;

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);

            if (attempt === retries) {
                console.error("All retry attempts exhausted for thread fetch");
                return null;
            }

            // Wait before retrying (except for timeout errors)
            if (!error.name?.includes('Timeout')) {
                await delay(1000 * attempt);
            }
        }
    }

    return null;
}

export async function searchReddit(query, retries = 3) {
    const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=10`;

    // Simplified headers for better compatibility
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json',
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`[Attempt ${attempt}/${retries}] Searching Reddit for: ${query}`);

            const response = await fetch(searchUrl, {
                headers,
                cache: 'no-store',
                signal: AbortSignal.timeout(15000)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Reddit search failed (${response.status}):`, errorText.substring(0, 200));

                // Retry on rate limit
                if (response.status === 429 && attempt < retries) {
                    const waitTime = Math.pow(2, attempt) * 1000;
                    console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
                    await delay(waitTime);
                    continue;
                }

                return [];
            }

            const data = await response.json();

            if (!data.data || !data.data.children) {
                console.warn("Reddit search returned no data structure");
                return [];
            }

            // Filter and map results
            const results = data.data.children
                .map(child => child.data)
                .filter(post => post.num_comments >= 2) // Relaxed from 10 to 2 for better availability
                .slice(0, 5) // Top 5 threads
                .map(post => ({
                    title: post.title,
                    url: `https://www.reddit.com${post.permalink}`,
                    comments: post.num_comments,
                    score: post.score
                }));

            console.log(`Found ${results.length} Reddit threads for "${query}"`);
            return results;

        } catch (error) {
            console.error(`Search attempt ${attempt} failed:`, error.message);

            if (attempt === retries) {
                console.error("All retry attempts exhausted for Reddit search");
                return [];
            }

            if (!error.name?.includes('Timeout')) {
                await delay(1000 * attempt);
            }
        }
    }

    return [];
}
