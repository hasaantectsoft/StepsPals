import { View, Modal, Text, ImageBackground, Image, TouchableOpacity, Pressable } from 'react-native';
import { Styles } from './style';
import { images } from '../../assets/images';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';




export default function ({
    isVisible,
    onClose,
    onRevive,
}) {

      const { petname } = useSelector((state) => state.petReducer);
      const navigation = useNavigation();


    return (
        <Modal visible={isVisible} transparent animationType="fade" statusBarTranslucent>
            <View style={Styles.overlay}>
                <View style={Styles.content}>
                    <ImageBackground source={images.GraveYardDino} style={Styles.bgImage} imageStyle={Styles.petImage}>
<Text style={Styles.petName}>{petname}</Text>
<Text style={Styles.birthDate}>{"13.05.025"}</Text>
<Text style={Styles.deathDate}>{"13.05.025"}</Text>
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
                                <Text style={Styles.btnTxt}>Revive $5</Text>
                            </ImageBackground>
                            <ImageBackground source={images.YellowButton} style={Styles.button} imageStyle={Styles.petImage}>
<Pressable onPress={()=>navigation.reset({index: 0, routes: [{ name: 'Landing' }]})}>
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