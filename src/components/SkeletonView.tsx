import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const SkeletonView = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false, // width animations can't use native driver
      })
    ).start();
  }, [shimmerAnim]);

  const animatedWidth = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.overlayLayer}>
      <Animated.View style={[styles.shimmerLayer, { width: animatedWidth }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E0E0E0', // Light grey (background)
    overflow: 'hidden',
  },
  shimmerLayer: {
    height: '100%',
    backgroundColor: '#C0C0C0', // Slightly darker grey (animated bar)
  },
});

export default SkeletonView;
