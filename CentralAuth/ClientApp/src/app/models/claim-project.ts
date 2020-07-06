import { Project } from './project';

export class ClaimProject {
    id: string;
    claimName:string;
    projekApiName: string;
    projek: Project;
    public constructor(init?: Partial<ClaimProject>) {
        Object.assign(this, init);
    }
}
