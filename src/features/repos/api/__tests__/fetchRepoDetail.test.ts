import {githubClient} from '@shared/api/client';
import {fetchRepoDetail} from '../fetchRepoDetail';
import type {Repo} from '@shared/types/github';

jest.mock('@shared/api/client', () => ({
  githubClient: {
    get: jest.fn(),
  },
}));

const mockedGet = githubClient.get as jest.MockedFunction<typeof githubClient.get>;

const mockRepo: Repo = {
  id: 42,
  name: 'zustand',
  full_name: 'pmndrs/zustand',
  owner: {
    id: 10,
    login: 'pmndrs',
    avatar_url: 'https://example.com/pmndrs.png',
    html_url: 'https://github.com/pmndrs',
    type: 'Organization',
  },
  private: false,
  html_url: 'https://github.com/pmndrs/zustand',
  description: 'Bear necessities for state management',
  fork: false,
  url: 'https://api.github.com/repos/pmndrs/zustand',
  homepage: 'https://zustand.pmnd.rs',
  language: 'TypeScript',
  license: {key: 'mit', name: 'MIT License', spdx_id: 'MIT', url: null},
  stargazers_count: 50000,
  watchers_count: 50000,
  forks_count: 1500,
  open_issues_count: 50,
  default_branch: 'main',
  visibility: 'public',
  archived: false,
  disabled: false,
  topics: ['state-management', 'react'],
  created_at: '2019-04-09T00:00:00Z',
  updated_at: '2026-04-26T00:00:00Z',
  pushed_at: '2026-04-25T00:00:00Z',
  score: 0,
};

describe('fetchRepoDetail', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('calls the correct endpoint with owner and repo', async () => {
    mockedGet.mockResolvedValueOnce({data: mockRepo} as never);

    await fetchRepoDetail('pmndrs', 'zustand');

    expect(mockedGet).toHaveBeenCalledWith('/repos/pmndrs/zustand');
  });

  it('returns the repo data', async () => {
    mockedGet.mockResolvedValueOnce({data: mockRepo} as never);

    const result = await fetchRepoDetail('pmndrs', 'zustand');

    expect(result).toEqual(mockRepo);
    expect(result.full_name).toBe('pmndrs/zustand');
    expect(result.language).toBe('TypeScript');
  });

  it('propagates errors from the API', async () => {
    const apiError = new Error('Request failed with status code 404');
    mockedGet.mockRejectedValueOnce(apiError);

    await expect(fetchRepoDetail('unknown', 'repo')).rejects.toThrow(
      'Request failed with status code 404',
    );
  });
});
