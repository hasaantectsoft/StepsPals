import React from 'react';
import { View, Platform } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';

import Home from '../../screens/AuthStack/Home/Home';
import Settings from '../../screens/AuthStack/Settings/Settings';
import GraveYard from '../../screens/AuthStack/GraveYard/GraveYard';
import LeaderBoard from '../../screens/AuthStack/LeaderBoard/LeaderBoard';
import Statistics from '../../screens/AuthStack/Statistics/Statistics';
import { Paw, thumb, nointernetlogo } from '../../assets/svgs';

function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const iconForRoute = (name) => {
    switch (name) {
      case 'Home':
        return Paw;
      case 'LeaderBoard':
        return thumb;
      case 'Statistics':
        return thumb;
      case 'GraveYard':
        return nointernetlogo;
      case 'Settings':
        return thumb;
      default:
        return Paw;
    }
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const IconXml = iconForRoute(route.name);

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', padding: 8 }}
          >
            <SvgXml xml={IconXml} width={24} height={24} />
            <Text style={{ color: isFocused ? colors.primary : colors.text, fontSize: 12 }}>{label}</Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="LeaderBoard" component={LeaderBoard} />
      <Tab.Screen name="Statistics" component={Statistics} />
      <Tab.Screen name="GraveYard" component={GraveYard} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}