import { Text } from "react-native";
import { Pressable } from "react-native";
import { SvgXml } from "react-native-svg";
import { Paw } from "../../assets/svgs";
import { Styles } from "../../screens/Unauth/LandingScreen/styles";
import ScalePressable from "../ScalePressable/ScalePressable";
import { playButtonSound } from "../../utils/SoundManager/SoundManager";
export function RetryButton({ onPress, color }) {
    return (
        <ScalePressable onPress={() => { playButtonSound(); onPress() }} pressableStyle={Styles.retryButton} containerStyle={Styles.retryButton}>
            <SvgXml xml={Paw} height={50} width={50} />
            <Text style={[Styles.retryText,{color:color}]}>Tap to retry</Text>
        </ScalePressable>
    );
}
