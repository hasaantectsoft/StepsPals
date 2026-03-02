import {StyleSheet} from 'react-native';

import {Theme, Responsive} from '../../libs';

const {getWidth, getHeight, AppFonts} = Responsive;
const styles = StyleSheet.create({
  heading: {
    color: Theme.colors.text,
    textAlign: 'center',
    marginVertical: getHeight(3),
    fontSize: AppFonts.h5,
  },
  containerStyle: {
    width: getWidth(86),
    alignSelf: 'center',
    paddingVertical: getHeight(2),
    marginBottom: getHeight(1.5),
  },
});

export default styles;
