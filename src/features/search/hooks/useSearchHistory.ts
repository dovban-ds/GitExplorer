import {useSearchHistoryStore} from '@shared/store/searchHistoryStore';

export function useSearchHistory() {
  const history = useSearchHistoryStore(state => state.queries);
  const addToHistory = useSearchHistoryStore(state => state.addQuery);
  const clearHistory = useSearchHistoryStore(state => state.clearHistory);

  return {history, addToHistory, clearHistory};
}
