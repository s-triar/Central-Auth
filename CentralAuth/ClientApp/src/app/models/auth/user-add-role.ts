import { ClaimStandard } from '../commons/claim-standard';

export class UserAddRole {
    nik: string;
    roles: string[];
    claims: ClaimStandard[];
    public constructor(init?: Partial<UserAddRole>) {
        Object.assign(this, init);
      }
}
