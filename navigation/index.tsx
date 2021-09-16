import React from 'react';

import { AuthenticatedUserProvider } from './AuthenticatedUserProvider';
import RootNavigator from './RootNavigator';
import {EventProvider} from './EventProvider';

/**
 * Wrap all providers here
 */

export default function Routes() {
    return (
        <AuthenticatedUserProvider>
            <EventProvider>
                <RootNavigator />
            </EventProvider>
        </AuthenticatedUserProvider>
    );
}
