export class ProjectToProject {
    id: number;
    projekApiName: string;
    kolaborasiApiName: string;
    approve: boolean|null;
    public constructor(init?: Partial<ProjectToProject>) {
        Object.assign(this, init);
    }
}
