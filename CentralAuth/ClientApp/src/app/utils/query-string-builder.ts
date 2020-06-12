import {map} from 'rxjs/operators';

export class QueryStringBuilder {
    static BuildParametersFromSearch<T>(obj: T): URLSearchParams {
        const params: URLSearchParams = new URLSearchParams();

        if (obj == null) {
            return params;
        }

        QueryStringBuilder.PopulateSearchParams(params, '', obj);

        return params;
    }

    private static PopulateArray<T>(params: URLSearchParams, prefix: string, val: Array<T>) {
        for (const index in val) {
            const key = prefix + '[' + index + ']';
            const value: any = val[index];
            QueryStringBuilder.PopulateSearchParams(params, key, value);
        }
    }

    private static PopulateObject<T>(params: URLSearchParams, prefix: string, val: T) {
        const objectKeys = Object.keys(val) as Array<keyof T>;

        if (prefix) {
            prefix = prefix + '.';
        }

        for (const objKey of objectKeys) {

            const value = val[objKey];
            const key = prefix + objKey;

            QueryStringBuilder.PopulateSearchParams(params, key, value);
        }
    }

    private static PopulateSearchParams<T>(params: URLSearchParams, key: string, value: any) {
        if (value instanceof Array) {
            QueryStringBuilder.PopulateArray(params, key, value);
        } else if (value instanceof Date) {
            params.set(key, value.toISOString());
        } else if (value instanceof Object) {
            QueryStringBuilder.PopulateObject(params, key, value);
        } else {
            if (value !== undefined && value !== null) {
                params.set(key, value.toString());
            }
        }
    }

}
