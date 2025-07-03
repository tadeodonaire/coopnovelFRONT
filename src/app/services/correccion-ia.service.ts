import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { CorreccionesIA } from '../models/correccionesIA';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class CorreccionIAService {
  private url = `${base_url}/Correcciones`;
  private listaCambio = new Subject<CorreccionesIA[]>();
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<CorreccionesIA[]>(this.url);
  }

  insert(c: CorreccionesIA) {
    return this.http.post(this.url, c);
  }

  setList(listaNueva: CorreccionesIA[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<CorreccionesIA>(`${this.url}/${id}`);
  }

  update(c: CorreccionesIA) {
    return this.http.put(this.url, c);
  }

  deleteCorreccionIA(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
