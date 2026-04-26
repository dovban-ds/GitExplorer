import {useEffect} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';

import {PER_PAGE} from '@shared/constants/api';
import type {SearchResponse} from '@shared/types/github';
import {showError} from '@shared/utils/toast';

import {searchRepos} from '../api/searchRepos';

export function useSearch(query: string) {
  const result = useInfiniteQuery<SearchResponse>({
    queryKey: ['searchRepos', query],
    queryFn: ({pageParam}) => searchRepos({query, page: pageParam as number}),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const fetched = (lastPageParam as number) * PER_PAGE;
      if (fetched >= lastPage.total_count) {
        return undefined;
      }
      return (lastPageParam as number) + 1;
    },
    enabled: query.length > 0,
  });

  useEffect(() => {
    if (result.error) {
      showError('Search failed', result.error.message);
    }
  }, [result.error]);

  return result;
}
