import React from 'react';
import { createRoot } from 'react-dom/client';

import { BlueskyComments, BlueskyFilters } from '../src/main';

const App = () => (
  <div>
    <h1>Testing Bluesky Comments Component</h1>
    <BlueskyComments
      uri="https://bsky.app/profile/coryzue.com/post/3lbrko5zsgk24"
      commentFilters={[
        BlueskyFilters.NoPins, // Hide pinned comments
        BlueskyFilters.MinCharacterCountFilter(10), // Hide comments with less than 10 characters
      ]}
    />
  </div>
);

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
