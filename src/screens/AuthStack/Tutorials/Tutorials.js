
import React, {useState} from 'react';
import {styles} from './Styles';
import {ImageBackground, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setNewUser } from '../../../redux/slices/tutorialslice';

const IMAGES = [
  require('../../../assets/images/Tutorial1.png'),
  require('../../../assets/images/Tutorial2.png'),
  require('../../../assets/images/Tutorial3.png'),
  require('../../../assets/images/Tutorial4.png'),
  require('../../../assets/images/Tutorial5.png'),
  require('../../../assets/images/Tutorial6.png'),
  require('../../../assets/images/Tutorial7.png'),
  require('../../../assets/images/Tutorial8.png'),
  require('../../../assets/images/Tutorial9.png'),
  require('../../../assets/images/Tutorial10.png'),
    require('../../../assets/images/Tutorial11.png'),


];

export default function Tutorials() {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
              const dispatch = useDispatch();

  const handlePress = () => {
    if (index < IMAGES.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      dispatch(setNewUser(false));

      navigation.navigate("Main");
    }
  };

  return (
      <Pressable style={{flex: 1}} activeOpacity={1} onPress={handlePress}>
        <ImageBackground
        
          style={styles.wrapper}
          source={IMAGES[index]}
          imageStyle={{resizeMode: 'stretch', alignSelf: 'center'}}
        />
      </Pressable>
  );
}