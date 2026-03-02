import React, {useState} from 'react';

import styles from './Style';
import {AppIcons} from '../../libs';
import {
  NativeButton,
  NativeInput,
  NativeRightIconInput,
} from '../../components';
import {SafeFlexView} from '../../components';
import useLogin from '../../services/mutations/useLogin';
import {validateLoginForm} from '../../utils/handlers/loginHandlers';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorText, setEmailErrorText] = useState(null);
  const [passwordErrorText, setPasswordErrorText] = useState(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const {EyeIcon, EyeOffIcon} = AppIcons;

  const {mutate, isLoading, error, isSuccess, data, reset} = useLogin();

  if (error) {
    //handle error
    console.error(error.message);
    reset();
  }
  if (isSuccess) {
    //handle success
    console.log('[Test]', data);
    reset();
  }

  return (
    // <View style={styles.container}>
    <SafeFlexView>
      <NativeInput
        inputStyle={styles.inputStyle}
        value={email}
        onChangeText={e => setEmail(e)}
        placeholder="example@email.com"
        errorText={emailErrorText}
        onBlur={() => {
          validateLoginForm(
            email,
            password,
            setEmailErrorText,
            setPasswordErrorText,
            emailErrorText,
            passwordErrorText,
          );
        }}
      />
      <NativeRightIconInput
        icon={
          secureTextEntry ? (
            <EyeIcon size={24} onPress={() => setSecureTextEntry(false)} />
          ) : (
            <EyeOffIcon size={24} onPress={() => setSecureTextEntry(true)} />
          )
        }
        inputContainerStyle={styles.inputContainerStyle}
        value={password}
        placeholder="Password"
        onChangeText={p => setPassword(p)}
        errorText={passwordErrorText}
        secureTextEntry={secureTextEntry}
        onBlur={() =>
          validateLoginForm(
            email,
            password,
            setEmailErrorText,
            setPasswordErrorText,
            emailErrorText,
            passwordErrorText,
          )
        }
      />
      <NativeButton
        disabled={isLoading}
        containerStyle={styles.containerStyle}
        title="Login"
        onPress={() => {
          if (
            validateLoginForm(
              email,
              password,
              setEmailErrorText,
              setPasswordErrorText,
              emailErrorText,
              passwordErrorText,
            )
          ) {
            // call login mutation from services/mutations
            mutate({
              email,
              password,
            });
          }
        }}
        titleStyle={styles.titleStyle}
      />
    </SafeFlexView>
    // </View>
  );
}
