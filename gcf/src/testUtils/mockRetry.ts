import AsyncRetry from 'async-retry';

export const mockRetry: typeof AsyncRetry = (fn, options) => {
    let retries = options?.retries ?? 0;
    let bailError: Error | undefined;

    const bail = (error: Error) => {
        bailError = error;
        throw error;
    };

    const wrapper = async (): Promise<any> => {
        try {
            const results = await fn(bail, retries);
            return results;
        } catch (error: any) {
            if (retries && !bailError) {
                retries -= 1;
                return wrapper();
            }
            throw error;
        }
    };

    return wrapper();
};
