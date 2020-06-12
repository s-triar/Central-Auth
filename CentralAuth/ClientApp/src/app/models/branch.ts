export class Branch {
    kode: string;
    singkatan: string;
    namaCabang: string;
    keterangan: string;
    alamat: string;
    public constructor(init?: Partial<Branch>) {
        Object.assign(this, init);
    }
}
