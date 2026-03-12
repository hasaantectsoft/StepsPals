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
  bgContainer: {
    width: scale(250),
    height: scale(250),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImage: {
    resizeMode: 'stretch',
  },
  petImage: {
    width: scale(80),
    height: scale(120),
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
  fromTo: {
    fontFamily: Theme.typography.Retro.fontFamily,
    fontSize: moderateScale(11),
    color: Theme.colors.brown,
    marginTop: scale(4),
  },
  daysText: {
    fontFamily: Theme.typography.Retro.fontFamily,
    fontSize: moderateScale(12),
    marginHorizontal: scale(10),
    color: Theme.colors.brown,
    marginTop: scale(4),
    textAlign: 'center',
    lineHeight: scale(14),
  },
});
