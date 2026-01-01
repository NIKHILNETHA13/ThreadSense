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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    };

    try {
        console.log(`Searching Reddit for: ${query}`);
        const response = await fetch(searchUrl, { headers });

        if (!response.ok) {
            throw new Error(`Failed to search Reddit: ${response.status}`);
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
