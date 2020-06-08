export class CustomResponse <T> {
    message: string;
    title: string;
    ok: boolean;
    errors: string[];
    data: T;
    public constructor(init?: Partial<CustomResponse<T>>) {
        Object.assign(this, init);
    }
}
