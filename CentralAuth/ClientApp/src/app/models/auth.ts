export class Login {
  nik: string;
  password: string;
  public constructor(init?: Partial<Login>) {
    Object.assign(this, init);
  }
}

export class Register {
  nik: string;
  email: string;
  telpon: String;
  password: string;
  confirmPassword: string;
  public constructor(init?: Partial<Register>) {
    Object.assign(this, init);
  }
}

export class ForgetPassword {
  email: string;
  public constructor(init?: Partial<ForgetPassword>) {
    Object.assign(this, init);
  }
}
