import {useRecentlyViewedStore} from '../recentlyViewedStore';
import type {RecentlyViewedRepo} from '../recentlyViewedStore';

const makeRepo = (id: number): Omit<RecentlyViewedRepo, 'viewedAt'> => ({
  id,
  fullName: `owner/repo-${id}`,
  ownerAvatarUrl: `https://example.com/avatar-${id}.png`,
});

describe('useRecentlyViewedStore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-26T12:00:00Z'));
    useRecentlyViewedStore.setState({repos: []});
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with an empty repos list', () => {
    const {repos} = useRecentlyViewedStore.getState();
    expect(repos).toEqual([]);
  });

  it('adds a repo to the list', () => {
    useRecentlyViewedStore.getState().addRepo(makeRepo(1));

    const {repos} = useRecentlyViewedStore.getState();
    expect(repos).toHaveLength(1);
    expect(repos[0].id).toBe(1);
    expect(repos[0].fullName).toBe('owner/repo-1');
    expect(repos[0].viewedAt).toBe(Date.now());
  });

  it('prepends new repos to the front of the list', () => {
    const store = useRecentlyViewedStore.getState();
    store.addRepo(makeRepo(1));

    jest.setSystemTime(new Date('2026-04-26T12:01:00Z'));
    useRecentlyViewedStore.getState().addRepo(makeRepo(2));

    const {repos} = useRecentlyViewedStore.getState();
    expect(repos[0].id).toBe(2);
    expect(repos[1].id).toBe(1);
  });

  it('deduplicates repos by id, moving re-viewed repo to front', () => {
    const store = useRecentlyViewedStore.getState();
    store.addRepo(makeRepo(1));
    jest.setSystemTime(new Date('2026-04-26T12:01:00Z'));
    useRecentlyViewedStore.getState().addRepo(makeRepo(2));
    jest.setSystemTime(new Date('2026-04-26T12:02:00Z'));
    useRecentlyViewedStore.getState().addRepo(makeRepo(3));

    jest.setSystemTime(new Date('2026-04-26T12:03:00Z'));
    useRecentlyViewedStore.getState().addRepo(makeRepo(1));

    const {repos} = useRecentlyViewedStore.getState();
    expect(repos).toHaveLength(3);
    expect(repos[0].id).toBe(1);
    expect(repos[0].viewedAt).toBe(
      new Date('2026-04-26T12:03:00Z').getTime(),
    );
  });

  it('limits the list to 20 repos', () => {
    for (let i = 1; i <= 25; i++) {
      jest.setSystemTime(new Date(`2026-04-26T12:${String(i).padStart(2, '0')}:00Z`));
      useRecentlyViewedStore.getState().addRepo(makeRepo(i));
    }

    const {repos} = useRecentlyViewedStore.getState();
    expect(repos).toHaveLength(20);
    expect(repos[0].id).toBe(25);
    expect(repos[19].id).toBe(6);
  });

  it('clears history', () => {
    useRecentlyViewedStore.getState().addRepo(makeRepo(1));
    useRecentlyViewedStore.getState().addRepo(makeRepo(2));
    expect(useRecentlyViewedStore.getState().repos).toHaveLength(2);

    useRecentlyViewedStore.getState().clearHistory();
    expect(useRecentlyViewedStore.getState().repos).toEqual([]);
  });
});
