import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

import NativeImage from '../NativeImage/NativeImage';
import {Theme, Responsive} from '../../libs';

const {getHeight, AppFonts} = Responsive;

export default function BaseScreenListFooter({onPress}) {
  return (
    <View>
      <Text onPress={onPress} style={styles.footerLink}>
        Powered by: 724.One
      </Text>
      <NativeImage
        onPress={onPress}
        containerStyle={styles.containerStyle}
        disabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footerLink: {
    textAlign: 'center',
    color: Theme.colors.grey,
    fontSize: AppFonts.t2,
    fontWeight: '400',
    marginTop: getHeight(7),
    textDecorationLine: 'underline',
  },
  containerStyle: {
    alignSelf: 'center',
    marginTop: getHeight(1.2),
    borderRadius: 100,
  },
});
