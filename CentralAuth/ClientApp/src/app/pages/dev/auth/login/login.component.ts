import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  loginForm = this.fb.group({
    Nik: ["", [Validators.required, Validators.pattern("[0-9]+")]],
    Password: ["", Validators.required],
  });
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {}
  get nik() {
    return this.loginForm.get("Nik");
  }
  get password() {
    return this.loginForm.get("Password");
  }
}
