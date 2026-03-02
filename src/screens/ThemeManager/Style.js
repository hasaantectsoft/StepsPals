import {StyleSheet} from 'react-native';

import {Responsive} from '../../libs';

const {getHeight} = Responsive;

const styles = colors =>
  StyleSheet.create({
    // use color from navigation theme. it will auto change colors based on theme
    container: {
      flex: 1,
      backgroundColor: colors?.background, // you can remove this line as it will be auto applied based on theme. I have added here just to show you how can use these colors
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      marginTop: getHeight(2.5),
      fontWeight: '600',
      color: colors?.text,
    },
  });

export default styles;
