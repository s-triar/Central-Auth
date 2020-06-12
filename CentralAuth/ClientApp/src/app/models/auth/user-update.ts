export class UserUpdate {
    nik: string;
    nama: string;
    currentPassword: string;
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
    public constructor(init?: Partial<UserUpdate>) {
        Object.assign(this, init);
      }
}
