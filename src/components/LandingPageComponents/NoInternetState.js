import {  View } from "react-native";
import { SvgXml } from "react-native-svg";
import PropTypes from "prop-types";
import { nointernetlogo, Paw } from "../../assets/svgs";
import { RetryButton } from "../../components/RetryButton/RetryButton";
import { Styles } from "./styles";

export const NoInternetState = ({ onRetry }) => {
    return (
        <>
            <View style={Styles.logoContainer}>
                <SvgXml xml={nointernetlogo} height={100} width={300} />
                <View style={Styles.pawOverlay}>
                    {/* <SvgXml xml={Paw} height={50} width={50} /> */}
                </View>
            </View>
            <RetryButton onPress={onRetry} />
        </>
    );
};

NoInternetState.propTypes = {
    onRetry: PropTypes.func.isRequired,
    retryFailed: PropTypes.bool,
};

NoInternetState.defaultProps = {
    retryFailed: false,
};
