import { Injectable } from "@angular/core";
import { StorageEngine } from "@ngxs/storage-plugin";
import { StorageEnum } from "../Enums/storage-enum";
@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor(private _storage: StorageEngine) {}

  setTheme(theme: string) {
    this._storage.setItem(StorageEnum.THEME, theme);
  }
  getTheme() {
    return this._storage.getItem(StorageEnum.THEME);
  }
}
