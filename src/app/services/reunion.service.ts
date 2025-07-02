import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Reunion } from '../models/reuniones';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ReunionService {
  private url = `${base_url}/reuniones`;

  private listaCambio = new Subject<Reunion[]>();
  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Reunion[]>(`${this.url}`)
  }
  
  insert(reunion: Reunion) {
    return this.http.post<Reunion>(this.url, reunion);
  }

  setList(listaNueva: Reunion[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(idReu: number) {
    return this.http.get<Reunion>(`${this.url}/${idReu}`);
  }

  update(reunion: Reunion) {
    return this.http.put(this.url, reunion);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
