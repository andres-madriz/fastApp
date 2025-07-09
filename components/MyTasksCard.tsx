import Svg, { Circle } from 'react-native-svg';
import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated, Easing } from 'react-native';

// 25% BIGGER
const RADIUS = Math.round(68 * 1.25); // 85
const STROKE = Math.round(12 * 1.25); // 15
const CIRCLE_LENGTH = 2 * Math.PI * RADIUS;

export default function MyTasksCard({ onPress, progress = 0 }: { progress?: number; onPress?: () => void }) {
  const animated = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animated, {
      duration: 900,
      easing: Easing.out(Easing.exp),
      toValue: progress,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const color = animated.interpolate
    ? animated.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['#ef4444', '#eab308', '#16a34a'],
      })
    : '#16a34a';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={onPress ? 0.9 : 1}>
      <View style={styles.svgWrap}>
        <Svg width={2 * (RADIUS + STROKE)} height={2 * (RADIUS + STROKE)}>
          <Circle
            cx={RADIUS + STROKE}
            cy={RADIUS + STROKE}
            r={RADIUS}
            stroke="#e5e7eb"
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={RADIUS + STROKE}
            cy={RADIUS + STROKE}
            r={RADIUS}
            stroke={color}
            strokeWidth={STROKE}
            strokeDasharray={CIRCLE_LENGTH}
            strokeDashoffset={
              animated.interpolate
                ? animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [CIRCLE_LENGTH, 0],
                  })
                : 0
            }
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
        <View style={styles.centerCircle}>
          <Text style={styles.text}>My Tasks</Text>
          <Text style={styles.percentText}>{Math.round((progress || 0) * 100)}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: Math.round(18 * 1.25), // 23
  },
  centerCircle: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 78, // 62 * 1.25 = 78
    elevation: 2,
    height: 155, // 124 * 1.25 = 155
    justifyContent: 'center',
    left: 23, // 18 * 1.25 = 23
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    top: 23, // 18 * 1.25 = 23
    width: 155, // 124 * 1.25 = 155
  },
  percentText: {
    color: '#0a7ea4',
    fontSize: 25, // 20 * 1.25 = 25
    fontWeight: '600',
    marginTop: 7, // 5 * 1.25 = 7
  },
  svgWrap: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 100, // 80 * 1.25 = 100
    elevation: 4,
    height: 200, // 160 * 1.25 = 200
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    width: 200, // 160 * 1.25 = 200
  },
  text: {
    color: '#0a7ea4',
    fontSize: 28, // 22 * 1.25 = 28
    fontWeight: 'bold',
    marginBottom: 3, // 2 * 1.25 = 3
    marginTop: 3, // 2 * 1.25 = 3
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
