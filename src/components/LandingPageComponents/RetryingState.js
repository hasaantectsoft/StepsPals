import { Text } from "react-native";
import { Styles } from "../../screens/Unauth/LandingScreen/styles";
import LoaderKitView from "react-native-loader-kit";

export const RetryingState = () => {
    return (
        <>
<LoaderKitView
  style={{ width: 25, height: 25 }}
  name={'BallSpinFadeLoader'}
  animationSpeedMultiplier={1} // speed up/slow down animation, default: 1.0, larger is faster
  color={'#fff'} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
/>
            <Text style={Styles.retryText}>Retrying</Text>
        </>
    );
};
