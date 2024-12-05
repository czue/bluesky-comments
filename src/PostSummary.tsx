import React from 'react';
import styles from './CommentSection.module.css';

type PostSummaryProps = {
  postUrl: string;
  post: {
    likeCount?: number;
    repostCount?: number;
    replyCount?: number;
  };
};

export const PostSummary = ({ postUrl, post }: PostSummaryProps) => {
  return (
    <>
      <a href={postUrl} target="_blank" rel="noreferrer noopener">
        <p className={styles.statsBar}>
          <span className={styles.statItem}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="pink" viewBox="0 0 24 24" stroke-width="1.5" stroke="pink" color="pink">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <span>{post.likeCount ?? 0} likes</span>
          </span>
          <span className={styles.statItem}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
            </svg>
            <span>{post.repostCount ?? 0} reposts</span>
          </span>
          <span className={styles.statItem}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="#7FBADC" viewBox="0 0 24 24" stroke-width="1.5" stroke="#7FBADC">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
            <span>{post.replyCount ?? 0} replies</span>
          </span>
        </p>
      </a>
      <h2 className={styles.commentsTitle}>Comments</h2>
      <p className={styles.replyText}>
        Join the conversation by <a className={styles.link} href={postUrl} target="_blank" rel="noreferrer noopener">replying on Bluesky</a>.
      </p>
    </>
  );
};
