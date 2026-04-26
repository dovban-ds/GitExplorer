import {create} from 'zustand';
import {persist, createJSONStorage, StateStorage} from 'zustand/middleware';
import {createMMKV, MMKV} from 'react-native-mmkv';

const MAX_HISTORY = 10;

let _mmkv: MMKV | null = null;
const getMMKV = (): MMKV => {
  if (!_mmkv) {
    _mmkv = createMMKV({id: 'search-history'});
  }
  return _mmkv;
};

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    getMMKV().set(name, value);
  },
  getItem: name => {
    return getMMKV().getString(name) ?? null;
  },
  removeItem: name => {
    getMMKV().remove(name);
  },
};

interface SearchHistoryState {
  queries: string[];
  addQuery: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    set => ({
      queries: [],

      addQuery: query =>
        set(state => {
          const filtered = state.queries.filter(q => q !== query);
          return {queries: [query, ...filtered].slice(0, MAX_HISTORY)};
        }),

      clearHistory: () => set({queries: []}),
    }),
    {
      name: 'search-history-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
