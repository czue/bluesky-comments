/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import {
  AppBskyFeedDefs,
  AppBskyFeedPost,
  type AppBskyFeedGetPostThread,
} from "@atproto/api";
import styles from './CommentSection.module.css';
interface Props {
  uri?: string;
  author?: string;
}

type Reply = {
  post: {
    uri: string;
    likeCount?: number;
    repostCount?: number;
    replyCount?: number,
  };
};

type Thread = {
  replies: Reply[];
  post: {
    likeCount?: number;
    repostCount?: number;
    replyCount?:number;
  };
};
const formatUri = (uri: string): string => {
  console.log('formatting uri', uri);
  if (!uri.startsWith('at://') && uri.includes('bsky.app/profile/')) {
    const match = uri.match(/profile\/([\w.]+)\/post\/([\w]+)/);
    if (match) {
      const [, did, postId] = match;
      console.log('reformatted uri', `at://${did}/app.bsky.feed.post/${postId}`);
      return `at://${did}/app.bsky.feed.post/${postId}`;
    }
  }
  console.log('reformatted uri', uri);
  return uri;
};


export const CommentSection = ({ uri: propUri, author }: Props) => {
  const [uri, setUri] = useState<string | null>(null);
  const [thread, setThread] = useState<Thread | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    if (propUri) {
      setUri(propUri);
      return;
    }

    if (author) {
      const fetchPost = async () => {
        const currentUrl = window.location.href;
        const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=*&url=${encodeURIComponent(currentUrl)}&author=${author}`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.posts && data.posts.length > 0) {
            const post = data.posts[0];
            setUri(post.uri);
          } else {
            setError('No matching post found');
          }
        } catch (err) {
          setError('Error fetching post');
        }
      };

      fetchPost();
    }
  }, [propUri, author]);

  useEffect(() => {
    if (uri) {
      const fetchThreadData = async () => {
        try {
          const thread = await getPostThread(uri);
          setThread(thread);
        } catch (err) {
          setError('Error loading comments');
        }
      };

      fetchThreadData();
    }
  }, [uri]);

  if (!uri) return null;

  const [, , did, _, rkey] = uri.split("/");
  const postUrl = `https://bsky.app/profile/${did}/post/${rkey}`;

  if (error) {
    return <p className={styles.errorText}>{error}</p>;
  }

  if (!thread) {
    return <p className={styles.loadingText}>Loading comments...</p>;
  }

  if (!thread.replies || thread.replies.length === 0) {
    return <div />;
  }

  const showMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  const sortedReplies = thread.replies.sort(sortByLikes);

  return (
    <div className={styles.container}>
      <a href={postUrl} target="_blank" rel="noreferrer noopener">
        <p className={styles.statsBar}>
          <span className={styles.statItem}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="pink" viewBox="0 0 24 24" stroke-width="1.5" stroke="pink" color="pink">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <span>{thread.post.likeCount ?? 0} likes</span>
          </span>
          <span className={styles.statItem}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
            </svg>
            <span>{thread.post.repostCount ?? 0} reposts</span>
          </span>
          <span className={styles.statItem}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="#7FBADC" viewBox="0 0 24 24" stroke-width="1.5" stroke="#7FBADC">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
            <span>{thread.post.replyCount ?? 0} replies</span>
          </span>
        </p>
      </a>
      <h2 className={styles.commentsTitle}>Comments</h2>
      <p className={styles.replyText}>
        Reply on Bluesky{" "}
        <a
          href={postUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          here
        </a>{" "}
        to join the conversation.
      </p>
      <hr className={styles.divider} />
      <div className={styles.commentsList}>
        {sortedReplies.slice(0, visibleCount).map((reply) => {
          if (!AppBskyFeedDefs.isThreadViewPost(reply)) return null;
          return <Comment key={reply.post.uri} comment={reply} />;
        })}
        {visibleCount < sortedReplies.length && (
          <button onClick={showMore} className={styles.showMoreButton}>
            Show more comments
          </button>
        )}
      </div>
    </div>
  );
};


const Comment = ({ comment }: { comment: AppBskyFeedDefs.ThreadViewPost }) => {
  const author = comment.post.author;
  const avatarClassName = styles.avatar;

  if (!AppBskyFeedPost.isRecord(comment.post.record)) return null;

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
            {author.displayName ?? author.handle}{" "}
            <span className={styles.handle}>@{author.handle}</span>
          </p>
        </a>
        <a
          href={`https://bsky.app/profile/${author.did}/post/${comment.post.uri.split("/").pop()}`}
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
            return <Comment key={reply.post.uri} comment={reply} />;
          })}
        </div>
      )}
    </div>
  );
};
const Actions = ({ post }: { post: AppBskyFeedDefs.PostView }) => (
  <div className={styles.actionsContainer}>
    <div className={styles.actionsRow}>
      <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
      </svg>
      <p className="text-xs">{post.replyCount ?? 0}</p>
    </div>
    <div className={styles.actionsRow}>
      <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
      </svg>
      <p className="text-xs">{post.repostCount ?? 0}</p>
    </div>
    <div className={styles.actionsRow}>
      <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
      <p className="text-xs">{post.likeCount ?? 0}</p>
    </div>
  </div>
);

const getPostThread = async (uri: string) => {
  const atUri = formatUri(uri);
  const params = new URLSearchParams({ uri: atUri });

  const res = await fetch(
    "https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?" +
    params.toString(),
    {
      method: 'GET',
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to fetch post thread");
  }

  const data = (await res.json()) as AppBskyFeedGetPostThread.OutputSchema;

  if (!AppBskyFeedDefs.isThreadViewPost(data.thread)) {
    throw new Error("Could not find thread");
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
