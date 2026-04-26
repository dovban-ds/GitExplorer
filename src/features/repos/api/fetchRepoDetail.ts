import {githubClient} from '@shared/api/client';
import type {Repo} from '@shared/types/github';

export async function fetchRepoDetail(
  owner: string,
  repo: string,
): Promise<Repo> {
  const {data} = await githubClient.get<Repo>(`/repos/${owner}/${repo}`);
  return data;
}
