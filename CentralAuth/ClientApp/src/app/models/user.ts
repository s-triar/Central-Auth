import { SubDepartment } from './sub-department';
import { Department } from './department';
import { Directorate } from './directorate';
import { Branch } from './branch';
import { Unit } from './unit';

export class User {
  nik: string;
  nama: string;
  email: string;
  ext: string;
  atasanNik: string;
  atasan?: User;
  subDepartemenKode: string;
  subDepartemen?: SubDepartment;
  departemenKode: string;
  departemen?: Department;
  direktoratKode: string;
  direktorat?: Directorate;
  cabangKode: string;
  cabang?: Branch;
  unitKode: string;
  unit?: Unit;
  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
