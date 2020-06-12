export class UserRegister {
    nik: string;
    nama: string;
    password: string;
    confirmPassword: string;
    email: string;
    ext: string;
    nikAtasan: string;
    kodeDirektorat: string;
    kodeDepartemen: string;
    kodeSubDepartemen: string;
    kodeCabang: string;
    kodeUnit: string;
    public constructor(init?: Partial<UserRegister>) {
        Object.assign(this, init);
      }
}
