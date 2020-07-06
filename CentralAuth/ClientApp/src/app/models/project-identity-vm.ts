export class ProjectIdentityVM {
    idRole: string;
    idProjectClaim: string;
    nik: string;
    public constructor(init?: Partial<ProjectIdentityVM>) {
        Object.assign(this, init);
    }
}
