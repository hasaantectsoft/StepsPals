import React from 'react';
import tutorial from '../screens/AuthStack/Tutorials/Tutorials';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingScreen from '../screens/Unauth/LandingScreen/LandingScreen';
import { useSelector } from 'react-redux';
import BottomTab from './BottomStack/BottomTabs';
import PetMenu from '../screens/AuthStack/PetMenu/PetMenu';
import SubscriptionScreen from '../screens/AuthStack/SubscriptionScreen/SubscriptionScreen';
import NewTutorail from '../screens/AuthStack/NewTutorail/index';
function AuthStack() {
  const Stack = createNativeStackNavigator();
  const screens = {
    tutorial: tutorial, 
    LandingScreen: LandingScreen,
    Main: BottomTab,
    PetMenu: PetMenu,
    SubscriptionScreen:SubscriptionScreen,
    
  };
const imnewaccount = useSelector(state => state.tutorialReducer?.isnewuser);
const startoverpet = useSelector((state) => state.startoverpetslice?.startoverpet);
console.log('startoverpet',startoverpet)
console.log('imnewaccount',imnewaccount)
  return (
    <Stack.Navigator
        initialRouteName={startoverpet && !imnewaccount ? 'Main' : imnewaccount ? 'tutorial' : 'LandingScreen'}
      screenOptions={{
        headerShown: false,
        statusBarAnimation: 'fade',
        animation: 'slide_from_right',
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
