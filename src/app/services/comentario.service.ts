import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Comentario } from '../models/comentario';
import { HttpClient } from '@angular/common/http';
import { CantidadComentariosxCapituloDTO } from '../models/CantidadComentariosxCapituloDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private url = `${base_url}/comentarios`;

  private listaCambio = new Subject<Comentario[]>();
  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Comentario[]>(`${this.url}`)
  }

  insert(comentario: Comentario) {
    return this.http.post<Comentario>(this.url, comentario);
  }

  setList(listaNueva: Comentario[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(idCom: number) {
    return this.http.get<Comentario>(`${this.url}/${idCom}`);
  }

  update(comentario: Comentario) {
    return this.http.put(this.url, comentario);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  getQuantityComUs():Observable<CantidadComentariosxCapituloDTO[]>{
    return this.http.get<[CantidadComentariosxCapituloDTO]>(`${this.url}/cantidad-comentarios`);
  }
}
