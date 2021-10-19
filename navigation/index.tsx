import React from 'react';

import { AuthenticatedUserProvider } from './providers/AuthenticatedUserProvider';
import RootNavigator from './RootNavigator';
import {CheckinProvider} from './providers/CheckinProvider';

/**
 * Wrap all providers here
 */

export default function Routes() {
    return (
        <AuthenticatedUserProvider>
            <CheckinProvider>
                <RootNavigator />
            </CheckinProvider>
        </AuthenticatedUserProvider>
    );
}
