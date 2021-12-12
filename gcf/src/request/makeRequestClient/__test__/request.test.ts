import { expect } from 'chai';
import nock from 'nock';
import { createSandbox, stub } from 'sinon';
import { describeUnitTestsFor } from '@root/testUtils/describe';
import { logger } from '@root/logger';
import { isEqual } from 'lodash';
import { RequestContext } from '../request.types';
import {
    ApiRequestNoResponseError,
    ApiRequestResponseError,
    ApiRequestResponseValidationError,
    ApiRequestSetupError,
} from '../request.errors';
import { makeRequestClient } from '..';

describeUnitTestsFor('apiRequest', () => {
    const sandbox = createSandbox();
    const url = 'https://url';
    const response = { data: 'data value' };

    beforeEach(() => {
        if (!nock.isActive()) nock.activate();
    });

    afterEach(() => {
        nock.cleanAll();
        sandbox.restore();
    });

    it('should assign headers asynchronously', async () => {
        // To make url unique
        const timestamp = Date.now();
        nock(url + timestamp)
            .matchHeader('Authorization', 'authKey')
            .get('/')
            .reply(200, response);

        const requestClient = makeRequestClient(url + timestamp, async () => {
            const authKey = await Promise.resolve('authKey');

            return {
                Authorization: authKey,
            };
        });

        const data = await requestClient.request({
            url: '/',
            method: 'GET',
        });

        expect(data).to.deep.eq(response);
    });

    it('headers in make request should merge and take precedence over makeApiClient async headers', async () => {
        // To make url unique
        const timestamp = Date.now();
        nock(url + timestamp)
            .matchHeader('Authorization', 'authKey2')
            .matchHeader('AdditionalHeader', 'AdditionalHeaderValue')
            .get('/')
            .reply(200, response);

        const requestClient = makeRequestClient(url + timestamp, async () => {
            const authKey = await Promise.resolve('authKey');

            return {
                Authorization: authKey,
            };
        });

        const data = await requestClient.request({
            url: '/',
            method: 'GET',
            headers: {
                Authorization: 'authKey2',
                AdditionalHeader: 'AdditionalHeaderValue',
            },
        });

        expect(data).to.deep.eq(response);
    });

    it('Should by default retry non 400-499 requests for 3 times', async () => {
        // To make url unique
        const timestamp = Date.now();
        const stubResponder = stub();
        nock(url + timestamp)
            .get('/')
            .reply(511, stubResponder);
        nock(url + timestamp)
            .get('/')
            .reply(501, stubResponder);
        nock(url + timestamp)
            .get('/')
            .reply(500, stubResponder);
        nock(url + timestamp)
            .get('/')
            .reply(200, stubResponder);

        const requestClient = makeRequestClient(url + timestamp);
        await requestClient.request({
            url: '/',
            method: 'GET',
        });

        expect(stubResponder.callCount).to.eq(4);
    });

    it('Should by default not retry 400-499 requests', async () => {
        // To make url unique
        const timestamp = Date.now();
        const stubResponder = stub();
        nock(url + timestamp)
            .get('/')
            .reply(400, stubResponder);
        nock(url + timestamp)
            .get('/')
            .reply(401, stubResponder);
        nock(url + timestamp)
            .get('/')
            .reply(402, stubResponder);
        nock(url + timestamp)
            .get('/')
            .reply(200, stubResponder);

        const requestClient = makeRequestClient(url + timestamp);
        await expect(
            requestClient.request({
                url: '/',
                method: 'GET',
            })
        ).to.be.rejectedWith(ApiRequestResponseError);

        expect(stubResponder.callCount).to.eq(1);
    });

    it('Should retry even 400-499 request if skip retry predicate is defined as such', async () => {
        // To make url unique
        const timestamp = Date.now();
        const stubResponder = stub();
        nock(url + timestamp)
            .get('/')
            .reply(400, stubResponder);
        nock(url + timestamp)
            .get('/')
            .reply(499, stubResponder);
        nock(url + timestamp)
            .get('/')
            .reply(400, stubResponder);
        nock(url + timestamp)
            .get('/')
            .reply(200, stubResponder);

        const requestClient = makeRequestClient(url + timestamp);
        await requestClient.request({
            url: '/',
            method: 'GET',
            skipRetryPredicate: () => false, // no matter the status code, do not skip retry
        });

        expect(stubResponder.callCount).to.eq(4);
    });

    it('Should not retry timeouts and throw ApiRequestNoResponse error', async () => {
        // To make url unique
        const timestamp = Date.now();
        const stubResponder = stub();
        nock(url + timestamp)
            .get('/')
            .delay(300)
            .reply(200, stubResponder);
        nock(url + timestamp)
            .get('/')
            .delay(300)
            .reply(200, stubResponder);

        const requestClient = makeRequestClient(url + timestamp);
        await expect(
            requestClient.request({
                url: '/',
                method: 'GET',
                timeout: 10,
                retryCount: 1,
            })
        ).to.be.rejectedWith(ApiRequestNoResponseError);

        expect(stubResponder.callCount).to.eq(1);
    });

    it('Should throw ApiRequestResponseError by default if response code falls outside 2XX.', async () => {
        nock(url).get('/').reply(400, response);
        nock(url).get('/').reply(301, response);
        nock(url).get('/').reply(501, response);
        nock(url).get('/').reply(599, response);
        const requestClient = makeRequestClient(url);
        await expect(
            requestClient.request({
                url: '/',
                method: 'GET',
                retryCount: 0,
            })
        ).to.be.rejectedWith(ApiRequestResponseError);
        await expect(
            requestClient.request({
                url: '/',
                method: 'GET',
                retryCount: 0,
            })
        ).to.be.rejectedWith(ApiRequestResponseError);
        await expect(
            requestClient.request({
                url: '/',
                method: 'GET',
                retryCount: 0,
            })
        ).to.be.rejectedWith(ApiRequestResponseError);
        await expect(
            requestClient.request({
                url: '/',
                method: 'GET',
                retryCount: 0,
            })
        ).to.be.rejectedWith(ApiRequestResponseError);
    });

    it('Should not retry request setup error and throw ApiRequestSetupError error', async () => {
        // To make url unique
        const timestamp = Date.now();
        const stubResponder = stub();
        nock(url + timestamp)
            .get('/')
            .times(4)
            .reply(200, stubResponder);

        const requestClient = makeRequestClient(url + timestamp, () => {
            // error while setuping up http headers
            throw new Error('setup error');
        });

        await expect(
            requestClient.request({
                url: '/',
                method: 'GET',
                timeout: 1,
            })
        ).to.be.rejectedWith(ApiRequestSetupError);

        expect(stubResponder.callCount).to.eq(0);
    });

    it('With successResponseHandler, we can throw custom errors without retrying', async () => {
        const stubResponder = stub();
        class CustomError extends Error {
            constructor(message?: string) {
                super(message);
            }
        }
        // To make url unique
        const timestamp = Date.now();
        nock(url + timestamp)
            .get('/')
            .times(4)
            .reply(200, stubResponder);

        const requestClient = makeRequestClient(url + timestamp);
        await expect(
            requestClient.request<any, void>({
                url: '/',
                method: 'GET',
                onSuccessResponse: (data, bail) => {
                    bail(new CustomError());
                },
            })
        ).to.be.rejectedWith(CustomError);

        expect(stubResponder.callCount).to.eq(1);
    });

    it('With successResponseHandler, we can throw errors and force it to retry even though we receive a 2XX status code', async () => {
        const stubResponder = stub();
        class CustomError extends Error {
            constructor(message?: string) {
                super(message);
            }
        }
        // To make url unique
        const timestamp = Date.now();
        nock(url + timestamp)
            .get('/')
            .times(4)
            .reply(200, stubResponder);

        const requestClient = makeRequestClient(url + timestamp);
        await expect(
            requestClient.request({
                url: '/',
                method: 'GET',
                onSuccessResponse: () => {
                    throw new CustomError();
                },
            })
        ).to.be.rejectedWith(CustomError);

        expect(stubResponder.callCount).to.eq(4);
    });

    it('transform response data when given a successResponsehandler', async () => {
        // To make url unique
        const timestamp = Date.now();
        nock(url + timestamp)
            .get('/')
            .times(4)
            .reply(200, response);
        const requestClient = makeRequestClient(url + timestamp);
        const validator = (data: unknown): data is { data: string } => {
            return true;
        };

        const transformedData = await requestClient.request<any, void>({
            url: '/',
            method: 'GET',
            responseValidator: validator,
            onSuccessResponse: (data) => {
                return data.data + 'transformed';
            },
        });

        expect(transformedData).to.eq(response.data + 'transformed');
    });

    it('Should run validator when provided, and throw, and log ApiRequestResponseValidationError if validation fails', async () => {
        const loggerStub = sandbox.stub(logger, 'error');

        // To make url unique
        const timestamp = Date.now();
        nock(url + timestamp)
            .get('/')
            .reply(200, response);
        const requestClient = makeRequestClient(url + timestamp);
        const alwaysWrongValidator = (data: unknown): data is string => {
            return false;
        };

        await expect(
            requestClient.request({
                url: '/',
                method: 'GET',
                responseValidator: alwaysWrongValidator,
            })
        ).eventually.be.rejectedWith(ApiRequestResponseValidationError);

        expect(loggerStub.callCount).to.be.eq(1);
        const logMessage = loggerStub.getCall(0).args[0] as string[];
        expect(logMessage.join(' ')).to.include('Response data structure failed the validation');
    });

    it('Should log http request with proper context', async () => {
        const loggerStub = sandbox.stub(logger, 'info');

        nock(url).get('/').reply(200, response);
        const requestClient = makeRequestClient(url);

        await requestClient.request({
            url: '/',
            method: 'GET',
        });

        const allLogInfoCalls = loggerStub.getCalls();
        const fullLogContext = {
            baseUrl: 'https://url',
            url: '/',
            method: 'GET',
            status: 200,
            statusText: null,
            data: `{"data":"data value"}`,
        };

        let count = 0;
        for (const { args } of allLogInfoCalls) {
            if (args[1] && args[1].properties) {
                const context = args[1].properties as RequestContext;
                const filteredArg = {
                    baseUrl: context.baseUrl,
                    url: context.url,
                    method: context.method,
                    status: context.status,
                    statusText: context.statusText,
                    data: context.data,
                };

                if (isEqual(filteredArg, fullLogContext)) {
                    count += 1;
                }
            }
        }

        expect(count).to.be.gte(1);
    });

    it('Should log http request with error response with proper context (with data field json stringified)', async () => {
        const loggerStub = sandbox.stub(logger, 'warn');

        nock(url).get('/').reply(400, response);
        const requestClient = makeRequestClient(url);

        await expect(
            requestClient.request({
                url: '/',
                method: 'GET',
                retryCount: 0,
            })
        ).to.be.rejectedWith(ApiRequestResponseError);

        const fullLogContext = {
            baseUrl: 'https://url',
            url: '/',
            method: 'GET',
            statusText: null,
            status: 400,
        };

        const allErrorLoggerCalls = loggerStub.getCalls();

        let count = 0;
        for (const { args } of allErrorLoggerCalls) {
            if (args[1] && args[1].properties) {
                const context = args[1].properties as RequestContext;
                const filteredArg = {
                    baseUrl: context.baseUrl,
                    url: context.url,
                    method: context.method,
                    status: context.status,
                    statusText: context.statusText,
                };

                if (isEqual(filteredArg, fullLogContext)) {
                    count += 1;
                }
            }
        }

        expect(count).to.be.gte(1);
    });

    it('Should be able to intercept log context updates to potentially do things like masking', async () => {
        const loggerStub = sandbox.stub(logger, 'info');

        nock(url).get('/').reply(200, response);
        const requestClient = makeRequestClient(url);

        await requestClient.request({
            url: '/',
            method: 'GET',
            onUpdateLogContext: (context) => {
                const updatedContext = { ...context };
                if (updatedContext.baseUrl) {
                    updatedContext.baseUrl = '******';
                }

                if (updatedContext.data) {
                    updatedContext.data = '*****';
                }

                return updatedContext;
            },
        });

        const allLogInfoCalls = loggerStub.getCalls();
        expect(loggerStub.callCount).to.be.gte(1);

        for (const { args } of allLogInfoCalls) {
            if (args[1] && args[1].properties) {
                const context = args[1].properties as RequestContext;

                if (context.data) {
                    expect(context.data).to.eq('"*****"');
                }
            }
        }
    });
});
