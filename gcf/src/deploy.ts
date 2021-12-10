import fs from 'fs';
import * as functions from '@root/index';
import { logger } from '@root/logger';

const stringBuilder = [];
let key: keyof typeof functions;

for (key in functions) {
    stringBuilder.push('functions:' + key);
}

const functionsToDeploy = stringBuilder.join(',');

fs.writeFile(
    'scripts/firebase_deploy.sh',
    `echo deploying all functions in $1\nfirebase deploy --project "$1" --only ${functionsToDeploy}`,
    (err) => {
        if (err) {
            logger.error(err);
        }
    }
);
