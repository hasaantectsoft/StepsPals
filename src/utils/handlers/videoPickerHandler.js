import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {permissionUtils, videoUtils} from '..';
import {isAndroidBelow10} from '../../libs/platform';

const galleryVideoPermission = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: isAndroidBelow10
    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
});

const cameraVideoPermission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
});

export const handleSingleGalleryVideo = async () => {
  try {
    const isPermitted = await permissionUtils.getSinglePermission(
      galleryVideoPermission,
    );
    if (isPermitted) {
      const {error, video} = await videoUtils.getSingleVideoFromGallery();
      if (error) {
        if (error?.code !== 'E_PICKER_CANCELLED') {
          console.error(error.code);
          //handle error
          return null;
        }
      } else {
        return video.path;
      }
    }
    return null;
  } catch (error) {
    // handle error
    console.error(error);
    return null;
  }
};

export const handleMultipleGalleryVideos = async () => {
  try {
    const isPermitted = await permissionUtils.getSinglePermission(
      galleryVideoPermission,
    );
    if (isPermitted) {
      const {error, videos} = await videoUtils.getMultipleVideoFromGallery();
      if (error) {
        if (error?.code !== 'E_PICKER_CANCELLED') {
          console.error(error.code);
          //handle error
        }
      } else {
        console.log('[Test]', videos);
      }
    }
  } catch (error) {
    // handle error
    console.error(error);
  }
};

export const handleCaptureCameraVideo = async () => {
  try {
    const isPermitted = await permissionUtils.getSinglePermission(
      cameraVideoPermission,
    );
    if (isPermitted) {
      const {error, video} = await videoUtils.captureVideoFromCamera();
      if (error) {
        if (error?.code !== 'E_PICKER_CANCELLED') {
          console.error(error.code);
          //handle error
        }
      } else {
        console.log('[Test]', video);
      }
    }
  } catch (error) {
    // handle error
    console.error(error);
  }
};
