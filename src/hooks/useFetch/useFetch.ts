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

export type PullRequest = {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  user: User;
  body: string;
  // labels: Array<PullsGetResponseDataLabelsItem>;
  // milestone: PullsGetResponseDataMilestone;
  active_lock_reason: string;
  created_at: string;
  updated_at: string;
  closed_at: string;
  merged_at: string;
  merge_commit_sha: string;
  // assignee: PullsGetResponseDataAssignee;
  // assignees: Array<PullsGetResponseDataAssigneesItem>;
  // requested_reviewers: Array<PullsGetResponseDataRequestedReviewersItem>;
  // requested_teams: Array<PullsGetResponseDataRequestedTeamsItem>;
  // head: PullsGetResponseDataHead;
  // base: PullsGetResponseDataBase;
  // _links: PullsGetResponseDataLinks;
  author_association: string;
  draft: boolean;
  merged: boolean;
  mergeable: boolean;
  rebaseable: boolean;
  mergeable_state: string;
  // merged_by: PullsGetResponseDataMergedBy;
  comments: number;
  review_comments: number;
  maintainer_can_modify: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
};

export type Reaction = {
  id: number;
  node_id: string;
  user: User;
  content: string;
  created_at: string;
  // 拡張
  comment: Comment;
  pullRequest: PullRequest;
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

        const pulls: Record<string, PullRequest> = {};

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

          if (data.length && !(comment.pull_request_url in pulls)) {
            const match = comment.pull_request_url.match(/\/pulls\/([^/]+)/);
            if (match) {
              const pullNumber = parseInt(match[1], 10);
              const { data } = await octokit.pulls.get({
                owner,
                repo,
                pull_number: pullNumber
              });
              pulls[comment.pull_request_url] = data;
              await wait(WAIT_MS);
            }
          }
          return [...prev, ...data.map(reaction => ({...reaction, comment, pullRequest: pulls[comment.pull_request_url]! }))];
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
