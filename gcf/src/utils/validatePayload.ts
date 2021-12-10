import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { createError } from '@root/errors';
import { logger } from '@root/logger';

// TODO - openapi generated
const Schemas = {
    definitions: {
        todo: {},
    },
};

export type Schema = keyof typeof Schemas.definitions;

/**
 * Guard check for incoming API input, to ensure typing of payload.
 * Validate against a schema, as specified in openapi.yml, then pass on to the handler.
 * Note that you could mess up by setting T and schema to non-matching values. So don't do that.
 * TODO: It might be possible to infer the desired schema by using T.name or similar.
 */
export function validatePayload<T>(payload: unknown, schema: Schema): T {
    const ajv = new Ajv();

    // This allows us to use some defaults https://github.com/ajv-validator/ajv-formats
    addFormats(ajv);

    const schemaObj = {
        ...Schemas.definitions[schema],
        definitions: Schemas.definitions,
    };

    if (!ajv.validate(schemaObj, payload)) {
        if (ajv.errors) {
            logger.error(ajv.errorsText(ajv.errors));
        }
        throw createError('INVALID_FIELD');
    }

    return payload as T;
}
