import React from 'react';
import {Text} from 'react-native';

import styles from './Style';
import {NativeButton, SafeFlexView} from '../../components';
import {
  handleCaptureCameraImage,
  handleSingleGalleryImage,
  handleMultipleGalleryImage,
} from '../../utils/handlers/imagePickerHandler';

export default function ImagePicker() {
  return (
    <SafeFlexView>
      <Text style={styles.heading}>Gallery</Text>
      <NativeButton
        title="Select Single Image From Gallery"
        onPress={() => handleSingleGalleryImage()}
        containerStyle={styles.containerStyle}
      />
      <NativeButton
        title="Select Multiple Images From Gallery"
        onPress={() => handleMultipleGalleryImage()}
        containerStyle={styles.containerStyle}
      />
      <Text style={styles.heading}>Camera</Text>
      <NativeButton
        containerStyle={styles.containerStyle}
        title="Capture Image"
        onPress={() => handleCaptureCameraImage()}
      />
    </SafeFlexView>
  );
}
