import { Pressable } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import PropTypes from 'prop-types';
import { styles } from './SoundPressableStyles';

const BUTTON_SOUND = require('../../assets/Audio/SFX/Button Click.wav');

const SoundPressable = ({ onPress, style, children, ...rest }) => {
  const handlePress = (e) => {
    try {
      SoundPlayer.playAsset(BUTTON_SOUND);
    } catch (err) {
      console.warn('Button sound failed', err);
    }
    onPress?.(e);
  };

  return (
    <Pressable style={[styles.pressable, style]} onPress={handlePress} {...rest}>
      {children}
    </Pressable>
  );
};

SoundPressable.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
};

export default SoundPressable;
