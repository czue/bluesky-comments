import { type AppBskyFeedDefs } from '@atproto/api';
import { getPostText } from './types';

const MinLikeCountFilter = (
  min: number
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return (comment.post.likeCount ?? 0) < min;
  };
};

const MinCharacterCountFilter = (
  min: number
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return getPostText(comment.post.record).length < min;
  };
};

const TextContainsFilter = (
  text: string
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return getPostText(comment.post.record).toLowerCase().includes(text.toLowerCase());
  };
};

const ExactMatchFilter = (
  text: string
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return getPostText(comment.post.record).toLowerCase() === text.toLowerCase();
  };
};

export const Filters = {
  MinLikeCountFilter,
  MinCharacterCountFilter,
  TextContainsFilter,
  ExactMatchFilter,
  NoLikes: MinLikeCountFilter(0),
  NoPins: ExactMatchFilter('📌'),
};

export default Filters;
