/* eslint-disable react-native/no-inline-styles */
import { View, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Text } from 'react-native';
import { Paw } from '../../assets/svgs';

const tabs = [
  'Home',
  'LeaderBoard',
  'Statistics',
  'GraveYard',
  'Settings'
];

const BottomTabs = ({ activeTab, onTabPress }) => {
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
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabPress(tab)}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SvgXml xml={Paw} width={24} height={24} />

            <Text
              style={{
                fontSize: 12,
                marginTop: 4,
                color: isActive ? '#000' : '#999',
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabs;