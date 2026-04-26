import React, {useCallback, useMemo} from 'react';
import {ActivityIndicator, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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

  if (isError && !repos.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Something went wrong.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      {isError && repos.length && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>Failed to load more</Text>
          <TouchableOpacity style={styles.errorBannerRetry} onPress={() => fetchNextPage()}>
            <Text style={styles.errorBannerRetryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
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
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.background,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundTertiary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  errorBannerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorBannerRetry: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.accent,
  },
  errorBannerRetryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.background,
  },
});
