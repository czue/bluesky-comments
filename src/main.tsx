import React from 'react'
import ReactDOM from 'react-dom/client'
import { CommentSection } from './CommentSection'

type CommentOptions =
  | { uri: string; author?: string }
  | { uri?: string; author: string };

// Create a global function to initialize the comments
console.log('Initializing Bluesky comments ts');
window.initBlueskyComments = (elementId: string, options: CommentOptions) => {
  console.log("inside init", options)
  const element = document.getElementById(elementId)
  if (!element) return;

  console.log('Rendering Bluesky comments with config:', {
    elementId,
    ...options,
  });

  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <CommentSection
        uri={options.uri}
        author={options.author}
      />
    </React.StrictMode>
  )
}

// Add type declaration for the global function
declare global {
  interface Window {
    initBlueskyComments: (elementId: string, options: CommentOptions) => void;
  }
}
