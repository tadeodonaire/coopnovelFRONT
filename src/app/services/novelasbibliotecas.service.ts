import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Novelasbibliotecas } from '../models/novelasbibliotecas';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class NovelasbibliotecasService {
  private url = `${base_url}/novelas-bibliotecas`;
  private listaCambio = new Subject<Novelasbibliotecas[]>();

  constructor(private http: HttpClient) {}

  list(){
    return this.http.get<Novelasbibliotecas[]>(this.url);
  }
  insert(novelaBiblioteca: Novelasbibliotecas) {
    return this.http.post(this.url, novelaBiblioteca);
  }
  setList(listaNueva: Novelasbibliotecas[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }
  listId(id: number) {
    return this.http.get<Novelasbibliotecas>(`${this.url}/${id}`);
  }
  update(novelaBiblioteca: Novelasbibliotecas) {
    return this.http.put(this.url, novelaBiblioteca);
  }
  deleteNovBib(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
