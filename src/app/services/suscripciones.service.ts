import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Suscripciones } from '../models/suscripciones';
import { HttpClient } from '@angular/common/http';
import { CantidadSuscripcionesDTO } from '../models/cantidadSuscripcionesDTO';
import { RepeatUsersDTO } from '../models/repeatUsersDTO';

const base_url = environment.base;
@Injectable({
  providedIn: 'root',
})
export class SuscripcionesService {
  private url = `${base_url}/suscripciones`;
  private listaCambio = new Subject<Suscripciones[]>();
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Suscripciones[]>(this.url);
  }
  insert(suscripcion: Suscripciones) {
    return this.http.post(this.url, suscripcion);
  }
  setList(listaNueva: Suscripciones[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }
  listId(id: number) {
    return this.http.get<Suscripciones>(`${this.url}/${id}`);
  }
  update(suscripcion: Suscripciones) {
    return this.http.put(this.url, suscripcion);
  }
  deleteSus(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  getUsersSubscribedMore() {
    return this.http.get<RepeatUsersDTO[]>(`${this.url}/usuarios-suscritos`);
  }
  getEscritores(): Observable<CantidadSuscripcionesDTO[]> {
    return this.http.get<CantidadSuscripcionesDTO[]>(
      `${this.url}/cantidad-suscripciones`
    );
  }
  eliminarPorUsuarios(idSuscriptor: number, idSuscrito: number) {
    return this.http.delete(
      `${this.url}/suscriptor/${idSuscriptor}/suscrito/${idSuscrito}`
    );
  }
  obtenerMisSuscripciones(idSuscriptor: number) {
    return this.http.get<number[]>(
      `${this.url}/mis-suscripciones/${idSuscriptor}`
    );
  }
}
