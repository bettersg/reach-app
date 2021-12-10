export class PromiseTimeout extends Error {
    constructor(maxRuntimeInMs: number) {
        super(`Await of promises exceeded ${maxRuntimeInMs}ms`);
    }
}

export async function limitPromiseRuntime<T>(
    promise: Promise<T>,
    maxRuntimeInMs: number
): Promise<T> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(async () => {
            reject(new PromiseTimeout(maxRuntimeInMs));
        }, maxRuntimeInMs + 1);

        promise
            .then((results) => {
                resolve(results);
            })
            .catch((err) => reject(err))
            .finally(() => {
                // make sure to clear timeout even if the promise rejects
                clearTimeout(timeout);
            });
    });
}
