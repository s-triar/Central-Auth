import { User } from './user';
import { ProjectToProject } from './project-to-project';

export class Project {
    apiName: string;
    url: string;
    type: string;
    namaProject: string;
    clientId: string;
    clientSecret: string;
    developerNik: string;
    developer: User;
    users?: User[];
    roles?: string[];
    followers ?: ProjectToProject[];
    followings ?: ProjectToProject[];
    public constructor(init?: Partial<Project>) {
        Object.assign(this, init);
    }
}
