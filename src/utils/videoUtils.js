import ImagePicker from 'react-native-image-crop-picker';

const videoUtils = {
  // Call this method to select single video from gallery
  getSingleVideoFromGallery: async () => {
    let video = {};
    let error = null;
    try {
      const vdo = await ImagePicker.openPicker({
        mediaType: 'video',
      });
      video.creationDate = vdo.creationDate;
      video.cropRect = vdo.cropRect;
      video.data = vdo.data;
      video.exif = vdo.exif;
      video.filename = vdo.filename;
      video.height = vdo.height;
      video.localIdentifier = vdo.localIdentifier;
      video.mime = vdo.mime;
      video.modificationDate = vdo.modificationDate;
      video.path = vdo.path;
      video.size = vdo.size;
      video.sourceURL = vdo.sourceURL;
      video.width = vdo.width;
      return {video, error};
    } catch (err) {
      error = err;
      return {video, error};
    }
  },
  // Call this method to select multiple videos from gallery
  getMultipleVideoFromGallery: async () => {
    let videos = [];
    let error = null;
    try {
      const selectedVideos = await ImagePicker.openPicker({
        mediaType: 'video',
        multiple: true,
      });
      selectedVideos?.forEach((vdo, i) => {
        let video = {};
        video.creationDate = vdo.creationDate;
        video.cropRect = vdo.cropRect;
        video.data = vdo.data;
        video.exif = vdo.exif;
        video.filename = vdo.filename;
        video.height = vdo.height;
        video.localIdentifier = vdo.localIdentifier;
        video.mime = vdo.mime;
        video.modificationDate = vdo.modificationDate;
        video.path = vdo.path;
        video.size = vdo.size;
        video.sourceURL = vdo.sourceURL;
        video.width = vdo.width;
        videos.push(video);
      });
      return {videos, error};
    } catch (err) {
      error = err;
      return {videos, error};
    }
  },
  captureVideoFromCamera: async () => {
    let video = {};
    let error = null;
    try {
      const vdo = await ImagePicker.openCamera({
        mediaType: 'video',
      });
      video.creationDate = vdo.creationDate;
      video.cropRect = vdo.cropRect;
      video.data = vdo.data;
      video.exif = vdo.exif;
      video.filename = vdo.filename;
      video.height = vdo.height;
      video.localIdentifier = vdo.localIdentifier;
      video.mime = vdo.mime;
      video.modificationDate = vdo.modificationDate;
      video.path = vdo.path;
      video.size = vdo.size;
      video.sourceURL = vdo.sourceURL;
      video.width = vdo.width;
      return {video, error};
    } catch (err) {
      error = err;
      return {video, error};
    }
  },
};

export default videoUtils;
