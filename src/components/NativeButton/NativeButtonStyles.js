import {StyleSheet} from 'react-native';

import {Theme, Responsive} from '../../libs';

const {AppFonts} = Responsive;
const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borders.miniRadius,
    alignItems: 'center',
  },
  buttonText: {
    color: Theme.colors.white,
    fontSize: AppFonts.h5,
  },
});

export default styles;
