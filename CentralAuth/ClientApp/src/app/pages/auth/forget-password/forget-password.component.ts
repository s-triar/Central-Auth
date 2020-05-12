import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"],
})
export class ForgetPasswordComponent implements OnInit {
  hide: boolean = true;
  forgetForm = this.fb.group({
    Email: ["", [Validators.required, Validators.email]],
  });
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {}
  get Email() {
    return this.forgetForm.get("Email");
  }
}
