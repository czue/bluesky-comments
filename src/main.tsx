import React from 'react'
import ReactDOM from 'react-dom/client'
import { CommentSection } from './CommentSection'
import { Filters } from './CommentFilters'
import type { CommentOptions } from './types'

export { Filters }  // Export filters directly

export function initBlueskyComments(elementId: string, options: CommentOptions) {
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
