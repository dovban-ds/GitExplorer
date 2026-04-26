import {githubClient} from '@shared/api/client';
import {PER_PAGE} from '@shared/constants/api';
import type {SearchResponse} from '@shared/types/github';

interface SearchReposParams {
  query: string;
  page: number;
}

export async function searchRepos({
  query,
  page,
}: SearchReposParams): Promise<SearchResponse> {
  const response = await githubClient.get<SearchResponse>(
    '/search/repositories',
    {
      params: {
        q: query,
        per_page: PER_PAGE,
        page,
      },
    },
  );

  return response.data;
}
