import React, {useEffect} from 'react';
import type {DimensionValue, ViewStyle} from 'react-native';
import {StyleSheet} from 'react-native';
import {Colors} from '@shared/constants';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const PULSE_MIN = 0.3;
const PULSE_MAX = 1.0;
const PULSE_DURATION = 800;

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({width, height, borderRadius = 0, style}: SkeletonProps) {
  const opacity = useSharedValue(PULSE_MIN);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(PULSE_MAX, {duration: PULSE_DURATION}),
        withTiming(PULSE_MIN, {duration: PULSE_DURATION}),
      ),
      -1,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.base,
        {width: width as DimensionValue, height, borderRadius},
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.skeleton,
  },
});
