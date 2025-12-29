export async function searchReddit(query) {
    // Use a standard browser User-Agent
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/'
    };

    try {
        const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&t=year&limit=5`;

        console.log(`Searching Reddit: ${searchUrl}`);
        const response = await fetch(searchUrl, { headers });

        if (!response.ok) {
            throw new Error(`Reddit Search failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.data.children.map(child => ({
            title: child.data.title,
            url: `https://www.reddit.com${child.data.permalink}`,
            num_comments: child.data.num_comments,
            score: child.data.score,
            subreddit: child.data.subreddit
        }));

    } catch (error) {
        console.error("Error searching Reddit:", error);
        return [];
    }
}

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
