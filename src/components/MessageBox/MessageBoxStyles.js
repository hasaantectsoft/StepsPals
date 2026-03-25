import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {Theme} from '../../libs';

export const Styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    width: scale(170),
    paddingHorizontal: scale(0),
    paddingLeft: scale(34),
    paddingVertical: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    height: scale(100),
    width: scale(200),
  },
  text: {
    color: Theme.colors.black,
    fontFamily: Theme.typography.Retro?.fontFamily,
    marginTop: scale(10),
    fontSize: scale(8),
    
    textAlign: 'center',
  },
});

