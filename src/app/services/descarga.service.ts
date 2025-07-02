import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Descargas } from '../models/descargas';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class DescargaService {
  private url = `${base_url}/descargas`;
  private listaCambio = new Subject<Descargas[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Descargas[]>(this.url);
  }
  insert(d: Descargas) {
    return this.http.post(this.url, d);
  }
  setList(listaNueva: Descargas[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }
  listId(id: number) {
    return this.http.get<Descargas>(`${this.url}/${id}`);
  }
  update(n: Descargas) {
    return this.http.put(this.url, n);
  }

  deleteN(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
