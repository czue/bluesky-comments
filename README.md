# Bluesky Comments

Embed Bluesky comments on your website easily.

**[Write up and demo here](https://coryzue.com/writing/bluesky-comments).**

## React Installation

To use this library in a React project, first install the library:

```bash
npm install bluesky-comments
```

Then import it in your React app/page/component:

```tsx
import { BlueskyComments } from 'bluesky-comments';
```

And, wherever you want the comments to display, add the component:

```tsx
<BlueskyComments
  uri="https://bsky.app/profile/coryzue.com/post/3lbrko5zsgk24"
/>
```

## Non-React Installation via CDN

To add a comments section to any website, follow these steps

### 1. Add an element to your page where you want the comments to show up

Add something like this to your site:

```html
<div id="bluesky-comments"></div>
```

You can use whatever id you want, but it has to match the container id used in the `getElementById` call
in the usage step.

### 2. Add the CSS files

Add the default styles the page `<head>` somewhere in a base template:

```html
<link rel="stylesheet" href="https://unpkg.com/bluesky-comments@<VERSION>/dist/bluesky-comments.css">
```

### 3. Add source maps for React

Add the following importmap to your page anywhere before you use the library:

```
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18",
    "react-dom": "https://esm.sh/react-dom@18",
    "react-dom/client": "https://esm.sh/react-dom@18/client"
  }
}
</script>
```

### 4. Import the library and instantiate the component with React in an ES module script:

```html
<script type="module">
  import { createElement } from 'react';
  import { createRoot } from 'react-dom/client';
  import { BlueskyComments } from 'https://unpkg.com/bluesky-comments@0.4.0/dist/bluesky-comments.es.js';

  const author = 'you.bsky.social';
  const container = document.getElementById('bluesky-comments');
  const root = createRoot(container);
  root.render(
    createElement(BlueskyComments, {
      author: author,
    }
  );
</script>
```

See the [Usage](#usage) section below for details on the API.

## Usage

### Initializing the library based on the author

```javascript
const author = 'you.bsky.social';
BlueskyComments.init('bluesky-comments', {author});
```

If you use this mode, the comments section will use the most popular post by that author that links
to the current page.

### Initializing the library based on a post URL

```javascript
const uri = 'https://bsky.social/coryzue.com/posts/3jxgux';
BlueskyComments.init('bluesky-comments', {uri});
```

If you use this mode, the comments section will use the exact post you specify.
This usually means you have to add the comments section only *after* you've linked to the article.


### (Advanced) Providing custom default empty states

You can pass in a `onEmpty` callback to handle the case where there are no comments rendered
(for example, if no post matching the URL is found or there aren't any comments on it yet):

```javascript
BlueskyComments.init('bluesky-comments', {
    uri,
    author,
    onEmpty: (details) => {
      console.error('Failed to load comments:', details);
      document.getElementById('bluesky-comments').innerHTML =
        'No comments on this post yet. Details: ' + details.message;
    },
});
```

### (Advanced) Filtering comments

You can pass in an array of filters to the `commentFilters` option. These are functions that take a comment and return a boolean. If any of the filters return true, the comment will not be shown.

A few default filters utilities are provided:

- `BlueskyComments.Filters.NoPins`: Hide comments that are just "📌"
- `BlueskyComments.Filters.NoLikes`: Hide comments with no likes

You can also use the following utilities to create your own filters:

- `BlueskyComments.Filters.MinLikeCountFilter`: Hide comments with less than a given number of likes
- `BlueskyComments.Filters.MinCharacterCountFilter`: Hide comments with less than a given number of characters
- `BlueskyComments.Filters.TextContainsFilter`: Hide comments that contain specific text (case insensitive)
- `BlueskyComments.Filters.ExactMatchFilter`: Hide comments that match text exactly (case insensitive)

Pass filters using the `commentFilters` option:

```javascript
BlueskyComments.init('bluesky-comments', {
    // other options here
    commentFilters: [
      BlueskyComments.Filters.NoPins,  // Hide pinned comments
      BlueskyComments.Filters.MinCharacterCountFilter(10), // Hide comments with less than 10 characters
    ],
});
```

You can also write your own filters, by returning `true` for comments you want to hide:

```javascript
const NoTwitterLinksFilter = (comment) => {
  return (comment.post.record.text.includes('https://x.com/') || comment.post.record.text.includes('https://twitter.com/'));
}
BlueskyComments.init('bluesky-comments', {
    // other options here
    commentFilters: [
      NoTwitterLinksFilter,
    ]
});
```

## Usage with npm / yarn in a native JavaScript project

Install the package:

```bash
npm install bluesky-comments
```

Then you can use the library in your projects by importing the CSS and components:

```javascript
import 'bluesky-comments/bluesky-comments.css'
import { CommentSection } from "bluesky-comments";
```

And using them in a React component like this:

```javascript
function App() {
  return (
    <>
      <div>Comments Will Display Below</div>
        <CommentSection
           author="coryzue.com"
           uri=""
           onEmpty={() => <div>No comments yet</div>}
           commentFilters={[]} />
      </div>
    </>
  )
}
```


I don't publish a lot of JavaScript packages, but I think this should work!


## Development

To develop on this package, you can run:

```
npm install
npm run watch
```

This will watch for changes and copy the built files to the `dist` directory.
From there you can reference the files in your own project and any updates you make
should show up instantly.
