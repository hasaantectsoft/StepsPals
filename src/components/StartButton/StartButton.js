import { Pressable, Text } from 'react-native';

import PropTypes from 'prop-types';
import { Styles } from './StartButtonStyles';

export const StartButton = ({ onPress, label }) => {
    return (
        <Pressable style={Styles.button} onPress={onPress}>
            <Text style={Styles.text}>{label}</Text>
        </Pressable>
    );
};

StartButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    label: PropTypes.string,
};

StartButton.defaultProps = {
    label: 'Get Started',
};
