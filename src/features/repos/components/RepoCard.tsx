import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ChevronRight, Code, Star} from 'lucide-react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import type {Repo} from '@shared/types/github';
import {useAppNavigation} from '@navigation/types';
import {formatCount} from '@shared/utils/formatCount';
import {Colors} from '@shared/constants';

dayjs.extend(relativeTime);

interface RepoCardProps {
  item: Repo;
}

function RepoCardInner({item}: RepoCardProps) {
  const navigation = useAppNavigation();

  const handlePress = () => {
    navigation.navigate('RepoDetail', {
      repoId: item.id,
      repoName: item.full_name,
    });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <FastImage
        style={styles.avatar}
        source={{uri: item.owner.avatar_url, priority: FastImage.priority.normal}}
        resizeMode={FastImage.resizeMode.cover}
      />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {item.full_name}
        </Text>

        {item.description ? (
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail">
            {item.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Star size={14} color={Colors.accentWarning} />
            <Text style={styles.metaText}>
              {formatCount(item.stargazers_count)}
            </Text>
          </View>

          {item.language ? (
            <View style={styles.metaItem}>
              <Code size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{item.language}</Text>
            </View>
          ) : null}

          <Text style={styles.updatedText}>
            {dayjs(item.updated_at).fromNow()}
          </Text>
        </View>
      </View>

      <ChevronRight size={20} color={Colors.textTertiary} style={styles.chevron} />
    </Pressable>
  );
}

export const RepoCard = React.memo(RepoCardInner);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  updatedText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  chevron: {
    alignSelf: 'center',
  },
});
