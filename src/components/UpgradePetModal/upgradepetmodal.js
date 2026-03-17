import { View, Modal, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { Paw } from '../../assets/svgs';
import { Styles } from './styles';
import { moderateScale, scale } from 'react-native-size-matters';
import { images } from '../../assets/images';
import { combineStyles } from '../../libs/combineStyle';
import ScalePressable from '../ScalePressable/ScalePressable';
import { addPetToCollection } from '../../redux/slices/petCollectionSlice';

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
    title: 'Congratulations!',
    getSubtitle: (name) => `Your pet has grown up!`,
  },
  adult: {
    title: 'Congratulations!',
    getSubtitle: (name) => `${name} has fully grown!`,
  },
};

export default function UpgradePetModal({
  isVisible,
  onClose,
  onAddToCollection,
  showtitle = true,
  label,
  show_continue_button = true,
  okPressed,
  cup,
  showPet = true,
  subtitle,
  bottomtext,
  title,
  subtitleStyle,
  btn = true,
  backImg,
  containerStyle,
  subtitleShow = true,
  keepGoing = false,
  imageStyle,
  titleStyle
}) {
  const { petkey, petcreatedat, petname } = useSelector((s) => s.petReducer);
  const dispatch = useDispatch();

  const stage = getStage(petcreatedat);
  const config = UPGRADE_CONFIG[stage] ?? UPGRADE_CONFIG.teen;
  const petImage = PET_IMAGE[String(petkey)];
  const collectionId = `${petcreatedat ?? 'noDate'}-${String(petkey ?? 'noKey')}`;

  const handleAddToCollection = () => {
    if (onAddToCollection) {
      onAddToCollection({
        id: collectionId,
        name: petname,
        petkey,
        createdAt: petcreatedat,
        stage,
      });
      return;
    }
    dispatch(
      addPetToCollection({
        id: collectionId,
        name: petname,
        petkey,
        createdAt: petcreatedat,
        stage,
      }),
    );
    onClose?.();
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" statusBarTranslucent>
      <View style={Styles.overlay}>
        <View style={Styles.content}>
          <ImageBackground
            source={backImg ? backImg : images.modalbg}
            style={[Styles.bgContainer, containerStyle]}
            imageStyle={[Styles.bgImage,imageStyle]}
          >
           {showtitle && <Text style={[combineStyles.regular12,titleStyle, { marginTop: moderateScale(6) }]}>
              {title || config.title}
            </Text>}

            {subtitleShow && (
              <Text style={[Styles.fromTo, subtitleStyle]}>
                {subtitle || config.getSubtitle(petname)}
              </Text>
            )}

            {showPet && petImage && (
              <Image source={petImage} style={Styles.petImage} resizeMode="contain" />
            )}

            {cup && (
              <Image source={cup} style={Styles.cupImg} resizeMode="contain" />
            )}

            {/* <Text style={Styles.daysText}>{config.getBody(petname)}</Text> */}

            {
              btn &&
              <TouchableOpacity
                activeOpacity={0.8}
                style={[Styles.retroDoneWrap]}
                onPress={handleAddToCollection}
              >
                <ImageBackground
                  source={require('../../assets/images/next.png')}
                  resizeMode="contain"
                  style={Styles.doneButton}
                  imageStyle={[Styles.doneButtonImage]}
                >
                  <Text style={Styles.doneButtonText}>
                    {"Add to\ncollection"}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            }


            {
              bottomtext &&

              <Text style={Styles.bottomtext}>{bottomtext}</Text>
            }
            {
              keepGoing &&

              <Text style={Styles.keep}>{"Keep it up!"}</Text>
            }
          </ImageBackground>
{show_continue_button && (
          <ScalePressable
            onPress={okPressed}
            pressableStyle={Styles.retryPressable}
            containerStyle={Styles.retryContainer}
          >
            <SvgXml xml={Paw} width={scale(55)} height={scale(55)} />
            <Text style={Styles.retryText}>{label || "Tap to continue"}</Text>
          </ScalePressable>
        )}
        </View>
      </View>
    </Modal>
  );
}