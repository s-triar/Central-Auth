import { Department } from './department';

export class SubDepartment {
    kode: string;
    namaSubDepartemen: string;
    departemenKode: string;
    departemen?: Department;
    public constructor(init?: Partial<SubDepartment>) {
      Object.assign(this, init);
    }
}


