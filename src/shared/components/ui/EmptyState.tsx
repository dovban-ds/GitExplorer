import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SearchX} from 'lucide-react-native';
import {Colors} from '@shared/constants';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({title, subtitle}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <SearchX size={48} color={Colors.textTertiary} strokeWidth={1.5} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
