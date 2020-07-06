import { Project } from './project';

export class ProjectToProject {
    id: number;
    projekApiName: string;
    projek: Project;
    kolaborasiApiName: string;
    kolaborasi: Project;
    approve: boolean|null;
    public constructor(init?: Partial<ProjectToProject>) {
        Object.assign(this, init);
    }
}
