export async function getThreadContent(url) {
    const jsonUrl = url.replace(/\/$/, "") + ".json";

    // Enhanced headers to look like a real browser
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.reddit.com/',
        'Origin': 'https://www.reddit.com',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Cache-Control': 'max-age=0'
    };

    try {
        console.log(`Fetching thread: ${jsonUrl}`);
        const response = await fetch(jsonUrl, {
            headers,
            // Add cache busting
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`Reddit fetch failed: ${response.status} ${response.statusText}`);
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

    // Super-Stealth headers to mimic a real windows browser
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.reddit.com/',
        'Origin': 'https://www.reddit.com',
        'DNT': '1',
        'Connection': 'keep-alive',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
    };

    try {
        console.log(`Searching Reddit for: ${query}`);
        const response = await fetch(searchUrl, {
            headers,
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`Reddit search failed: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        if (!data.data || !data.data.children) {
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

        return results;

    } catch (error) {
        console.error("Error searching Reddit:", error);
        return [];
    }
}
