import { useState } from 'react';
import { View, Modal, Text, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { LoaderKitView } from 'react-native-loader-kit';
import { nointernet, Paw, logo } from '../../assets/svgs';
import ScalePressable from '../ScalePressable/ScalePressable';
import { Styles } from './InternetModalStyles';
import { images } from '../../assets/images';
import { scale } from 'react-native-size-matters';

export default function InternetModal({ isVisible, onRetry }) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    const connected = await onRetry?.();
    if (!connected) setIsRetrying(false);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent>
      <View style={Styles.overlay}>
        <View style={Styles.content}>
          <SvgXml xml={nointernet} width={scale(280)} height={scale(100)} />
          <Image
            source={images.loadingzero}
            style={Styles.loadingBar}
            resizeMode="contain"
          />
          {isRetrying ? (
            <LoaderKitView
              name="BallBeat"
              style={Styles.loader}
              color="#ffffff"
            />
          ) : (
            <ScalePressable
              onPress={handleRetry}
              pressableStyle={Styles.retryPressable}
              containerStyle={Styles.retryContainer}>
              <SvgXml xml={Paw} width={scale(55)} height={scale(55)} />
              <Text style={Styles.retryText}>Tap to retry</Text>
            </ScalePressable>
          )}
        </View>
      </View>
    </Modal>
  );
}
