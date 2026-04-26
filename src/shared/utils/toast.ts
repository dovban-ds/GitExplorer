import Toast from 'react-native-toast-message';

const TOAST_DEFAULTS = {
  position: 'top' as const,
  topOffset: 130, // 130 is the optimal top offset
  visibilityTime: 2000,
};

export function showSuccess(text1: string, text2?: string): void {
  Toast.show({
    type: 'success',
    text1,
    text2,
    ...TOAST_DEFAULTS,
  });
}

export function showError(text1: string, text2?: string): void {
  Toast.show({
    type: 'error',
    text1,
    text2,
    ...TOAST_DEFAULTS,
  });
}
