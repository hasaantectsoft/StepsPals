import { StyleSheet } from 'react-native';
import { Theme, Responsive } from '../../libs';
import { moderateScale } from 'react-native-size-matters';

const { AppFonts } = Responsive;

const styles = StyleSheet.create({
  button: {
    width:"100%",
    height:moderateScale(50),
    // backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borders.miniRadius,
    alignItems: 'center',
    overflow: 'hidden', // important for ImageBackground
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Theme.colors.grayBlack,
    fontSize: AppFonts.t3,
    fontFamily:Theme.typography.Retro.fontFamily
  },
});

export default styles;