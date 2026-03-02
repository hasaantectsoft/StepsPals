export const devImage =
  'https://724.one/wp-content/uploads/2022/11/cropped-Navy-Modern-Eagle-and-Wings-Logo-2-254x74.png';

export const companyUrl = 'https://724.one';

export const isRequired = fieldName => {
  throw new Error(`${fieldName} is required`);
};

export const markers = [
  {
    title: 'Jinnah Hospital',
    latitude: 31.4843,
    longitude: 74.2969,
  },
  {
    title: 'University of the Punjab',
    latitude: 31.479,
    longitude: 74.2662,
  },
  {
    title: 'Karim Block',
    latitude: 31.5033,
    longitude: 74.2781,
  },
  {
    title: 'Moon Market Iqbal Town',
    latitude: 31.5197,
    longitude: 74.2916,
  },
];

export const baseScreenData = [
  {
    title: 'Login With API',
    name: 'Login',
    private: false,
  },
  {
    title: 'Single & Multiple Image Picker',
    name: 'ImagePicker',
    private: false,
  },
  {
    title: 'Single & Multiple Video Picker',
    name: 'VideoPicker',
    private: false,
  },
  {
    title: 'Theme Manager',
    name: 'ThemeManager',
    private: false,
  },
];
