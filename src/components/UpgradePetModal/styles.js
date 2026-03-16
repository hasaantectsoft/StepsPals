import { StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { Theme } from '../../libs';
import { combineStyles } from '../../libs/combineStyle';

export const Styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: moderateScale(6),
    paddingHorizontal: scale(20),
  },
  bgContainer: {
    width: scale(250),
    height: scale(240),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImage: {
    resizeMode: 'stretch',
    paddingVertical: moderateScale(10)
  },
  petImage: {
    width: scale(80),
    height: scale(100),
  },
  cupImg: {
    width: scale(120),
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
    fontSize: moderateScale(9),
    color: Theme.colors.brown,
    // marginTop: scale(4),
    width: moderateScale(180),
    textAlign: 'center',
    lineHeight: scale(16),
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
  buttonPress: {
    marginTop: scale(0),
    width: scale(100),
    height: scale(20),
  },
  doneButton: {
    width: scale(120),
    height: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  doneButtonText: {
    fontFamily: Theme.typography.Retro.fontFamily,
    fontSize: scale(8),
    lineHeight: moderateScale(15),
    color: "2F3450",

    textAlign: "center",
  },
  doneButtonImage: {
    width: scale(120),
    height: scale(60),
    // borderRadius: scale(12),
  },
  bottomtext: {
    ...combineStyles.regular10,
    textAlign: 'center',
    lineHeight: scale(16),
    color:"0F0E38"
  },
  keep:{
    ...combineStyles.regular10,
    textAlign: 'center',
    lineHeight: scale(16),
    color:"#79430C"
  }
});

