export interface RepoOwner {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface RepoLicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string | null;
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: RepoOwner;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  homepage: string | null;
  language: string | null;
  license: RepoLicense | null;

  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;

  default_branch: string;
  visibility: string;
  archived: boolean;
  disabled: boolean;

  topics: string[];

  created_at: string;
  updated_at: string;
  pushed_at: string;

  /**
   * Relevance score returned only in search results.
   * Not present on standard repository endpoints.
   */
  score: number;
}

/**
 * Maps to the GitHub REST API response for `GET /search/repositories`.
 * @see https://docs.github.com/en/rest/search/search#search-repositories
 */
export interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repo[];
}
