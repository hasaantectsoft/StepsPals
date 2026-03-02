import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {permissionUtils, imageUtils} from '../../utils';
import {isAndroidBelow10} from '../../libs/platform';

const galleryPermission = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: isAndroidBelow10
    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
});

const cameraPermission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
});

export const handleSingleGalleryImage = async () => {
  try {
    const isPermitted = await permissionUtils.getSinglePermission(
      galleryPermission,
    );
    if (isPermitted) {
      const {error, image} = await imageUtils.getSingleImageFromGallery(
        250,
        250,
      );
      if (error) {
        if (error?.code !== 'E_PICKER_CANCELLED') {
          console.error(error.code);
          //handle error
        }
        return null;
      } else {
        return image.path;
      }
    } else {
      return null;
    }
  } catch (error) {
    // handle error
    console.error(error);
    return null;
  }
};

export const handleMultipleGalleryImage = async () => {
  try {
    const isPermitted = await permissionUtils.getSinglePermission(
      galleryPermission,
    );
    if (isPermitted) {
      const {error, images} = await imageUtils.getMultipleImageFromGallery(
        250,
        250,
      );
      if (error) {
        if (error?.code !== 'E_PICKER_CANCELLED') {
          console.error(error.code);
          //handle error
        }
      } else {
        console.log('[Test]', images);
      }
    }
  } catch (error) {
    // handle error
    console.error(error);
  }
};

export const handleCaptureCameraImage = async () => {
  try {
    const isPermitted = await permissionUtils.getSinglePermission(
      cameraPermission,
    );
    if (isPermitted) {
      const {error, image} = await imageUtils.captureImageFromCamera(250, 250);
      if (error) {
        if (error?.code !== 'E_PICKER_CANCELLED') {
          console.error(error.code);
          //handle error
        }
      } else {
        console.log('[Test]', image);
      }
    }
  } catch (error) {
    // handle error
    console.error(error);
  }
};
