import type { AppBskyFeedDefs } from '@atproto/api';

export const Filters = {
  NoLikes: (comment: AppBskyFeedDefs.ThreadViewPost) => {
    console.log("In no likes");
    console.log(comment.post);
    console.log(comment.post.record);
    return comment.post.likeCount === 0;
  },
  // ... add more filters here as needed ...
};

export default Filters;

