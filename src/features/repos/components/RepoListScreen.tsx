import React, {useCallback, useMemo} from 'react';
import {ActivityIndicator, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import type {Repo} from '@shared/types/github';
import {EmptyHomeState, useSearch} from '@features/search';
import {Colors} from '@shared/constants';

import {RepoCard} from './RepoCard';

interface RepoListScreenProps {
  query: string;
  onHistoryPress: () => void;
}

export function RepoListScreen({query, onHistoryPress}: RepoListScreenProps) {
  const {data, fetchNextPage, isFetchingNextPage, isLoading, isError, refetch} =
    useSearch(query);

  const repos = useMemo(
    () => data?.pages.flatMap(page => page.items) ?? [],
    [data],
  );

  const handleEndReached = useCallback(() => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage]);

  const renderItem = useCallback(({item}: {item: Repo}) => {
    return <RepoCard item={item} />;
  }, []);

  const keyExtractor = useCallback((item: Repo) => String(item.id), []);

  if (!query) {
    return <EmptyHomeState onHistoryPress={onHistoryPress} />;
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Something went wrong. Pull to retry.</Text>
      </View>
    );
  }

  return (
    <FlashList<Repo>
      data={repos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No results</Text>
        </View>
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={styles.footer} size="small" color={Colors.accent} />
        ) : null
      }
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={refetch} tintColor={Colors.accent} />
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textTertiary,
  },
  footer: {
    paddingVertical: 16,
  },
  contentContainer: {
    flexGrow: 1,
  }
});
