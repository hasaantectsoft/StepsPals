/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';

import Home from '../../screens/AuthStack/Home/Home';
import Settings from '../../screens/AuthStack/Settings/Settings';
import GraveYard from '../../screens/AuthStack/GraveYard/GraveYard';
import LeaderBoard from '../../screens/AuthStack/LeaderBoard/LeaderBoard';
import Statistics from '../../screens/AuthStack/Statistics/Statistics';
import { Paw } from '../../assets/svgs';

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();

  const iconForRoute = (name) => {
    switch (name) {
      case 'Home':
      case 'LeaderBoard':
      case 'Statistics':
      case 'GraveYard':
      case 'Settings':
        return Paw;
      default:
        return Paw;
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 60,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel ??
          options.title ??
          route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const IconXml = iconForRoute(route.name);
        const color = isFocused ? colors.primary : colors.text;

        return (
          <PlatformPressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {IconXml ? (
              <SvgXml xml={IconXml} width={24} height={24} />
            ) : (
              <View style={{ width: 24, height: 24 }} />
            )}

            <Text
              style={{
                color,
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

export default function MyTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="LeaderBoard" component={LeaderBoard} />
      <Tab.Screen name="Statistics" component={Statistics} />
      <Tab.Screen name="GraveYard" component={GraveYard} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}