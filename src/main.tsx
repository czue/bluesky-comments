import React from 'react'
import ReactDOM from 'react-dom/client'
import { CommentSection } from './CommentSection'
import { Filters } from './CommentFilters'
import type { CommentOptions } from './types'

const BlueskyComments = {
  init: function(elementId: string, options: CommentOptions) {
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
  },
  Filters
}

// Support both module exports and window global
export default BlueskyComments;

// Add to window object for UMD builds
if (typeof window !== 'undefined') {
  (window as any).BlueskyComments = BlueskyComments;
  // For backward compatibility
  (window as any).initBlueskyComments = BlueskyComments.init;
}

export { CommentSection } from './CommentSection'
export { Filters } from './CommentFilters'
