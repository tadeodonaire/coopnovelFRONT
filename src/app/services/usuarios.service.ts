import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuarios';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { EdadDTO } from '../models/edadDTO';
import { QuerySuscripcionDTO } from '../models/QuerySuscripcionDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private url = `${base_url}/usuarios`;
  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}
  list() {
    return this.http.get<Usuario[]>(this.url);
  }
  insert(a: Usuario) {
    return this.http.post(this.url, a);
  }

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  update(u: Usuario) {
    return this.http.put(this.url, u);
  }

  deleteU(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
  
  getEdad():Observable<EdadDTO[]>{
    return this.http.get<EdadDTO[]>(`${this.url}/edad`);
  }
  getSuscipcionesMes(id:number):Observable<QuerySuscripcionDTO[]>{
    const params = {a:id}
    return this.http.get<[QuerySuscripcionDTO]>(`${this.url}/CantidadSuscripcion`,{params});
  }
}
