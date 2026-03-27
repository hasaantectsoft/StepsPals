
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabs from "../../components/BottomTabs/BottomTabs";
import Home from '../../screens/AuthStack/Home/Home';
import Settings from '../../screens/AuthStack/Settings/Settings';
import GraveYard from '../../screens/AuthStack/GraveYard/GraveYard';
import LeaderBoard from '../../screens/AuthStack/LeaderBoard/LeaderBoard';
import Statistics from '../../screens/AuthStack/Statistics/Statistics';
import CollectionScreen from '../../screens/AuthStack/CollectionScreen/CollectionScreen';
// import { Paw } from '../../assets/svgs';
const Tab = createBottomTabNavigator();

const tabScreens = {
  Home: Home,
  Settings: Settings,
  GraveYard: GraveYard,
  LeaderBoard: LeaderBoard,
  Statistics: Statistics,
  Collecition:CollectionScreen
};

const BottomStack = () => (
  <Tab.Navigator
    initialRouteName="Home"
    // eslint-disable-next-line react/no-unstable-nested-components
    tabBar={props => {
      const currentRoute = props.state.routes[props.state.index];
      const routeName = currentRoute.state ?
        currentRoute.state.routes[currentRoute.state.index]?.name :
        props.state.routes[props.state.index]?.name;
      return (
        < BottomTabs
          activeTab={routeName}
          onTabPress={name => {
            props.navigation.navigate(name);
          }}
        />
      );
    }}
    screenOptions={{
      headerShown: false,
    }}
  >
    {Object.entries(tabScreens).map(([name, component]) => (
      <Tab.Screen
        key={name}
        name={name}
        component={component}
      />
    ))}
  </Tab.Navigator>
);

export default BottomStack;