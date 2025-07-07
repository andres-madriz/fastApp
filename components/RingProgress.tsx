import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

type Props = {
  size?: number;
  strokeWidth?: number;
  progress: number; // value from 0 to 1
};

export default function RingProgress({ progress, size = 94, strokeWidth = 10 }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.max(0, Math.min(progress, 1));
  // Green (#16a34a) at 100%, yellow (#eab308) at 50%, red (#ef4444) at 0%
  const getColor = (p: number) => (p > 0.7 ? '#16a34a' : p > 0.3 ? '#eab308' : '#ef4444');

  return (
    <View style={styles.center}>
      <Svg width={size} height={size}>
        <Circle stroke="#e5e7eb" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <Circle
          stroke={getColor(percent)}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - percent)}
          rotation="-90"
          origin={`${size / 2},${size / 2}`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
