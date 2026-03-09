import { Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './SoundPressableStyles';
import { playButtonSound } from '../../utils/SoundManager/SoundManager';

const SoundPressable = ({ onPress, style, children, ...rest }) => {
  const handlePress = (e) => {
    try {
      playButtonSound();
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
