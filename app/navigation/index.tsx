import React from 'react';
import { AuthenticatedUserProvider } from './providers/AuthenticatedUserProvider';
import { CheckinProvider } from './providers/CheckinProvider';
import RootStack from './RootStack';

/**
 * Wrap all providers here
 */

export default function Routes() {
    return (
        <AuthenticatedUserProvider>
            <CheckinProvider>
                <RootStack />
            </CheckinProvider>
        </AuthenticatedUserProvider>
    );
}
