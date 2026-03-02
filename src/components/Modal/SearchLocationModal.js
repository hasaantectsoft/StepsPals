import React from 'react';
import {View, StyleSheet} from 'react-native';

import Modal from 'react-native-modal';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {MAP_API_KEY} from '@env';

import {Theme} from '../../libs';

export default function SearchLocationModal({
  isVisible,
  callBack,
  handleClose,
}) {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationInTiming={1000}
      animationOut="fadeOut"
      animationOutTiming={600}>
      <View style={styles.wrapper}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails
          onPress={(data, details = null) => {
            callBack(data, details);
            handleClose();
          }}
          query={{
            key: MAP_API_KEY,
            language: 'en',
          }}
          onFail={err => console.error(err)}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: '1%',
    borderRadius: 12,
  },
});
