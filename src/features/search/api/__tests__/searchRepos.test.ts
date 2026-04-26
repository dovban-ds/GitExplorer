import {githubClient} from '@shared/api/client';
import {searchRepos} from '../searchRepos';
import type {SearchResponse} from '@shared/types/github';

jest.mock('@shared/api/client', () => ({
  githubClient: {
    get: jest.fn(),
  },
}));

const mockedGet = githubClient.get as jest.MockedFunction<typeof githubClient.get>;

const mockResponse: SearchResponse = {
  total_count: 1,
  incomplete_results: false,
  items: [
    {
      id: 1,
      name: 'react',
      full_name: 'facebook/react',
      owner: {
        id: 1,
        login: 'facebook',
        avatar_url: 'https://example.com/avatar.png',
        html_url: 'https://github.com/facebook',
        type: 'Organization',
      },
      private: false,
      html_url: 'https://github.com/facebook/react',
      description: 'A JS library for building UIs',
      fork: false,
      url: 'https://api.github.com/repos/facebook/react',
      homepage: 'https://react.dev',
      language: 'JavaScript',
      license: null,
      stargazers_count: 200000,
      watchers_count: 200000,
      forks_count: 40000,
      open_issues_count: 1000,
      default_branch: 'main',
      visibility: 'public',
      archived: false,
      disabled: false,
      topics: ['react', 'javascript'],
      created_at: '2013-05-24T16:15:54Z',
      updated_at: '2026-04-26T00:00:00Z',
      pushed_at: '2026-04-25T00:00:00Z',
      score: 100,
    },
  ],
};

describe('searchRepos', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('calls the correct endpoint with query params', async () => {
    mockedGet.mockResolvedValueOnce({data: mockResponse} as never);

    await searchRepos({query: 'react', page: 1});

    expect(mockedGet).toHaveBeenCalledWith('/search/repositories', {
      params: {q: 'react', per_page: 30, page: 1},
    });
  });

  it('returns the search response data', async () => {
    mockedGet.mockResolvedValueOnce({data: mockResponse} as never);

    const result = await searchRepos({query: 'react', page: 1});

    expect(result).toEqual(mockResponse);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].full_name).toBe('facebook/react');
  });

  it('passes correct page number for pagination', async () => {
    mockedGet.mockResolvedValueOnce({data: mockResponse} as never);

    await searchRepos({query: 'zustand', page: 3});

    expect(mockedGet).toHaveBeenCalledWith('/search/repositories', {
      params: {q: 'zustand', per_page: 30, page: 3},
    });
  });

  it('propagates network errors', async () => {
    const networkError = new Error('Network Error');
    mockedGet.mockRejectedValueOnce(networkError);

    await expect(searchRepos({query: 'react', page: 1})).rejects.toThrow(
      'Network Error',
    );
  });
});
