// NativeInput.js
import React from 'react';
import {TextInput, Text, View} from 'react-native';

import PropTypes from 'prop-types';

import {Theme} from '../../libs';
import styles from './NativeRightIconInputStyle';

const NativeRightIconInput = ({
  onChangeText,
  placeholder,
  inputStyle,
  placeholderTextColor,
  value,
  keyboardType,
  autoFocus,
  ref,
  blurOnSubmit,
  dataDetectorTypes,
  editable,
  enterKeyHint,
  focusable,
  keyboardAppearance,
  maxLength,
  multiline,
  onBlur,
  onEndEditing,
  onFocus,
  onSubmitEditing,
  returnKeyType,
  secureTextEntry,
  textAlignVertical,
  errorText,
  inputContainerStyle,
  icon,
}) => {
  return (
    <>
      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          {borderColor: errorText && Theme.colors.error},
        ]}>
        <TextInput
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.input, inputStyle, {width: icon ? '86%' : '100%'}]}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          ref={ref}
          blurOnSubmit={blurOnSubmit}
          dataDetectorTypes={dataDetectorTypes}
          editable={editable}
          enterKeyHint={enterKeyHint}
          focusable={focusable}
          keyboardAppearance={keyboardAppearance}
          maxLength={maxLength || 5000}
          multiline={multiline}
          onBlur={onBlur}
          onEndEditing={onEndEditing}
          onFocus={onFocus}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          textAlignVertical={textAlignVertical}
        />
        {icon}
      </View>
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </>
  );
};

NativeRightIconInput.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  inputStyle: PropTypes.object,
  placeholderTextColor: PropTypes.string,
  value: PropTypes.string,
  keyboardType: PropTypes.string,
  autoFocus: PropTypes.bool,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  blurOnSubmit: PropTypes.bool,
  dataDetectorTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  editable: PropTypes.bool,
  enterKeyHint: PropTypes.string,
  focusable: PropTypes.bool,
  keyboardAppearance: PropTypes.string,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  onBlur: PropTypes.func,
  onEndEditing: PropTypes.func,
  onFocus: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  returnKeyType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  errorText: PropTypes.string,
};

// Define default values
NativeRightIconInput.defaultProps = {
  placeholder: '',
  inputStyle: {},
  placeholderTextColor: 'gray',
  value: '',
  keyboardType: 'default',
  autoFocus: false,
  ref: null,
  blurOnSubmit: true,
  dataDetectorTypes: 'none',
  editable: true,
  enterKeyHint: 'done',
  focusable: true,
  keyboardAppearance: 'default',
  maxLength: 5000,
  multiline: false,
  onBlur: () => {},
  onEndEditing: () => {},
  onFocus: () => {},
  onSubmitEditing: () => {},
  returnKeyType: 'done',
  secureTextEntry: false,
  textAlignVertical: 'auto',
  errorText: null,
};

export default NativeRightIconInput;
