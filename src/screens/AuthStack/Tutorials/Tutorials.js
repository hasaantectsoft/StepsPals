
import React, {useState, useRef} from 'react';
import {styles} from './Styles';
import {ImageBackground, Pressable, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setNewUser} from '../../../redux/slices/tutorialslice';
import {images} from '../../../assets/images';
import {cracks} from '../../../assets/Cracks';

const IMAGES = [
  images.tutorial1,
  images.tutorial1, // egg hatching screen
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

const EGG_INDEX = 1;

export default function Tutorials() {
  const [index, setIndex] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [crackLevel, setCrackLevel] = useState(0);
  const isAdvancing = useRef(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const animateCrack = () => {
    shakeAnim.setValue(0);
    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.timing(shakeAnim, {toValue: 12, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: -12, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 8, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 0, duration: 50, useNativeDriver: true}),
    ]).start();
    Animated.sequence([
      Animated.timing(scaleAnim, {toValue: 1.06, duration: 100, useNativeDriver: true}),
      Animated.timing(scaleAnim, {toValue: 1, duration: 100, useNativeDriver: true}),
    ]).start();
  };

  const handlePress = () => {
    if (index === EGG_INDEX) {
      if (isAdvancing.current) return;
      const newTap = tapCount + 1;
      setTapCount(newTap);

      if (newTap === 2) {
        setCrackLevel(1);
        animateCrack();
      } else if (newTap === 4) {
        isAdvancing.current = true;
        setCrackLevel(2);
        animateCrack();
        setTimeout(() => {
          setCrackLevel(0);
          setTapCount(0);
          isAdvancing.current = false;
          setIndex(prev => prev + 1);
        }, 600);
      }
      return;
    }

    if (index < IMAGES.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      dispatch(setNewUser(false));
      navigation.navigate('Main');
    }
  };

  const crackSource = crackLevel === 1 ? cracks.c1 : crackLevel === 2 ? cracks.c2 : null;

  return (
    <Pressable style={{flex: 1}} onPress={handlePress}>
      <ImageBackground
        style={styles.wrapper}
        source={IMAGES[index]}
        imageStyle={{resizeMode: 'stretch', alignSelf: 'center'}}>
        {crackSource && (
          <Animated.Image
            source={crackSource}
            style={[
              crackLevel === 1 ? styles.crack1 : styles.crack2,
              {transform: [{translateX: shakeAnim}, {scale: scaleAnim}]},
            ]}
          />
        )}
      </ImageBackground>
    </Pressable>
  );
}