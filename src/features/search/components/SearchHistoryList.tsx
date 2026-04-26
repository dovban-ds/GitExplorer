import React, {useCallback} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Clock} from 'lucide-react-native';

import {Colors} from '@shared/constants';
import {useSearchHistory} from '../hooks/useSearchHistory';

const ICON_SIZE = 16;
const ICON_COLOR = Colors.textPlaceholder;

interface SearchHistoryListProps {
  onSearch: (query: string) => void;
  visible: boolean;
}

interface HistoryItemProps {
  query: string;
  onPress: (query: string) => void;
}

function HistoryItem({query, onPress}: HistoryItemProps) {
  const handlePress = useCallback(() => onPress(query), [onPress, query]);

  return (
    <Pressable style={styles.item} onPress={handlePress}>
      <Clock size={ICON_SIZE} color={ICON_COLOR} />
      <Text style={styles.itemText} numberOfLines={1}>
        {query}
      </Text>
    </Pressable>
  );
}

export function SearchHistoryList({onSearch, visible}: SearchHistoryListProps) {
  const {history} = useSearchHistory();

  const renderItem = useCallback(
    ({item}: {item: string}) => <HistoryItem query={item} onPress={onSearch} />,
    [onSearch],
  );

  const keyExtractor = useCallback((item: string) => item, []);

  if (!visible || history.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginTop: 8,
    paddingVertical: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textOnDark,
  },
});
