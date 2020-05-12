export class Login {
  Nik: string;
  Password: string;
  public constructor(init?: Partial<Login>) {
    Object.assign(this, init);
  }
}

export class Register {
  Nik: string;
  Email: string;
  Telpon: String;
  Password: string;
  ConfirmPassword: string;
  public constructor(init?: Partial<Register>) {
    Object.assign(this, init);
  }
}

export class ForgetPassword {
  Email: string;
  public constructor(init?: Partial<ForgetPassword>) {
    Object.assign(this, init);
  }
}
