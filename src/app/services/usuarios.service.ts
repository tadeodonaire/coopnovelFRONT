import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuarios';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private url = `${base_url}/usuarios`;
  private listaCambio= new Subject <Usuario[]> ()

  constructor(private http: HttpClient) {}
  list() {
    return this.http.get<Usuario[]>(this.url);
  }
  insert(a: Usuario) {
    return this.http.post(this.url, a);
  }

  setList(listaNueva:Usuario[]) {
    this.listaCambio.next(listaNueva);
  }

  getList(){
    return this.listaCambio.asObservable();
  }
  
  }
