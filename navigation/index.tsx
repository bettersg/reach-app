import React from 'react';

import { AuthenticatedUserProvider } from './providers/AuthenticatedUserProvider';
import RootNavigator from './RootNavigator';
import {EventProvider} from './providers/EventProvider';

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
