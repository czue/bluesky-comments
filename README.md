# Bluesky Comments

Embed Bluesky comments on your website easily.

**[Write up and demo here](https://coryzue.com/writing/bluesky-comments).**


## Installing on a website from a CDN:

1. Add the default styles the page `<head>` somewhere in a base template:

```html
<link rel="stylesheet" href="https://unpkg.com/bluesky-comments@<VERSION>/dist/bluesky-comments.css">
```

2. Add the comments (and React dependencies) to the end of the body on any page that you wnat to show comments on:


```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/bluesky-comments@<VERSION>/dist/bluesky-comments.umd.js"></script>
```

3. Initialize the comments by passing in a link to the post you want to use as a base:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const uri = 'https://bsky.social/coryzue.com/posts/3jxgux';
    if (uri) {
      initBlueskyComments('bluesky-comments', {uri});
    }
  });
</script>
```

Or by passing the author:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const author = 'coryzue.com';
    if (author) {
      initBlueskyComments('bluesky-comments', {author});
    }
  });
</script>
```

If you use this mode, it will use the most popular post by that author that links
to the current page.


You can also pass in a `onEmpty` callback to handle the case where there are no comments rendered
(for example, if no post matching the URL is found or there aren't any comments on it yet):

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
  initBlueskyComments('bluesky-comments', {
      uri,
      author,
      onEmpty: (details) => {
        console.error('Failed to load comments:', details);
        document.getElementById('bluesky-comments').innerHTML =
          'No comments on this post yet. Details: ' + details.message;
      },
    });
  });
</script>
```


## Installation with npm

```bash
npm install bluesky-comments
```

I don't publish a lot of JavaScript packages, but I think you can import it by doing this!


## Development

To develop on this package, you can run:

```
npm install
npm run watch
```

This will watch for changes and copy the built files to the `dist` directory.
From there you can reference the files in your own project and any updates you make
should show up instantly.
