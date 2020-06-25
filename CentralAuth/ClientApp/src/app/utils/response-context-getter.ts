import { ResponseContext } from '../models/response-context';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomResponse } from '../models/custom-response';

export class ResponseContextGetter {
    public static GetErrorContext<T>(obj: HttpErrorResponse): ResponseContext {
        const response: ResponseContext = new ResponseContext();
        if (typeof(obj.error) === 'string') {
            response.message = obj.message;
            response.ok = obj.ok;
            response.statusCode = obj.status;
            response.title = 'Error';
        } else {
            const errorContent: CustomResponse<T> = obj.error;
            response.message = errorContent.message.toLowerCase().includes('see') ? errorContent.errors[0] :
                                errorContent.message ? errorContent.message :
                                errorContent.errors.toString();
            response.ok = obj.ok ? obj.ok  : false;
            response.statusCode = obj.status;
            response.title = errorContent.title;
        }
        return response;
    }

    public static GetCustomResponseContext<T>(obj: CustomResponse<T>): ResponseContext {
        const response: ResponseContext = new ResponseContext();
        if (obj.errors !== null) {
            response.message = obj.errors.reduce((a, b) => `${a}\n${b}`);
        } else {
            response.message = obj.message;
        }
        response.ok = obj.ok;
        response.statusCode = 200;
        response.title = obj.title;
        return response;
    }
}
