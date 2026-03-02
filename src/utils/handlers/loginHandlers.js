import {Messages} from '../../libs';
import {validationUtils} from '../../utils';

export const validateLoginForm = (
  email,
  password,
  setEmailErrorText,
  setPasswordErrorText,
  emailErrorText,
  passwordErrorText,
) => {
  if (!validationUtils.isValidEmail(email)) {
    setEmailErrorText(Messages?.validation?.invalidEmail);
    return false;
  }
  if (emailErrorText) {
    setEmailErrorText(null);
  }
  if (!validationUtils.isPasswordValid(password)) {
    setPasswordErrorText(Messages?.validation?.invalidPassword);
    return false;
  }
  if (passwordErrorText) {
    setPasswordErrorText(null);
  }
  return true;
};
