import { Text } from "react-native";
import { Pressable } from "react-native";
import { SvgXml } from "react-native-svg";
import { Paw } from "../../assets/svgs";
import { Styles } from "../../screens/Unauth/LandingScreen/styles";
export function RetryButton({ onPress, color }) {
    return (
        <Pressable style={Styles.retryButton} onPress={onPress}>
            <SvgXml xml={Paw} height={50} width={50} />
            <Text style={[Styles.retryText,{color:color}]}>Tap to retry</Text>
        </Pressable>
    );
}
