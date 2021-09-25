import * as React from 'react';
import { View } from 'react-native';

interface OptionalVisibility {
    isVisible: boolean;
  }

const OptionalVisibility: React.FC<OptionalVisibility> = ({
    isVisible,
    children
}) => {
    this;
    if (isVisible) {
        return <View>{children}</View>;
    } else {
        return <View/>;
    }
};

export default OptionalVisibility;