import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }
  getToken(): string {
    return localStorage.getItem('access_token');
  }
  removeToken(): void {
    localStorage.removeItem('access_token');
  }
  clearStorage(): void {
    localStorage.clear();
  }
  isExpired() {
    const helper = new JwtHelperService();
    const token = this.getToken();
    return helper.isTokenExpired(token);
  }
  getUserInfo() {
    const token = this.getToken();
    const helper = new JwtHelperService();
    return helper.decodeToken(token);
  }
}
