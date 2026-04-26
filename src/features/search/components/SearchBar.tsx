import React, {useCallback, useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputSubmitEditingEventData,
} from 'react-native';
import {Search, X} from 'lucide-react-native';
import {Colors} from '@shared/constants';

const DEBOUNCE_MS = 450;
const ICON_SIZE = 20;
const ICON_COLOR = Colors.textPlaceholder;

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onFocus,
  onBlur,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (text: string) => {
      setLocalValue(text);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        onChangeText(text);
      }, DEBOUNCE_MS);
    },
    [onChangeText],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChangeText('');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, [onChangeText]);

  const handleSubmit = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      const trimmed = e.nativeEvent.text.trim();
      if (trimmed.length > 0) {
        onSubmit(trimmed);
      }
    },
    [onSubmit],
  );

  const showClear = localValue.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.iconLeft}>
        <Search size={ICON_SIZE} color={ICON_COLOR} />
      </View>

      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search repositories…"
        placeholderTextColor={ICON_COLOR}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {showClear && (
        <Pressable
          style={styles.iconRight}
          onPress={handleClear}
          hitSlop={8}
          accessibilityLabel="Clear search"
          accessibilityRole="button">
          <X size={ICON_SIZE} color={ICON_COLOR} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    paddingHorizontal: 12,
    height: 44,
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textOnDark,
    paddingVertical: 0,
  },
  iconRight: {
    marginLeft: 8,
  },
});
