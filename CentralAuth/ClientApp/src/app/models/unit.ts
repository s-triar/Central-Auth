export class Unit {
    kode: string;
    namaUnit: string;
    keterangan: string;
    public constructor(init?: Partial<Unit>) {
        Object.assign(this, init);
    }
}
