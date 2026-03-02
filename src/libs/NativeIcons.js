import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from './Theme.json';

const createIcon =
  (iconComponent, iconName) =>
  ({onPress, size, color, disabled}) =>
    (
      <TouchableOpacity
        disabled={disabled || false}
        style={styles(size || 18).wrapper}
        onPress={onPress}>
        {React.createElement(iconComponent, {
          name: iconName,
          color: color || Theme.colors.iconColor,
          size: size || 18,
        })}
      </TouchableOpacity>
    );

const AppIcons = {
  FrownoIcon: createIcon(AntDesign, 'frowno'),
  SearchIcon: createIcon(EvilIcons, 'search'),
  MenuIcon: createIcon(MaterialCommunityIcons, 'menu'),
  EmailIcon: createIcon(MaterialCommunityIcons, 'email-outline'),
  BackIcon: createIcon(EvilIcons, 'chevron-left'),
  CardsHeartIcon: createIcon(MaterialCommunityIcons, 'cards-heart'),
  HeartIcon: createIcon(MaterialCommunityIcons, 'heart-multiple-outline'),
  HomeIcon: createIcon(MaterialCommunityIcons, 'home-outline'),
  ShoppingIcon: createIcon(MaterialCommunityIcons, 'shopping-outline'),
  LoginIcon: createIcon(MaterialCommunityIcons, 'login'),
  ErrorIcon: createIcon(MaterialIcons, 'error-outline'),
  CloseIcon: createIcon(MaterialIcons, 'close'),
  DeleteIcon: createIcon(MaterialIcons, 'delete'),
  EyeIcon: createIcon(MaterialCommunityIcons, 'eye-outline'),
  EyeOffIcon: createIcon(MaterialCommunityIcons, 'eye-off-outline'),
  ImageUpload: createIcon(MaterialCommunityIcons, 'image'),
  Attachment: createIcon(Entypo, 'attachment'),
  Bicycle: createIcon(MaterialCommunityIcons, 'bicycle'),
  Walk: createIcon(MaterialCommunityIcons, 'walk'),
  Car: createIcon(MaterialCommunityIcons, 'car'),
  Transit: createIcon(MaterialIcons, 'directions-transit'),
};

export default AppIcons;

const styles = width =>
  StyleSheet.create({
    wrapper: {
      width: width + 4,
      padding: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
