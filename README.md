# Bluesky Comments

Embed Bluesky comments on your website easily.

**[Write up and demo here](https://coryzue.com/writing/bluesky-comments).**

## Installation in a Node.js project as a React component

To use this library in a React project, first install the library:

```bash
npm install bluesky-comments
```

Then import it (and the CSS) in your React app/page/component:

```tsx
import 'bluesky-comments/bluesky-comments.css'
import { BlueskyComments } from 'bluesky-comments';
```

And use it in any React component like this:

```javascript
function App() {
  return (
    <>
      <div>Comments Will Display Below</div>
      <BlueskyComments author="you.bsky.social" />
    </>
  )
}
```

See the [Usage](#usage) section below for details on the options and API.

## Installation on any website via CDN

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
  import { BlueskyComments } from 'https://unpkg.com/bluesky-comments@<VERSION>/dist/bluesky-comments.es.js';

  const author = 'you.bsky.social';
  const container = document.getElementById('bluesky-comments');
  const root = createRoot(container);
  root.render(
    createElement(BlueskyComments, {
      "author": author,
    })
  );
</script>
```

See the [Usage](#usage) section below for details on the options and API.

## Usage

Examples in this section use the React JSX syntax. If you're installing on a project that doens't
use JSX or any build tooling (i.e. a regular website), you can instead use the `createElement`
function and pass the react options in.

For example, the following two examples are equivalent:

React JSX:

```javascript
<BlueskyComments
  author="you.bsky.social"
  uri="https://bsky.app/profile/coryzue.com/post/3lbrko5zsgk24"
/>
```

Equivalent without JSX:

```javascript
root.render(
  createElement(BlueskyComments, {
    author: "you.bsky.social",
    uri: "https://bsky.app/profile/coryzue.com/post/3lbrko5zsgk24",
  })
);
```

### Initializing the library based on the author


```javascript
<BlueskyComments author="you.bsky.social"  />
```

If you use this mode, the comments section will use the most popular post by that author that links
to the current page.

### Initializing the library based on a post URL

```javascript
<BlueskyComments uri="https://bsky.app/profile/coryzue.com/post/3lbrko5zsgk24" />
```

If you use this mode, the comments section will use the exact post you specify.
This usually means you have to add the comments section only *after* you've linked to the article.

### (Advanced) Providing custom default empty states

You can pass in a `onEmpty` callback to handle the case where there are no comments rendered
(for example, if no post matching the URL is found or there aren't any comments on it yet):

```javascript
<BlueskyComments
    uri="https://bsky.app/profile/coryzue.com/post/3lbrko5zsgk24"
    author="you.bsky.social"
    onEmpty={
      (details) => {
        console.error('Failed to load comments:', details);
        document.getElementById('bluesky-comments').innerHTML =
          'No comments on this post yet. Details: ' + details.message;
      }
    }
});
```

### (Advanced) Filtering comments

You can pass in an array of filters to the `commentFilters` option. These are functions that take a comment and return a boolean. If any of the filters return true, the comment will not be shown.

A few default filters utilities are provided:

- `BlueskyFilters.NoPins`: Hide comments that are just "📌"
- `BlueskyFilters.NoLikes`: Hide comments with no likes

You can also use the following utilities to create your own filters:

- `BlueskyFilters.MinLikeCountFilter`: Hide comments with less than a given number of likes
- `BlueskyFilters.MinCharacterCountFilter`: Hide comments with less than a given number of characters
- `BlueskyFilters.TextContainsFilter`: Hide comments that contain specific text (case insensitive)
- `BlueskyFilters.ExactMatchFilter`: Hide comments that match text exactly (case insensitive)

Pass filters using the `commentFilters` option:

```javascript
import {BlueskyComments, BlueskyFilters} from 'bluesky-comments';

<BlueskyComments
    // other options here
    commentFilters={[
      BlueskyFilters.NoPins,  // Hide pinned comments
      BlueskyFilters.MinCharacterCountFilter(10), // Hide comments with less than 10 characters
    ]}
/>
```

You can also write your own filters, by returning `true` for comments you want to hide:

```javascript
const NoTwitterLinksFilter = (comment) => {
  return (comment.post.record.text.includes('https://x.com/') || comment.post.record.text.includes('https://twitter.com/'));
}
<BlueskyComments
    // other options here
    commentFilters={[
      NoTwitterLinksFilter,
    ]
/>
```

## Development

To develop on this package, you can run:

```
npm install
npm run dev
```

This will set up a local development server with a simple page showing comments,
and watch for changes.

You can also run  `npm run build` (build once) or `npm run watch` (watch for changes)
 to copy the built files to the `dist` directory.
From there you can reference the files in your own projects.
