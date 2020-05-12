import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { ForgetPasswordComponent } from "./pages/auth/forget-password/forget-password.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { DevNavComponent } from "./dev-nav/dev-nav.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { MasterUserComponent } from "./pages/master-user/master-user.component";
import { MasterProjectComponent } from "./pages/master-project/master-project.component";

const routes: Routes = [
  {
    path: "",
    component: MainNavComponent,
    children: [
      { path: "", redirectTo: "/dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "pengguna", component: MasterUserComponent },
      { path: "project", component: MasterProjectComponent },
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "forget-password", component: ForgetPasswordComponent },
    ],
  },
  {
    path: "dev",
    component: DevNavComponent,
    children: [
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "forget-password", component: ForgetPasswordComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
