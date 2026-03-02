import React from 'react';
import {FlatList, Linking} from 'react-native';

import {SafeFlexView} from '../../components';
import {baseScreenData, companyUrl} from '../../utils/exports';
import {BaseScreenListFooter} from '../../components/ListFooters';
import {BaseScreenListRenderer} from '../../components/ListRenderers';

export default function BaseScreen({navigation}) {
  const renderItem = ({item, index}) => (
    <BaseScreenListRenderer
      item={item}
      index={index}
      onPress={() => navigation?.navigate(item.name)}
    />
  );

  const listFooter = () => (
    <BaseScreenListFooter onPress={() => Linking.openURL(companyUrl)} />
  );

  return (
    <SafeFlexView>
      <FlatList
        data={baseScreenData}
        keyExtractor={item => item.name}
        renderItem={renderItem}
        ListFooterComponent={listFooter}
      />
    </SafeFlexView>
  );
}
