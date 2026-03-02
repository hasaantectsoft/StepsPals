import {StyleSheet} from 'react-native';

import {Theme, Responsive} from '../../libs';

const {getWidth, getHeight} = Responsive;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerStyle: {
    width: getWidth(90),
    height: getHeight(6),
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: Theme.borders.miniRadius,
    marginTop: getHeight(2),
  },
  titleStyle: {
    fontWeight: '700',
  },
  inputContainerStyle: {
    width: getWidth(90),
    height: getHeight(6),
    alignSelf: 'center',
    marginTop: getHeight(2),
    paddingHorizontal: getWidth(3),
  },
  inputStyle: {
    width: getWidth(90),
    height: getHeight(6),
    alignSelf: 'center',
    marginTop: getHeight(2),
    paddingHorizontal: getWidth(3),
  },
});

export default styles;
