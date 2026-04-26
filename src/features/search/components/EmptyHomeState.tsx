import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Clock, Search} from 'lucide-react-native';
import {Colors} from '@shared/constants';

interface EmptyHomeStateProps {
  onHistoryPress: () => void;
}

export function EmptyHomeState({onHistoryPress}: EmptyHomeStateProps) {
  return (
    <View style={styles.container}>
      <Search size={64} color={Colors.borderMuted} strokeWidth={1.5} />
      <Text style={styles.title}>Discover Repositories</Text>
      <Text style={styles.subtitle}>
        {'Search by name, topic, or technology.\nExplore millions of open-source projects.'}
      </Text>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.historyButton}
        onPress={onHistoryPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Browse recently viewed repositories">
        <Clock size={16} color={Colors.textDark} />
        <Text style={styles.historyButtonText}>Browse Recently Viewed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textHeading,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  divider: {
    width: 48,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.backgroundTertiary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
});
