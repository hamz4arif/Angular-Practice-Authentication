import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";
@Injectable({ providedIn: "root" })
export class AuthGaurd implements CanActivate {
    constructor(private authSer:AuthService,private myrouter:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean|UrlTree> | Observable<boolean|UrlTree> |UrlTree{
return this.authSer.user.pipe(take(1),map(user=>{
    const isAuth= !!user;
    if(isAuth){
        return true;
    }
    return this.myrouter.createUrlTree(['./auth'])
}))
  }
}
