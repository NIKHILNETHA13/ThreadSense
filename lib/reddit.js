export async function getThreadContent(url) {
    const jsonUrl = url.replace(/\/$/, "") + ".json";
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Referer': 'https://www.reddit.com/'
    };

    try {
        console.log(`Fetching thread: ${jsonUrl}`);
        const response = await fetch(jsonUrl, { headers });

        if (!response.ok) {
            throw new Error(`Failed to fetch thread: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching thread content:", error);
        return null;
    }
}

export async function searchReddit(query) {
    const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=10`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
    };

    // Retry logic for deployment environments
    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[Attempt ${attempt + 1}/${maxRetries + 1}] Searching Reddit for: ${query}`);
            console.log(`Request URL: ${searchUrl}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(searchUrl, {
                headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log(`Reddit API Response Status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Reddit API Error (${response.status}):`, errorText);
                throw new Error(`Failed to search Reddit: ${response.status} - ${errorText.substring(0, 200)}`);
            }

            const data = await response.json();
            console.log(`Reddit API returned ${data?.data?.children?.length || 0} results`);

            if (!data.data || !data.data.children) {
                console.warn('Reddit API returned unexpected structure:', JSON.stringify(data).substring(0, 200));
                return [];
            }

            // Filter and map results
            const results = data.data.children
                .map(child => child.data)
                .filter(post => post.num_comments > 10) // Only threads with discussions
                .slice(0, 5) // Top 5 threads
                .map(post => ({
                    title: post.title,
                    url: `https://www.reddit.com${post.permalink}`,
                    comments: post.num_comments,
                    score: post.score
                }));

            console.log(`Filtered to ${results.length} relevant threads`);
            return results;

        } catch (error) {
            lastError = error;
            console.error(`[Attempt ${attempt + 1}] Error searching Reddit:`, error.message);

            // If it's the last attempt, give up
            if (attempt === maxRetries) {
                console.error('All retry attempts failed. Returning empty array.');
                console.error('Last error:', error);
                return [];
            }

            // Wait before retrying (exponential backoff)
            const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
            console.log(`Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    return [];
}
