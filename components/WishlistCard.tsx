import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

// 25% bigger sizing
export default function WishlistCard({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={onPress ? 0.9 : 1}>
      <View style={styles.svgWrap}>
        <View style={styles.centerCircle}>
          <Text style={styles.text}>Wishlist</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 23, // 18 * 1.25
  },
  centerCircle: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 78, // 62 * 1.25
    elevation: 2,
    height: 155, // 124 * 1.25
    justifyContent: 'center',
    left: 23, // 18 * 1.25
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    top: 23, // 18 * 1.25
    width: 155, // 124 * 1.25
  },
  svgWrap: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 100, // 80 * 1.25
    elevation: 4,
    height: 200, // 160 * 1.25
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    width: 200, // 160 * 1.25
  },
  text: {
    color: '#0a7ea4',
    fontSize: 28, // 22 * 1.25
    fontWeight: 'bold',
    marginBottom: 3, // 2 * 1.25
    marginTop: 3, // 2 * 1.25
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
