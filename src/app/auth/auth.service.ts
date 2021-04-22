import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}
@Injectable({
  providedIn: "root",
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private expireationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}
  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBkfxs_kMztVfSSP6Jh-nCYlmRD-F5JA20",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.HandleError),
        tap((resData) => {
          this.HandleAuthUser(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBkfxs_kMztVfSSP6Jh-nCYlmRD-F5JA20",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.HandleError),
        tap((resData) => {
          this.HandleAuthUser(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(["/auth"]);
    localStorage.removeItem("userData");
    if (this.expireationTimer) {
      clearTimeout(this.expireationTimer);
    }
    this.expireationTimer = null;
  }
  autoLogout(expireationDuration: number) {
    console.log(expireationDuration)
    this.expireationTimer = setTimeout(() => {
      this.logout();
    }, expireationDuration);
  }

  private HandleError(errorResponse: HttpErrorResponse) {
    let ErrorMessage = "An Error Occured!";
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(ErrorMessage);
    }
    switch (errorResponse.error.error.message) {
      case "EMAIL_EXISTS":
        ErrorMessage =
          " The email address is already in use by another account.";
        break;
      case "EMAIL_NOT_FOUND":
        ErrorMessage =
          " There is no user record corresponding to this identifier. The user may have been deleted.";
        break;
      case "INVALID_PASSWORD":
        ErrorMessage =
          " The password is invalid or the user does not have a password.";
        break;
      // console.log(ErrorMessage)
    }
    return throwError(ErrorMessage);
  }
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }
    const loadUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadUser.token) {
      this.user.next(loadUser);
      const expireationDuration =
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expireationDuration);
    }
  }

  private HandleAuthUser(
    email: string,
    userID: string,
    token: string,
    expiresIn: number
  ) {
    const tokenExpiry = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userID, token, tokenExpiry);
    console.log(user);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem("userData", JSON.stringify(user));
  }
}
