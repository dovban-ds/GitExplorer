import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Clock} from 'lucide-react-native';
import {Colors} from '@shared/constants';

import {RepoListScreen} from '@features/repos';
import {useAppNavigation} from '@navigation/types';

import {SearchBar} from './SearchBar';
import {SearchHistoryList} from './SearchHistoryList';

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useAppNavigation();

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  const handleSubmit = useCallback((q: string) => setQuery(q), []);
  const handleHistoryPress = useCallback(() => {
    navigation.navigate('History');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.searchRow}>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
          />
        </View>
        <Pressable
          style={styles.historyButton}
          onPress={handleHistoryPress}
          hitSlop={8}
          accessibilityLabel="View history"
          accessibilityRole="button">
          <Clock size={24} color={Colors.textPlaceholder} />
        </Pressable>
      </View>
      <SearchHistoryList
        visible={isFocused && query === ''}
        onSearch={setQuery}
      />
      <RepoListScreen query={query} onHistoryPress={handleHistoryPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  searchBarWrapper: {
    flex: 1,
  },
  historyButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
