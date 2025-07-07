import Svg, { Circle } from 'react-native-svg';
import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated, Easing } from 'react-native';

const RADIUS = 68;
const STROKE = 12;
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
    margin: 18,
  },
  centerCircle: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 62,
    elevation: 2,
    height: 124,
    justifyContent: 'center',
    left: 18,
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    top: 18,
    width: 124,
  },
  percentText: {
    color: '#0a7ea4',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 5,
  },
  svgWrap: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 80,
    elevation: 4,
    height: 160,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    width: 160,
  },
  text: {
    color: '#0a7ea4',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 2,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
