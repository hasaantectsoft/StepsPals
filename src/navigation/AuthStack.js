import React from 'react';
import Home from '../screens/AuthStack/Home/Home';
import LeaderBoard from '../screens/AuthStack/LeaderBoard/LeaderBoard';
import Settings from '../screens/AuthStack/Settings/Settings';
import tutorial from '../screens/AuthStack/Tutorials/Tutorials';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GraveYard from '../screens/AuthStack/GraveYard/GraveYard';

function AuthStack() {
  const Stack = createNativeStackNavigator();
  const isnewaccount = true;
  const screens = {
    tutorial: tutorial,
    Home:Home,
    GraveYard: GraveYard,
    LeaderBoard: LeaderBoard,
    Settings: Settings

  };

  return (
    <Stack.Navigator
      initialRouteName={isnewaccount ? 'tutorial' : 'Home'}
      screenOptions={{
        headerShown: false,
        statusBarAnimation: 'fade',
        animation: 'slide_from_bottom',
        orientation: 'default',
        freezeOnBlur: true,
      }}>
      {Object.entries(screens).map(([name, component]) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
}

export default AuthStack;
