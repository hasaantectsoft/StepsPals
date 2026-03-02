import React from 'react';
import {Text} from 'react-native';

import styles from './Style';
import {NativeButton, SafeFlexView} from '../../components';
import {
  handleCaptureCameraVideo,
  handleSingleGalleryVideo,
  handleMultipleGalleryVideos,
} from '../../utils/handlers/videoPickerHandler';

export default function VideoPicker() {
  return (
    <SafeFlexView>
      <Text style={styles.heading}>Gallery</Text>
      <NativeButton
        title="Select Single Video From Gallery"
        onPress={() => handleSingleGalleryVideo()}
        containerStyle={styles.containerStyle}
      />
      <NativeButton
        title="Select Multiple Videos From Gallery"
        onPress={() => handleMultipleGalleryVideos()}
        containerStyle={styles.containerStyle}
      />
      <Text style={styles.heading}>Camera</Text>
      <NativeButton
        containerStyle={styles.containerStyle}
        title="Record Video"
        onPress={() => handleCaptureCameraVideo()}
      />
    </SafeFlexView>
  );
}
