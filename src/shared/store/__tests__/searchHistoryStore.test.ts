import {useSearchHistoryStore} from '../searchHistoryStore';

describe('useSearchHistoryStore', () => {
  beforeEach(() => {
    useSearchHistoryStore.setState({queries: []});
  });

  it('starts with an empty queries list', () => {
    expect(useSearchHistoryStore.getState().queries).toEqual([]);
  });

  it('adds a query to the list', () => {
    useSearchHistoryStore.getState().addQuery('react');

    const {queries} = useSearchHistoryStore.getState();
    expect(queries).toEqual(['react']);
  });

  it('prepends new queries to the front', () => {
    const store = useSearchHistoryStore.getState();
    store.addQuery('react');
    useSearchHistoryStore.getState().addQuery('zustand');

    const {queries} = useSearchHistoryStore.getState();
    expect(queries[0]).toBe('zustand');
    expect(queries[1]).toBe('react');
  });

  it('deduplicates queries, moving repeated query to front', () => {
    useSearchHistoryStore.getState().addQuery('react');
    useSearchHistoryStore.getState().addQuery('zustand');
    useSearchHistoryStore.getState().addQuery('mmkv');

    useSearchHistoryStore.getState().addQuery('react');

    const {queries} = useSearchHistoryStore.getState();
    expect(queries).toHaveLength(3);
    expect(queries[0]).toBe('react');
    expect(queries[1]).toBe('mmkv');
    expect(queries[2]).toBe('zustand');
  });

  it('limits the list to 10 queries', () => {
    for (let i = 1; i <= 15; i++) {
      useSearchHistoryStore.getState().addQuery(`query-${i}`);
    }

    const {queries} = useSearchHistoryStore.getState();
    expect(queries).toHaveLength(10);
    expect(queries[0]).toBe('query-15');
    expect(queries[9]).toBe('query-6');
  });

  it('does not grow beyond 10 even with duplicates', () => {
    for (let i = 1; i <= 10; i++) {
      useSearchHistoryStore.getState().addQuery(`query-${i}`);
    }

    useSearchHistoryStore.getState().addQuery('query-5');

    const {queries} = useSearchHistoryStore.getState();
    expect(queries).toHaveLength(10);
    expect(queries[0]).toBe('query-5');
  });

  it('clears history', () => {
    useSearchHistoryStore.getState().addQuery('react');
    useSearchHistoryStore.getState().addQuery('zustand');
    expect(useSearchHistoryStore.getState().queries).toHaveLength(2);

    useSearchHistoryStore.getState().clearHistory();
    expect(useSearchHistoryStore.getState().queries).toEqual([]);
  });
});
