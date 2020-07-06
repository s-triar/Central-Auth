import { User } from './user';
import { Project } from './project';

export class UserProject {
    id: number;
    penggunaNik: string;
    pengguna: User;
    projekApiName: string;
    projek: Project;
    public constructor(init?: Partial<UserProject>) {
        Object.assign(this, init);
    }
}
