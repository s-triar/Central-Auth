export class User {
  Nik: string;
  Name: string;
  Email: string;
  Phone: string;
  Token: string;
  PhotoUrl: string;
  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
