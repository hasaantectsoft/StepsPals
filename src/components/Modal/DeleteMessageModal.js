import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modal';

import {Theme, Responsive} from '../../libs';
const {AppFonts} = Responsive;

export default function DeleteMessageModal({
  isVisible,
  handleOnlyMe,
  handleForAll,
  handleCancel,
}) {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationInTiming={1000}
      animationOut="fadeOut"
      animationOutTiming={600}>
      <View style={styles.wrapper}>
        <Text style={styles?.titleText}>Delete message?</Text>
        <TouchableOpacity onPress={handleForAll} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete for everyone</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOnlyMe} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete for me</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Cancel</Text>
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
    color: Theme.colors.accent,
    fontSize: AppFonts.t1,
  },
  deleteButton: {
    // borderWidth: 1,
    alignSelf: 'flex-end',
    paddingHorizontal: '3.2%',
    paddingVertical: '1.6%',
    marginTop: '5.5%',
    borderRadius: 48,
  },
  deleteButtonText: {
    color: Theme.colors.iconColor,
    fontSize: AppFonts.t1,
  },
});
