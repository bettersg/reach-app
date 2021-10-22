import React from 'react';

import { AuthenticatedUserProvider } from './providers/AuthenticatedUserProvider';
import RootStack from './RootStack';
import {EventProvider} from './providers/EventProvider';

/**
 * Wrap all providers here
 */

export default function Routes() {
    return (
        <AuthenticatedUserProvider>
            <EventProvider>
                <RootStack />
            </EventProvider>
        </AuthenticatedUserProvider>
    );
}
