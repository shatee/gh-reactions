export const parseRepositoryURL = (url: string) => {
  const match = url.match(/^https?:\/\/[^/]+\/([^/]+)\/([^/]+)/);
  if (!match) return { owner: null, repo: null };
  const [, owner, repo] = match;
  return { owner, repo };
};
