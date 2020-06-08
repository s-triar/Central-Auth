export class Department {
    Kode: string;
    NamaDepartemen: string;
    public constructor(init?: Partial<Department>) {
      Object.assign(this, init);
    }
}

