export function extractComments(threadData) {
    if (!threadData || !Array.isArray(threadData) || threadData.length < 2) {
        return "";
    }

    const commentsData = threadData[1].data.children;
    let allText = [];

    // Helper to process a comment and its replies
    function processComment(comment) {
        if (comment.kind !== 't1') return; // Only process comments
        const data = comment.data;

        // Filter out removed/deleted
        if (data.body && data.body !== '[removed]' && data.body !== '[deleted]') {
            allText.push(`User: ${data.body} (Score: ${data.score})`);
        }

        // Process replies
        if (data.replies && data.replies.data && data.replies.data.children) {
            data.replies.data.children.forEach(processComment);
        }
    }

    commentsData.forEach(processComment);

    // Limit to reasonable token count (approx 200 comments or 50k chars to avoid blowing context)
    return allText.slice(0, 150).join("\n\n");
}
