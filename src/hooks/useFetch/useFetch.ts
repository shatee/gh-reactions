import { useCallback, useState } from 'react';
import { Octokit } from '@octokit/rest';
import { parseRepositoryURL } from '../../utils/parseRepositoryURL';
import { wait } from '../../utils/wait';

const PER_PAGE = 100;
const WAIT_MS = 100;

// octokit が export してないのでコピペして抜粋
export type User = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
};

export type Comment = {
  url: string;
  id: number;
  commit_id: string;
  original_commit_id: string;
  in_reply_to_id: number;
  user: User;
  body: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  pull_request_url: string;
  author_association: string;
  start_line: number;
  original_start_line: number;
  start_side: string;
  line: number;
  original_line: number;
  side: string;
};

export type Reaction = {
  id: number;
  node_id: string;
  user: User;
  content: string;
  created_at: string;
  // 拡張
  comment: Comment;
};

type FetchParams = {
  repos: string[];
  since: Date;
  baseUrl?: string;
  personalAccessToken?: string;
 };

type Return = {
  fetch: (params: FetchParams) => Promise<void>;
  reactions: Reaction[] | null;
  users: User[] | null;
  fetching: boolean;
  fetchProgress: number | undefined;
};

export const useFetch = (): Return => {
  const [reactions, setReactions] = useState<Reaction[]|null>(null);
  const [users, setUsers] = useState<User[]|null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState<number>();

  const fetch = useCallback(({ repos, since, baseUrl, personalAccessToken }: FetchParams) => {
    return (async () => {
      if (fetching) return;
      setFetching(true);
      setFetchProgress(0);
      try {
        const octokit = new Octokit({
          baseUrl,
          auth: personalAccessToken
        });

        const comments = await repos.reduce<Promise<Comment[]>>(async (p, r) => {
          let prev = await p;
          const { owner, repo } = parseRepositoryURL(r);
          if (!owner || !repo) return prev;
          // 最大10ページまでにしておく
          for (let page = 1; page < 10; page++) {
            const { data } = await octokit.pulls.listCommentsForRepo({
              owner,
              repo,
              since: since.toISOString(),
              page,
              per_page: PER_PAGE
            });
            prev = [...prev, ...data];
            await wait(WAIT_MS);
            if (data.length < PER_PAGE) break;
          }
          return prev;
        }, Promise.resolve([]));

        const reactions = await comments.reduce<Promise<Reaction[]>>(async (p, comment, i) => {
          const prev = await p;
          const { owner, repo } = parseRepositoryURL(comment.html_url);
          if (!owner || !repo) return prev;
          const { data } = await octokit.reactions.listForPullRequestReviewComment({
            comment_id: comment.id,
            owner,
            repo
          });
          setFetchProgress(((i + 1) / comments.length) * 100);
          await wait(WAIT_MS);
          return [...prev, ...data.map(reaction => ({...reaction, comment }))];
        }, Promise.resolve([]));

        const users = reactions.reduce<User[]>((prev, reaction) => {
          if (!prev.find(user => user.id === reaction.user.id)) {
            prev.push(reaction.user);
          }
          return prev;
        }, []);

        setReactions(reactions);
        setUsers(users);
        setFetching(false);
        setFetchProgress(undefined);
      } catch (_) {
        setFetching(false);
        setFetchProgress(undefined);
      }
    })();
  }, [fetching]);

  return {
    fetch,
    reactions,
    users,
    fetching,
    fetchProgress
  };
};
