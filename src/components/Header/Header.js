import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import styles from "./HeaderStyles";

const BACK_ICON = require("../../assets/images/back.png");

export default function Header({ title, subtitle, onBackPress,conatiner}) {
    return (
        <View style={[styles.row,conatiner]}>
            <TouchableOpacity onPress={onBackPress} activeOpacity={0.7} hitSlop={20}>
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
