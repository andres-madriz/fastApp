import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

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
