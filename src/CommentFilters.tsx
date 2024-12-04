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

const TextContainsFilter = (text: string): (comment: AppBskyFeedDefs.ThreadViewPost) => boolean => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return comment.post.record.text.includes(text);
  }
}

const ExactMatchFilter = (text: string): (comment: AppBskyFeedDefs.ThreadViewPost) => boolean => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return comment.post.record.text === text;
  }
}

export const Filters = {
  MinLikeCountFilter,
  MinCharacterCountFilter,
  TextContainsFilter,
  ExactMatchFilter,
  NoLikes: MinLikeCountFilter(0),
  TooShort: MinCharacterCountFilter(5),
  NoPins: ExactMatchFilter('📌'),
};

export default Filters;

