import React from 'react'
import ReactDOM from 'react-dom/client'
import { CommentSection } from './CommentSection'
import type { CommentOptions } from './types'

// Create a global function to initialize the comments
window.initBlueskyComments = (elementId: string, options: CommentOptions) => {
  const element = document.getElementById(elementId)
  if (!element) return;

  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <CommentSection
        uri={options.uri}
        author={options.author}
        onEmpty={options.onEmpty}
        commentFilters={options.commentFilters}
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
