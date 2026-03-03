import { StatusBar, View } from "react-native"
import { Theme } from "../../../libs"

export default () => {
    console.log('Landing Screen');
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Theme.colors.primary, // use existing key
                justifyContent: 'center',
                alignItems: 'center',
            }}>
        </View>
    );
}