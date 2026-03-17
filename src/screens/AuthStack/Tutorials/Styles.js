import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  crack1: {
    position: 'absolute',
    width: width * 0.04,
    height: height * 0.06,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: height * 0.61,
  },
  crack2: {
    position: 'absolute',
    width: width * 0.09,
    height: height * 0.09,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: height * 0.59,
  },
  image:{
    width: '100%',
    height: '100%',
  },
  imageContainer:{
    flex:1,
    backgroundColor:"rgba(0, 0, 0, 0.5)"
  }
});