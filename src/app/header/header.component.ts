import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

import { DataStorageService } from "../shared/data-storage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  authObs: Subscription;
  isAuthentificated = false;
  constructor(
    private dataStorageService: DataStorageService,
    private authSer: AuthService
  ) {}
  ngOnInit() {
    this.authObs = this.authSer.user.subscribe((user) => {
      this.isAuthentificated = !!user;
    });
  }
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
  ngOnDestroy() {
    this.authObs.unsubscribe();
  }
}
