
import React, {useState} from 'react';
import {styles} from './Styles';
import {ImageBackground, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setNewUser } from '../../../redux/slices/tutorialslice';
import { images } from '../../../assets/images';

const IMAGES = [
  images.tutorial1,
  images.tutorial2,
  images.tutorial3,
  images.tutorial4,
  images.tutorial5,
  images.tutorial6,
  images.tutorial7,
  images.tutorial8,
  images.tutorial9,
  images.tutorial10,
  images.tutorial11,


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