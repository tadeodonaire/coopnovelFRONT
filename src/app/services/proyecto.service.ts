import { Proyecto } from './../models/proyecto';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url= environment.base;

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private url=`${base_url}/proyectos`
  private listaCambio = new Subject<Proyecto[]>();

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Proyecto[]>(this.url);
  }
  insert(p: Proyecto) {
    return this.http.post(this.url, p);
  }
  setList(listaNueva: Proyecto[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Proyecto>(`${this.url}/${id}`);
  }
  update(pr: Proyecto) {
    return this.http.put(this.url, pr);
  }

  deleteP(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
