import { View, Modal, Text, ImageBackground, Pressable } from 'react-native';
import { Styles } from './style';
import { images } from '../../assets/images';
import { useSelector, useDispatch } from 'react-redux';
import { addToGraveyard } from '../../redux/slices/graveyardSlice';
import { setSignedIn } from '../../redux/slices/authSlice';
import { setNewUser } from '../../redux/slices/tutorialslice';
import { setStartoverPet } from '../../redux/slices/startoverpetslice';
import { clearPet } from '../../redux/slices/petslice';
import { clearProgress } from '../../redux/slices/progressSlice';
import { fadeoutsound, sadpoptwosound } from '../../utils/SoundManager/SoundManager';
import { useEffect } from 'react';

export default function ({ isVisible,  onRevive }) {
  const { petname, petkey, petcreatedat } = useSelector((state) => state.petReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isVisible) {
      sadpoptwosound();
    }
  }, [isVisible]);
  const fmt = (ts) => {
    if (!ts) return '--.--.--';
    const d = new Date(ts);
    return [d.getDate(), d.getMonth() + 1, String(d.getFullYear()).slice(-2)]
      .map((n) => String(n).padStart(2, '0'))
      .join('.');
  };

  const handleStartOver = () => {
    fadeoutsound();
    dispatch(setStartoverPet(true));
    dispatch(addToGraveyard({ name: petname, key: petkey, petcreatedat }));
    dispatch(clearPet());
    dispatch(clearProgress());
    dispatch(setSignedIn(false));
    dispatch(setNewUser(false));
  };


    return (
        <Modal visible={isVisible} transparent animationType="fade" statusBarTranslucent>
            <View style={Styles.overlay}>
                <View style={Styles.content}>
                    <ImageBackground source={images.GraveYardDino} style={Styles.bgImage} imageStyle={Styles.petImage}>
<Text style={Styles.petName}>{petname}</Text>
<Text style={Styles.birthDate}>{fmt(petcreatedat)}</Text>
<Text style={Styles.deathDate}>{fmt(Date.now())}</Text>
                    </ImageBackground>
                    <View style={Styles.modalContainer}>
                        <Text style={Styles.title}>Oh,No!</Text>

                        <Text style={Styles.description}>
                          Your Pet died from lack of care. You can revive{' '}
                          <Text style={Styles.petNameYellow}>{petname}</Text>
                          {' '}to save your best streak progress. Or start from scratch with a new Pet, and{' '}
                          <Text style={Styles.petNameYellow}>{petname}</Text>
                          {' '}ends up in the Graveyard.
                        </Text>

                        <View style={Styles.buttonContainer}>
                            <ImageBackground source={images.next} style={Styles.button} imageStyle={Styles.petImage}>
                                <Pressable onPress={onRevive}>
                                <Text style={Styles.btnTxt}>Revive $5</Text>
                                </Pressable>
                            </ImageBackground>
                            <ImageBackground source={images.YellowButton} style={Styles.button} imageStyle={Styles.petImage}>
<Pressable onPress={handleStartOver}>
                                <Text style={Styles.btnTxt}>Start Over</Text>
                            </Pressable>
                            </ImageBackground>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    );
}