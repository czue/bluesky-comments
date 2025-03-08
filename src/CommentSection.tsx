import React, { useState, useEffect, useRef } from 'react';
import { AppBskyFeedDefs, type AppBskyFeedGetPostThread } from '@atproto/api';
import styles from './CommentSection.module.css';
import { CommentOptions } from './types';
import { PostSummary } from './PostSummary';
import { Comment } from './Comment';

const getAtUri = (uri: string): string => {
  if (!uri.startsWith('at://') && uri.includes('bsky.app/profile/')) {
    const match = uri.match(/profile\/([\w.]+)\/post\/([\w]+)/);
    if (match) {
      const [, did, postId] = match;
      return `at://${did}/app.bsky.feed.post/${postId}`;
    }
  }
  return uri;
};

export const CommentSection = ({
  uri: propUri,
  author,
  onEmpty,
  commentFilters,
}: CommentOptions) => {
  const [uri, setUri] = useState<string | null>(null);
  const [thread, setThread] = useState<AppBskyFeedDefs.ThreadViewPost | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const lastVisibleIndexRef = useRef(0);

  useEffect(() => {
    if (propUri) {
      setUri(propUri);
      return;
    }

    if (author) {
      const fetchPost = async () => {
        const currentUrl = window.location.href;
        // const currentUrl = "https://www.coryzue.com/writing/authenticity-and-engagement/"
        const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=*&url=${encodeURIComponent(
          currentUrl
        )}&author=${author}&sort=top`;
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.posts && data.posts.length > 0) {
            const post = data.posts[0];
            setUri(post.uri);
          } else {
            setError('No matching post found');
            onEmpty?.({ code: 'not_found', message: 'No matching post found' });
          }
        } catch (err) {
          setError('Error fetching post');
          onEmpty?.({ code: 'fetching_error', message: 'Error fetching post' });
        }
      };

      fetchPost();
    }
  }, [propUri, author, onEmpty]);

  useEffect(() => {
    if (uri) {
      const fetchThreadData = async () => {
        try {
          const thread = await getPostThread(uri);
          setThread(thread);
        } catch (err) {
          setError('Error loading comments');
          onEmpty?.({
            code: 'comment_loading_error',
            message: 'Error loading comments',
          });
        }
      };

      fetchThreadData();
    }
  }, [uri, onEmpty]);

  useEffect(() => {
    if (visibleCount > lastVisibleIndexRef.current) {
      const newBlockquotes = document.querySelectorAll(
        `blockquote[data-index="${lastVisibleIndexRef.current + 1}"]`
      );
      if (newBlockquotes.length > 0) {
        const firstNewBlockquote = newBlockquotes[0];
        const link = firstNewBlockquote.querySelector('a');
        if (link) {
          link.focus();
        }
      }
      lastVisibleIndexRef.current = visibleCount;
    }
  }, [visibleCount]);

  const showMore = () => {
    setVisibleCount((prevCount) => {
      const newCount = prevCount + 5;
      // focus on the first new comment
      setTimeout(() => {
        const newBlockquotes = document.querySelectorAll(
          `blockquote[data-index="${prevCount}"]`
        );
        if (newBlockquotes.length > 0) {
          const firstNewBlockquote = newBlockquotes[0];
          const link = firstNewBlockquote.querySelector('a');
          if (link) {
            link.focus();
          }
        }
      }, 0);
      return newCount;
    });
  };

  if (!uri) return null;

  if (error) {
    return <p className={styles.errorText}>{error}</p>;
  }

  if (!thread) {
    return <p className={styles.loadingText}>Loading comments...</p>;
  }

  let postUrl: string = uri;
  if (uri.startsWith('at://')) {
    const [, , did, _, rkey] = uri.split('/');
    postUrl = `https://bsky.app/profile/${did}/post/${rkey}`;
  }

  if (!thread.replies || thread.replies.length === 0) {
    return (
      <div className={styles.container}>
        <PostSummary postUrl={postUrl} post={thread.post} />
      </div>
    );
  }
  const sortedReplies = thread.replies.sort(sortByLikes);

  return (
    <div className={styles.container}>
      <PostSummary postUrl={postUrl} post={thread.post} />
      <hr className={styles.divider} />
      <div className={styles.commentsList}>
        {sortedReplies.slice(0, visibleCount).map((reply, index) => {
          if (!AppBskyFeedDefs.isThreadViewPost(reply)) return null;
          return (
            <Comment
              key={reply.post.uri}
              comment={reply}
              filters={commentFilters}
              dataIndex={index}
            />
          );
        })}
        {visibleCount < sortedReplies.length && (
          <button onClick={showMore} className={styles.showMoreButton}>
            Show more comments
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M15.854 7.646a.5.5 0 0 1 .001.707l-5.465 5.484a.55.55 0 0 1-.78 0L4.147 8.353a.5.5 0 1 1 .708-.706L10 12.812l5.147-5.165a.5.5 0 0 1 .707-.001"/></svg>
          </button>
        )}
      </div>
    </div>
  );
};

const getPostThread = async (uri: string) => {
  const atUri = getAtUri(uri);
  const params = new URLSearchParams({ uri: atUri });

  const res = await fetch(
    'https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?' +
      params.toString(),
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    console.error(await res.text());
    throw new Error('Failed to fetch post thread');
  }

  const data = (await res.json()) as AppBskyFeedGetPostThread.OutputSchema;

  if (!AppBskyFeedDefs.isThreadViewPost(data.thread)) {
    throw new Error('Could not find thread');
  }

  return data.thread;
};

const sortByLikes = (a: unknown, b: unknown) => {
  if (
    !AppBskyFeedDefs.isThreadViewPost(a) ||
    !AppBskyFeedDefs.isThreadViewPost(b)
  ) {
    return 0;
  }
  return (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0);
};