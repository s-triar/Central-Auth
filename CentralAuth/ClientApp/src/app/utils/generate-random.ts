import { ResponseContext } from '../models/response-context';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomResponse } from '../models/custom-response';

export class GenerateRandom {
    public static GenerateString(n: number): string {
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < n; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public static GenerateNumber(n: number, range: number): number {
        let res = '';
        for (let index = 0; index < n; index++) {
           const t = Math.ceil(Math.random() * 100);
           res += t.toString();
        }
        return parseInt(res, 10);
    }
}
