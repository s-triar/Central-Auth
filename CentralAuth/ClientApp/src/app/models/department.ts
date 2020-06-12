import { Directorate } from './directorate';

export class Department {
    kode: string;
    namaDepartemen: string;
    direktoratKode: string;
    direktorat?: Directorate;
    public constructor(init?: Partial<Department>) {
      Object.assign(this, init);
    }
}

