// components/CustomTabBar.tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Dimensions } from 'react-native';

// Edit these if you want different colors:
const COLORS = {
  background: '#fff',
  inactive: '#B0B5BF',
  primary: '#306BF5',
  shadow: '#c9d8fd',
};

export default function CustomTabBar({ descriptors, navigation, state }: BottomTabBarProps) {
  // Center and float the bar (with pill effect)
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const BAR_WIDTH = Math.min(SCREEN_WIDTH - 32, 370);

  function getIcon(route: string, focused: boolean) {
    switch (route) {
      case 'index':
        return (
          <Ionicons
            name={focused ? 'home' : 'home-outline'}
            size={27}
            color={focused ? COLORS.primary : COLORS.inactive}
          />
        );
      case 'room':
        return (
          <Ionicons
            name={focused ? 'person' : 'person-outline'}
            size={27}
            color={focused ? COLORS.primary : COLORS.inactive}
          />
        );
      case 'groceries':
        return (
          <Ionicons
            name={focused ? 'cart' : 'cart-outline'}
            size={27}
            color={focused ? COLORS.primary : COLORS.inactive}
          />
        );
      case 'settings':
        return (
          <Ionicons
            name={focused ? 'settings' : 'settings-outline'}
            size={27}
            color={focused ? COLORS.primary : COLORS.inactive}
          />
        );
      default:
        return <Ionicons name="ellipse-outline" size={27} color={COLORS.inactive} />;
    }
  }

  function getLabel(route: string) {
    switch (route) {
      case 'room':
        return 'Room';
      case 'index':
        return 'Home';
      case 'groceries':
        return 'List';
      case 'settings':
        return 'Profile';
      default:
        return route;
    }
  }

  return (
    <View
      style={[
        styles.tabbar,
        {
          left: (SCREEN_WIDTH - BAR_WIDTH) / 2,
          width: BAR_WIDTH,
          // For a true "floating" effect:
          bottom: Platform.OS === 'ios' ? 20 : 14,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = getLabel(route.name);
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            canPreventDefault: true,
            target: route.key,
            type: 'tabPress',
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            target: route.key,
            type: 'tabLongPress',
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrap}>{getIcon(route.name, isFocused)}</View>
            {isFocused && <Text style={styles.tabbarLabel}>{label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    backgroundColor: 'transparent',
    borderRadius: 22,
    padding: 6,
  },
  iconWrapFocused: {
    backgroundColor: '#F2F6FF', // a subtle blue background for selected
    borderRadius: 22,
    padding: 6,
  },
  tabbar: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 34,
    elevation: 9,
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-around',
    paddingHorizontal: 0,
    position: 'absolute',
    shadowColor: COLORS.shadow,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    zIndex: 99,
  },
  tabbarItem: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minWidth: 60,
  },
  tabbarLabel: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    marginTop: 2,
    maxWidth: 66,
    minWidth: 50,
    textAlign: 'center',
  },
});
