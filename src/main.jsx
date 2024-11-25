import React from 'react'
import ReactDOM from 'react-dom/client'
import { CommentSection } from './CommentSection'

// Create a global function to initialize the comments
console.log('Initializing Bluesky comments');
window.initBlueskyComments = (elementId, uri) => {
  const element = document.getElementById(elementId)
  if (element) {
    // Ensure URI is properly formatted
    let formattedUri = uri;
    if (!uri.startsWith('at://')) {
      // If it's a bsky.app URL, convert it
      if (uri.includes('bsky.app/profile/')) {
        const match = uri.match(/profile\/([\w.]+)\/post\/([\w]+)/);
        if (match) {
          const [, did, postId] = match;
          formattedUri = `at://${did}/app.bsky.feed.post/${postId}`;
        }
      }
    }

    console.log('Rendering Bluesky comments for URI:', formattedUri);
    ReactDOM.createRoot(element).render(
      <React.StrictMode>
        <CommentSection uri={formattedUri} />
      </React.StrictMode>
    )
  }
}
