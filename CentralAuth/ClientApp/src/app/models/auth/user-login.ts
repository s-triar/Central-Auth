export class UserLogin {
    nik: string;
    password: string;
    public constructor(init?: Partial<UserLogin>) {
        Object.assign(this, init);
      }
}
