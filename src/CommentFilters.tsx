import type { AppBskyFeedDefs } from '@atproto/api';

const MinLikeCountFilter = (min: number): (comment: AppBskyFeedDefs.ThreadViewPost) => boolean => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return comment.post.likeCount <= min;
  }
}

const MinCharacterCountFilter = (min: number): (comment: AppBskyFeedDefs.ThreadViewPost) => boolean => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return comment.post.record.text.length <= min;
  }
}

export const Filters = {
  MinLikeCountFilter,
  MinCharacterCountFilter,
  NoLikes: MinLikeCountFilter(0),
  TooShort: MinCharacterCountFilter(5),
};

export default Filters;

