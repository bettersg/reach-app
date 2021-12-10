import { AxiosRequestConfig, AxiosResponse } from 'axios';

export class ApiRequestResponseError extends Error {
    public response: AxiosResponse;
    constructor(response: AxiosResponse) {
        const { status } = response;
        super(`Response received of status:${status}`);
        this.response = response;
        this.name = 'ApiRequestResponseError';
    }
}

export class ApiRequestNoResponseError extends Error {
    public request: AxiosRequestConfig;
    constructor(request: AxiosRequestConfig) {
        super('No response received');
        this.name = 'ApiRequestNoResponseError';
        this.request = request;
    }
}

export class ApiRequestSetupError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiRequestSetupError';
    }
}
export class ApiRequestResponseValidationError extends Error {
    public response: AxiosResponse;
    constructor(response: AxiosResponse) {
        const { data } = response;
        super(`Response data structure failed the validation ${JSON.stringify(data)}`);
        this.response = response;
        this.name = 'ApiRequestResponseValidationError';
    }
}
