import Ajv, { AnySchema } from 'ajv';
import { isNil, isObject, isString, mapValues } from 'lodash';

function maskField(data: string | number) {
    const stringData = isString(data) ? data : String(data);
    return stringData.replace(/./g, '*');
}

export function maskData(data: any): any {
    if (isObject(data)) {
        return mapValues(data, function (value: any) {
            if (isNil(value)) {
                return value;
            }

            if (isObject(value)) {
                return maskData(value);
            }

            return maskField(value);
        });
    }

    return maskField(data);
}

export const makeValidator = <T = any>(schema: AnySchema) => {
    const ajv = new Ajv();
    const isInvalidSchema = !ajv.validateSchema(schema);
    if (isInvalidSchema) {
        throw new Error('Invalid ajv schema!');
    }
    return ajv.compile<T>(schema);
};
