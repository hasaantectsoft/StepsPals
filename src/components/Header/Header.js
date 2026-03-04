import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import styles from "./HeaderStyles";

const BACK_ICON = require("../../assets/images/back.png");

export default function Header({ title, subtitle, onBackPress,}) {
    return (
        <View style={styles.row}>
            <TouchableOpacity onPress={onBackPress} activeOpacity={0.7} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Image source={BACK_ICON} style={styles.backBtn} resizeMode="contain" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}{'\n'}{subtitle}</Text>
               
            </View>

        </View>
    );
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    onBackPress: PropTypes.func.isRequired,
    centersub: PropTypes.bool,
    marginTop: PropTypes.number,
};
