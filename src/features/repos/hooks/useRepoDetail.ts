import {useQuery} from '@tanstack/react-query';

import type {Repo} from '@shared/types/github';

import {fetchRepoDetail} from '../api/fetchRepoDetail';

export function useRepoDetail(owner?: string, repo?: string) {
  return useQuery<Repo>({
    queryKey: ['repo', owner, repo],
    queryFn: () => fetchRepoDetail(owner!, repo!),
    enabled: !!owner && !!repo,
  });
}
