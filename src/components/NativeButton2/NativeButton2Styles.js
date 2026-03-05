import { StyleSheet } from 'react-native';
import { Theme, Responsive } from '../../libs';
import { moderateScale } from 'react-native-size-matters';

const { AppFonts } = Responsive;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: moderateScale(3),
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(20),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(22),
    fontFamily: Theme.typography.Retro.fontFamily,
    fontWeight: 'bold',
    color: Theme.colors.grayBlack,
    marginBottom: moderateScale(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(16),
    fontFamily: Theme.typography.Retro.fontFamily,
    color: Theme.colors.grayBlack,
    marginBottom: moderateScale(8),
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  description: {
    fontSize: moderateScale(14),
    fontFamily: Theme.typography.Retro.fontFamily,
    color: '#7C5AA0',
    textAlign: 'center',
    marginTop: moderateScale(4),
  },
});

export default styles;
