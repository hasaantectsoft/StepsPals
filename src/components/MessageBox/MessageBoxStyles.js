import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {Theme} from '../../libs';

export const Styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    minWidth: scale(160),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
  text: {
    color: Theme.colors.black,
    fontFamily: Theme.typography.Retro?.fontFamily,
    fontSize: scale(12),
    textAlign: 'center',
  },
});

