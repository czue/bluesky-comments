import { AppBskyFeedDefs, AppBskyFeedPost } from '@atproto/api';

export interface CommentEmptyDetails {
  code: string;
  message: string;
}

export interface CommentOptions {
  uri?: string;
  author?: string;
  commentFilters?: Array<(arg: any) => boolean>;
  onEmpty?: (details: CommentEmptyDetails) => void;
  enableDeer?: boolean;
}

/**
 * Helper functions for safely accessing Bluesky data with proper typing
 */

/**
 * Safely get post text if record is valid, or return fallback value
 */
export function getPostText(record: unknown, fallback: string = ''): string {
  if (AppBskyFeedPost.isRecord(record)) {
    return (record as AppBskyFeedPost.Record).text;
  }
  return fallback;
}

/**
 * Safely sort thread posts by like count
 */
export function sortThreadPostsByLikes(a: unknown, b: unknown): number {
  if (
    !AppBskyFeedDefs.isThreadViewPost(a) ||
    !AppBskyFeedDefs.isThreadViewPost(b)
  ) {
    return 0;
  }
  return ((b as AppBskyFeedDefs.ThreadViewPost).post.likeCount ?? 0) - 
         ((a as AppBskyFeedDefs.ThreadViewPost).post.likeCount ?? 0);
}

/**
 * Type guard that checks if a post record has text and returns the record properly typed
 */
export function isPostWithText(record: unknown): record is AppBskyFeedPost.Record {
  return AppBskyFeedPost.isRecord(record);
}
