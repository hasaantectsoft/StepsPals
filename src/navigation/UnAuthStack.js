import React from 'react';
import    LandingScreen from '../screens/Unauth/LandingScreen/LandingScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PetSelection from '../screens/Unauth/PetSelection/PetSelection';
import SelectGoalScreen from '../screens/Unauth/SelectGoalScreen/SelectGoalScreen';
function UnAuthStack() {
  const Stack = createNativeStackNavigator();

  const screens = {
    Landing: LandingScreen,
    SelectGoalScreen:SelectGoalScreen,
    PetSelection: PetSelection
  };

  return (
    <Stack.Navigator
      initialRouteName="Landing"
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
