import {dispatchThemeMode} from '../../redux/slices/themeSlice';

export const updateAppTheme = (dispatch, mode) => {
  dispatch(dispatchThemeMode(mode));
};
