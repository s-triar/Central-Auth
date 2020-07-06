import { User } from './user';
import { Project } from './project';

export class Role {
    id: string;
    name: string;
    normalizedName: string;
    projectApiName: string;
    project: Project;
    public constructor(init?: Partial<Role>) {
        Object.assign(this, init);
    }
}
