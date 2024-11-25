# Bluesky Comments

Embed Bluesky comments on your website easily.

**[Write up and demo here](https://coryzue.com/writing/bluesky-comments).**


## Installing on a website from a CDN:

1. Add the default styles the page `<head>` somewhere in a base template:

```html
<link rel="stylesheet" href="https://unpkg.com/bluesky-comments@0.3.0/dist/bluesky-comments.css">
```

2. Add the comments (and React dependencies) to the end of the body on any page that you wnat to show comments on:


```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/bluesky-comments@0.3.0/dist/bluesky-comments.umd.js"></script>
```

3. Initialize the comments by passing in a link to the post you want to use as a base:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const uri = 'https://bsky.social/coryzue.com/posts/3jxgux';
    if (uri) {
      initBlueskyComments('bluesky-comments', uri);
    }
  });
</script>
```

## Installation with npm

```bash
npm install bluesky-comments
```

I don't publish a lot of JavaScript packages, but I think you can import it by doing this!
