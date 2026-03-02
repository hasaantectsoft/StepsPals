import React from 'react';
import {ScrollView} from 'react-native';

import PropTypes from 'prop-types';
import ActionSheet, {useScrollHandlers} from 'react-native-actions-sheet';

export default function NativeActionSheet({
  actionSheetRef,
  children,
  closable,
  scrollable,
}) {
  const scrollHandlers = useScrollHandlers('scrollview-1', actionSheetRef);

  if (scrollable) {
    return (
      <ActionSheet
        useBottomSafeAreaPadding
        drawUnderStatusBar
        closable={closable}
        ref={actionSheetRef}>
        <ScrollView {...scrollHandlers}>{children}</ScrollView>
      </ActionSheet>
    );
  }

  return (
    <ActionSheet
      useBottomSafeAreaPadding
      drawUnderStatusBar
      closable={closable}
      ref={actionSheetRef}>
      {children}
    </ActionSheet>
  );
}

NativeActionSheet.propTypes = {
  closable: PropTypes.bool,
  scrollable: PropTypes.bool,
};

NativeActionSheet.defaultProps = {
  closable: true,
  scrollable: false,
};
