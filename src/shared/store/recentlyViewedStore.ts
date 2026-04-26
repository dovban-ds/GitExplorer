import {create} from 'zustand';
import {persist, createJSONStorage, StateStorage} from 'zustand/middleware';
import {createMMKV, MMKV} from 'react-native-mmkv';

const MAX_RECENTLY_VIEWED = 20;

let _mmkv: MMKV | null = null;
const getMMKV = (): MMKV => {
  if (!_mmkv) {
    _mmkv = createMMKV({id: 'recently-viewed'});
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

export interface RecentlyViewedRepo {
  id: number;
  fullName: string;
  ownerAvatarUrl: string;
  viewedAt: number;
}

type AddRepoInput = Omit<RecentlyViewedRepo, 'viewedAt'>;

interface RecentlyViewedState {
  repos: RecentlyViewedRepo[];
  addRepo: (repo: AddRepoInput) => void;
  clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    set => ({
      repos: [],

      addRepo: repo =>
        set(state => {
          const filtered = state.repos.filter(r => r.id !== repo.id);
          const entry: RecentlyViewedRepo = {...repo, viewedAt: Date.now()};
          return {repos: [entry, ...filtered].slice(0, MAX_RECENTLY_VIEWED)};
        }),

      clearHistory: () => set({repos: []}),
    }),
    {
      name: 'recently-viewed-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
