import React from 'react';
import { AppBskyFeedDefs, AppBskyFeedPost } from '@atproto/api';
import styles from './CommentSection.module.css';

type CommentProps = {
  comment: AppBskyFeedDefs.ThreadViewPost;
  filters?: Array<(arg: any) => boolean>;
};

export const Comment = ({ comment, filters }: CommentProps) => {
  const author = comment.post.author;
  const avatarClassName = styles.avatar;

  if (!AppBskyFeedPost.isRecord(comment.post.record)) return null;
  // filter out replies that match any of the commentFilters, by ensuring they all return false
  if (filters && !filters.every((filter) => !filter(comment))) return null;

  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentContent}>
        <a
          className={styles.authorLink}
          href={`https://bsky.app/profile/${author.did}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {author.avatar ? (
            <img
              src={comment.post.author.avatar}
              alt="avatar"
              className={avatarClassName}
            />
          ) : (
            <div className={avatarClassName} />
          )}
          <p className={styles.authorName}>
            {author.displayName ?? author.handle}{' '}
            <span className={styles.handle}>@{author.handle}</span>
          </p>
        </a>
        <a
          href={`https://bsky.app/profile/${author.did}/post/${comment.post.uri
            .split('/')
            .pop()}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <p>{comment.post.record.text}</p>
          <Actions post={comment.post} />
        </a>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.repliesContainer}>
          {comment.replies.sort(sortByLikes).map((reply) => {
            if (!AppBskyFeedDefs.isThreadViewPost(reply)) return null;
            return (
              <Comment key={reply.post.uri} comment={reply} filters={filters} />
            );
          })}
        </div>
      )}
    </div>
  );
};

const Actions = ({ post }: { post: AppBskyFeedDefs.PostView }) => (
  <div className={styles.actionsContainer}>
    <div className={styles.actionsRow}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
        />
      </svg>
      <p className="text-xs">{post.replyCount ?? 0}</p>
    </div>
    <div className={styles.actionsRow}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
        />
      </svg>
      <p className="text-xs">{post.repostCount ?? 0}</p>
    </div>
    <div className={styles.actionsRow}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      <p className="text-xs">{post.likeCount ?? 0}</p>
    </div>
  </div>
);

const sortByLikes = (a: unknown, b: unknown) => {
  if (
    !AppBskyFeedDefs.isThreadViewPost(a) ||
    !AppBskyFeedDefs.isThreadViewPost(b)
  ) {
    return 0;
  }
  return (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0);
};
