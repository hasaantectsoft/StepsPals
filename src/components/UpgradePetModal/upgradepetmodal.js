import { View, Modal, Text, ImageBackground, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { Paw } from '../../assets/svgs';
import ScalePressable from '../ScalePressable/ScalePressable';
import { Styles } from './styles';
import { scale } from 'react-native-size-matters';
import { images } from '../../assets/images';
import { combineStyles } from '../../libs/combineStyle';

const PET_IMAGE = { '1': images.Dog, '2': images.Cat, '3': images.Dino };

const getStage = (petcreatedat) => {
  if (!petcreatedat) return 'baby';
  const days = Math.floor((Date.now() - petcreatedat) / 86400000);
  if (days <= 7) return 'baby';
  if (days <= 21) return 'teen';
  return 'adult';
};

const UPGRADE_CONFIG = {
  teen: {
    title:       'Great Job!',
    getSubtitle: (name) => `Your pet is growing up!`,
    getBody:     (name) => `You've taken care of ${name} for 7 days`,
  },
  adult: {
    title:       'Congratulations!',
    getSubtitle: (name) => `${name} has fully grown!`,
    getBody:     (name) => `Keep nurturing ${name} to stay on track and maintain your streak!`,
  },
};

export default function UpgradePetModal({ isVisible, okPressed, label }) {
  const { petkey, petcreatedat, petname } = useSelector((s) => s.petReducer);
  const stage    = getStage(petcreatedat);
  const config   = UPGRADE_CONFIG[stage] ?? UPGRADE_CONFIG.teen;
  const petImage = PET_IMAGE[String(petkey)];

  return (
    <Modal visible={isVisible} transparent animationType="fade" statusBarTranslucent>
      <View style={Styles.overlay}>
        <View style={Styles.content}>
          <ImageBackground source={images.modalbg} style={Styles.bgContainer} imageStyle={Styles.bgImage}>
            <Text style={combineStyles.regular14}>{config.title}</Text>
            <Text style={Styles.fromTo}>{config.getSubtitle(petname)}</Text>
            {petImage && <Image source={petImage} style={Styles.petImage} resizeMode="contain" />}
            <Text style={Styles.daysText}>{config.getBody(petname)}</Text>
          </ImageBackground>

          <ScalePressable onPress={okPressed} pressableStyle={Styles.retryPressable} containerStyle={Styles.retryContainer}>
            <SvgXml xml={Paw} width={scale(55)} height={scale(55)} />
            <Text style={Styles.retryText}>{label}</Text>
          </ScalePressable>
        </View>
      </View>
    </Modal>
  );
}
