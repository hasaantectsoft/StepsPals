import React from 'react';
import    LandingScreen from '../screens/Unauth/LandingScreen/LandingScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PetSelection from '../screens/Unauth/PetSelection/PetSelection';
import SelectGoalScreen from '../screens/Unauth/SelectGoalScreen/SelectGoalScreen';
import GivePermissions from '../screens/Unauth/Permissions/GivePermissions';
import NameYourPer from '../screens/Unauth/NameYourPer/NameYourPer';
import Settings from '../screens/AuthStack/Settings/Settings';
import SubscriptionScreen from '../screens/AuthStack/SubscriptionScreen/SubscriptionScreen';
function UnAuthStack() {
  const Stack = createNativeStackNavigator();

  const screens = {
    Landing: LandingScreen,
    SelectGoalScreen:SelectGoalScreen,
    PetSelection: PetSelection,
    NameYourPer: NameYourPer,
    GivePermissions: GivePermissions,
    Settings: Settings,
    SubscriptionScreen: SubscriptionScreen,
  };

  return (
    <Stack.Navigator
      initialRouteName="SubscriptionScreen"
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

export default UnAuthStack;
