import { StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { Theme } from '../../libs';

export const Styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: scale(12),
    paddingHorizontal: scale(20),
  },
  loadingBar: {
    width: scale(220),
    height: scale(45),
    marginTop: scale(4),
  },
  loader: {
    width: scale(60),
    height: scale(40),
    marginTop: scale(6),
  },
  retryPressable: {
    alignItems: 'center',
  },
  retryContainer: {
    alignItems: 'center',
    marginTop: scale(6),
    gap: scale(4),
  },
  retryText: {
    fontFamily: Theme.typography.Retro.fontFamily,
    fontSize: moderateScale(14),
    color: '#ffffff',
  },
});
