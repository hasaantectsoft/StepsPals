import {StyleSheet} from 'react-native';

import {Theme, Responsive} from '../../libs';

const {AppFonts, getWidth, getHeight} = Responsive;

const styles = StyleSheet.create({
  inputContainer: {
    borderColor: 'gray',
    borderWidth: Theme.borders.width,
    borderRadius: Theme.borders.miniRadius,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    color: Theme.colors.text,
    fontSize: AppFonts.t2,
  },
  errorText: {
    color: Theme.colors.error,
    marginLeft: getWidth(5),
    marginTop: getHeight(0.1),
    fontSize: AppFonts.t3,
  },
});

export default styles;
