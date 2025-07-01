import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Capitulos } from '../models/capitulos';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class CapituloService {
  private url = `${base_url}/capitulos`;
  private listaCambio = new Subject<Capitulos[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Capitulos[]>(this.url);
  }

  insert(c: Capitulos) {
    return this.http.post(this.url, c);
  }

  setList(listaNueva: Capitulos[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Capitulos>(`${this.url}/${id}`);
  }
  
  update(c: Capitulos) {
    return this.http.put(this.url, c);
  }

  deleteC(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
