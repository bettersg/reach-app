import React from 'react';

import { CheckinProvider } from './providers/CheckinProvider';
import RootStack from './RootStack';

/**
 * Wrap all providers here
 */

export default function Routes() {
    return (
        <CheckinProvider>
            <RootStack />
        </CheckinProvider>
    );
}
