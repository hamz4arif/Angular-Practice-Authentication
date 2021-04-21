import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent {
  constructor(private authSerice: AuthService,private router:Router) {}
  isLogin = true;
  isLoading = false;
  error: string = null;
  onChangeState() {
    this.isLogin = !this.isLogin;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    let AuthObs: Observable<AuthResponseData>;

    const email = form.value.email;
    const password = form.value.password;
    if (this.isLogin) {
      AuthObs = this.authSerice.signIn(email, password);
    } else {
      this.isLoading = true;
      AuthObs = this.authSerice.signup(email, password);
    }
    form.reset();
    AuthObs.subscribe(
      (resData) => {
        this.isLoading = false;
        // this.router.navigate(['/recipes'])
        this.router.navigate(['/recipes'])
        console.log(resData);
      },
      (ErrorMessage) => {
        this.isLoading = false;
        this.error = ErrorMessage;
        console.log(ErrorMessage);
      }
    );
  }
}
