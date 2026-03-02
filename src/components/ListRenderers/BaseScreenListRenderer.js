import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Theme, Responsive} from '../../libs';

const {getHeight, getWidth, AppFonts} = Responsive;

export default function BaseScreenListRenderer({item, index, onPress}) {
  return (
    <View>
      <Text onPress={onPress} style={styles.title}>
        {item.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: Theme.colors.white,
    fontSize: AppFonts.t2,
    fontWeight: Theme.typography.heading.fontWeight,
    marginBottom: getHeight(2),
    backgroundColor: Theme.colors.primary,
    paddingVertical: getHeight(1.5),
    marginHorizontal: getWidth(5),
  },
});
