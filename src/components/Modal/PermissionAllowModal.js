import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modal';

import {Theme, Responsive} from '../../libs';
const {AppFonts} = Responsive;

export default function PermissionAllowModal({
  isVisible,
  handleAllow,
  handleClose,
  message,
}) {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationInTiming={1000}
      animationOut="fadeOut"
      animationOutTiming={600}>
      <View style={styles.wrapper}>
        <Text style={styles?.titleText}>{message}</Text>

        <TouchableOpacity onPress={handleAllow} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Open Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClose} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Theme.colors.background,
    padding: '4%',
    borderRadius: 12,
  },
  titleText: {
    color: Theme.colors.text,
    fontSize: AppFonts.t1,
  },
  primaryButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: '3.2%',
    paddingVertical: '1.6%',
    marginTop: '5.5%',
    borderRadius: 48,
  },
  primaryButtonText: {
    color: Theme.colors.primary,
    fontSize: AppFonts.t1,
    fontWeight: '600',
  },
  secondaryButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: '3.2%',
    paddingVertical: '1.6%',
    marginTop: '5.5%',
    borderRadius: 48,
  },
  secondaryButtonText: {
    color: Theme.colors.text,
    fontSize: AppFonts.t1,
  },
});
