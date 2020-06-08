export class Directorate {
    kode: String;
    namaDirektorat: String;
    public constructor(init?: Partial<Directorate>) {
      Object.assign(this, init);
    }
}

