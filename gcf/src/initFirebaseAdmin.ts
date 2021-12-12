import { logger } from '@root/logger';
import * as admin from 'firebase-admin';

export interface FirebaseResources {
    admin: admin.app.App;
    fs: admin.firestore.Firestore;
    auth: admin.auth.Auth;
    storage: admin.storage.Storage;
    messaging: admin.messaging.Messaging;
}

let resources: FirebaseResources | undefined;

/** Ensures we use only single connection to each Firebase resource */
export function initFirebaseAdmin(): FirebaseResources {
    if (!admin.apps.length || !resources) {
        logger.info('Cold start - Initializing firebase admin.');
        const app = admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });

        resources = {
            admin: app,
            fs: app.firestore(),
            auth: app.auth(),
            storage: app.storage(),
            messaging: app.messaging(),
        } as const;
    }
    return resources;
}
