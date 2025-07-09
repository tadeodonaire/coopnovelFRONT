import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtRequest } from '../models/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}
  login(request: JwtRequest) {
    return this.http.post('https://localhost:8084/login', request);
  }
  verificar() {
    let token = sessionStorage.getItem('token');
    return token != null;
  }
  showRole() {
    let token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.role;
  }
  getUsername(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    return decoded?.sub ?? null;
  }
  getUserId(): number | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    console.log('TOKEN DECODIFICADO:', decoded);
    return decoded?.idUsuario ?? null;
  }
  
  getLoggedUsername(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    console.log('TOKEN DECODIFICADO:', decoded);

    // Ahora devuelve el username (del campo sub)
    return decoded?.sub ?? null;
  }
}
