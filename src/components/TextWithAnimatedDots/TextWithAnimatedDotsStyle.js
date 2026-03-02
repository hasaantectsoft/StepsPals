import {StyleSheet} from 'react-native';

import {Theme} from '../../libs';

const styles = StyleSheet.create({
  animatedLine: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Theme.colors.text,
  },
});

export default styles;
