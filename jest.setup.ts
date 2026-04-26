jest.mock('react-native-nitro-modules', () => ({
  NitroModules: {
    createHybridObject: jest.fn(),
  },
}));

jest.mock('react-native-mmkv', () => {
  const stores = new Map<string, Map<string, string>>();

  const createMMKV = ({id}: {id: string}) => {
    if (!stores.has(id)) {
      stores.set(id, new Map());
    }
    const storage = stores.get(id)!;

    return {
      getString: jest.fn((key: string) => storage.get(key)),
      set: jest.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      delete: jest.fn((key: string) => {
        storage.delete(key);
      }),
      remove: jest.fn((key: string) => {
        storage.delete(key);
      }),
      contains: jest.fn((key: string) => storage.has(key)),
      getAllKeys: jest.fn(() => Array.from(storage.keys())),
      clearAll: jest.fn(() => storage.clear()),
    };
  };

  return {createMMKV};
});

jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn((init: unknown) => ({value: init})),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((value: unknown) => value),
  withSpring: jest.fn((value: unknown) => value),
  withDelay: jest.fn((_: number, value: unknown) => value),
  FadeIn: {duration: jest.fn().mockReturnThis()},
  FadeOut: {duration: jest.fn().mockReturnThis()},
  Layout: {duration: jest.fn().mockReturnThis()},
  default: {
    call: jest.fn(),
  },
}));

jest.mock('react-native-worklets', () => ({}));
