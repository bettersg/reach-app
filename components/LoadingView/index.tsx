import React, { FunctionComponent } from 'react';
import { View, ActivityIndicator, ViewStyle } from 'react-native';

const LoadingView: FunctionComponent<{ wrapperStyle?: ViewStyle }> = ({ wrapperStyle }) => {
  return (
    <View
      testID="loading-view"
      style={[
        {
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        },
        wrapperStyle,
      ]}
    >
      <ActivityIndicator size="large" color={'black'} />
    </View>
  );
};

export default LoadingView;
