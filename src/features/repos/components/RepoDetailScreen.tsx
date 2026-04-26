import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  CircleDot,
  Clock,
  Code,
  GitFork,
  Scale,
  Star,
} from 'lucide-react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {useAppNavigation, useAppRoute} from '@navigation/types';
import {useRecentlyViewedStore} from '@shared/store/recentlyViewedStore';
import {Skeleton} from '@shared/components/ui/Skeleton';
import {Header} from '@shared/components/Header';

import {useRepoDetail} from '../hooks/useRepoDetail';
import { SafeAreaView } from 'react-native-safe-area-context';
import {formatCount} from '@shared/utils/formatCount';
import {Colors} from '@shared/constants';

dayjs.extend(relativeTime);

const SKELETON_DESCRIPTION = [
  {width: '100%' as const, height: 16},
  {width: '70%' as const, height: 16},
];

const SKELETON_STATS = [80, 80, 80, 100, 120];

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
}

function StatItem({icon, label}: StatItemProps) {
  return (
    <View style={styles.statItem}>
      {icon}
      <Text style={styles.statText}>{label}</Text>
    </View>
  );
}

function LoadingSkeleton() {
  return (
   <SafeAreaView edges={['top']} style={styles.root}>
     <View style={styles.skeletonRoot}>
      <View style={styles.contentHeader}>
        <Skeleton width={64} height={64} borderRadius={32} />
        <View style={styles.headerText}>
          <Skeleton width={100} height={14} borderRadius={4} />
          <Skeleton width={180} height={20} borderRadius={4} />
        </View>
      </View>

      {SKELETON_DESCRIPTION.map((item, i) => (
        <Skeleton key={i} width={item.width} height={item.height} borderRadius={4} />
      ))}

      <View style={styles.statsGrid}>
        {SKELETON_STATS.map((width, i) => (
          <Skeleton key={i} width={width} height={32} borderRadius={8} />
        ))}
      </View>
    </View>
   </SafeAreaView>
  );
}

export function RepoDetailScreen() {
  const {params} = useAppRoute<'RepoDetail'>();
  const {repoName} = params;
  const navigation = useAppNavigation();

  const separatorIndex = repoName.indexOf('/');
  const shortName =
    separatorIndex === -1 ? repoName : repoName.slice(separatorIndex + 1);
  const owner =
    separatorIndex === -1 ? undefined : repoName.slice(0, separatorIndex);
  const repo = repoName.slice(separatorIndex + 1);

  const {data, isLoading, isError, refetch} = useRepoDetail(owner, repo);

  const addRepo = useRecentlyViewedStore(state => state.addRepo);

  const handleGoBack = () => navigation.goBack();

  useEffect(() => {
    if (data) {
      addRepo({
        id: data.id,
        fullName: data.full_name,
        ownerAvatarUrl: data.owner.avatar_url,
      });
    }
  }, [data, addRepo]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load repository details.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Header title={shortName} onBack={handleGoBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <View style={styles.contentHeader}>
          <FastImage
            style={styles.avatar}
            source={{
              uri: data.owner.avatar_url,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.headerText}>
            <Text style={styles.ownerLogin}>{data.owner.login}</Text>
            <Text style={styles.repoName}>{data.full_name}</Text>
          </View>
        </View>

        {data.description ? (
          <Text style={styles.description}>{data.description}</Text>
        ) : null}

        <View style={styles.statsGrid}>
          <StatItem
            icon={<Star size={16} color={Colors.accentWarning} />}
            label={formatCount(data.stargazers_count)}
          />
          <StatItem
            icon={<GitFork size={16} color={Colors.textSecondary} />}
            label={formatCount(data.forks_count)}
          />
          <StatItem
            icon={<CircleDot size={16} color={Colors.accentSuccess} />}
            label={formatCount(data.open_issues_count)}
          />
          {data.language ? (
            <StatItem
              icon={<Code size={16} color={Colors.accentPurple} />}
              label={data.language}
            />
          ) : null}
          {data.license?.name ? (
            <StatItem
              icon={<Scale size={16} color={Colors.textSecondary} />}
              label={data.license.name}
            />
          ) : null}
          <StatItem
            icon={<Clock size={16} color={Colors.textTertiary} />}
            label={`Updated ${dayjs(data.updated_at).fromNow()}`}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 20,
    gap: 16,
  },
  skeletonRoot: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    gap: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  ownerLogin: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  repoName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontSize: 15,
    color: Colors.textDescription,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.background,
  },
});
