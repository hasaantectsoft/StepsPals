import { ActivityIndicator, Text } from "react-native";
import { Theme } from "../../libs";
import { Styles } from "../../screens/Unauth/LandingScreen/styles";
import LoaderKitView from "react-native-loader-kit";

export const RetryingState = () => {
    return (
        <>
<LoaderKitView
  style={{ width: 50, height: 50 }}
  name={'BallSpinFadeLoader'}
  animationSpeedMultiplier={0.1} // speed up/slow down animation, default: 1.0, larger is faster
  color={'#B8BAC6'} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
/>
            <Text style={Styles.retryText}>Retrying</Text>
        </>
    );
};
