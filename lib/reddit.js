// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getThreadContent(url, retries = 3) {
    // Try both www and old reddit
    const jsonUrl = url.replace(/\/$/, "").replace("www.reddit.com", "old.reddit.com") + ".json";

    // Unique User-Agent to identify the app and avoid generic bot blocking
    const headers = {
        'User-Agent': 'RedecoReviewBot/1.0.0 (contact: katkamnikhil1305@gmail.com)',
        'Accept': 'application/json',
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Alternate between www and old on retries
            const currentUrl = attempt % 2 === 0
                ? jsonUrl.replace("old.reddit.com", "www.reddit.com")
                : jsonUrl;

            console.log(`[Attempt ${attempt}/${retries}] Fetching thread: ${currentUrl}`);

            const response = await fetch(currentUrl, {
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
    // Adding raw_json=1 and a more specific search URL
    const searchUrl = `https://old.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=10&raw_json=1`;

    const headers = {
        'User-Agent': 'RedecoReviewBot/1.0.0 (contact: katkamnikhil1305@gmail.com)',
        'Accept': 'application/json',
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Alternate between old and www on retries
            const currentUrl = attempt % 2 === 0
                ? searchUrl.replace("old.reddit.com", "www.reddit.com")
                : searchUrl;

            console.log(`[Attempt ${attempt}/${retries}] Searching Reddit for: ${query} at ${currentUrl}`);

            const response = await fetch(currentUrl, {
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
