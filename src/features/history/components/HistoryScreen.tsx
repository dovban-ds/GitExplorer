import React, {useCallback} from 'react';
import {Alert, FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ChevronRight, Trash2} from 'lucide-react-native';

import {
  useRecentlyViewedStore,
  type RecentlyViewedRepo,
} from '@shared/store/recentlyViewedStore';
import {useAppNavigation} from '@navigation/types';
import {Header} from '@shared/components/Header';
import {Colors} from '@shared/constants';
import {showSuccess} from '@shared/utils/toast';
import {formatViewedAt} from '../utils/formatViewedAt';

function HistoryItem({item}: {item: RecentlyViewedRepo}) {
  const navigation = useAppNavigation();

  const handlePress = () => {
    navigation.navigate('RepoDetail', {
      repoId: item.id,
      repoName: item.fullName,
    });
  };

  return (
    <Pressable style={styles.item} onPress={handlePress}>
      <FastImage
        style={styles.avatar}
        source={{uri: item.ownerAvatarUrl, priority: FastImage.priority.normal}}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.repoName} numberOfLines={1}>
          {item.fullName}
        </Text>
        <Text style={styles.viewedAt} numberOfLines={1}>
          {formatViewedAt(item.viewedAt)}
        </Text>
      </View>
      <ChevronRight size={20} color={Colors.textTertiary} />
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No recently viewed repositories</Text>
    </View>
  );
}

function ClearButton({onPress}: {onPress: () => void}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityLabel="Clear history"
      accessibilityRole="button">
      <Trash2 size={20} color={Colors.textSecondary} />
    </Pressable>
  );
}

export function HistoryScreen() {
  const repos = useRecentlyViewedStore(state => state.repos);
  const clearHistory = useRecentlyViewedStore(state => state.clearHistory);
  const navigation = useAppNavigation();

  const handleClearHistory = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all recently viewed repositories?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearHistory();
            showSuccess('History cleared');
          },
        },
      ],
    );
  }, [clearHistory]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderItem = useCallback(
    ({item}: {item: RecentlyViewedRepo}) => <HistoryItem item={item} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: RecentlyViewedRepo) => String(item.id),
    [],
  );

  return (
    <View style={styles.root}>
      <Header
        title="Recently Viewed"
        onBack={handleGoBack}
        rightAction={
          repos.length > 0 ? <ClearButton onPress={handleClearHistory} /> : undefined
        }
      />
      <FlatList
        data={repos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.emptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  repoName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  viewedAt: {
    marginTop: 2,
    fontSize: 13,
    color: Colors.textTertiary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textTertiary,
  },
  emptyList: {
    flexGrow: 1,
  },
});
