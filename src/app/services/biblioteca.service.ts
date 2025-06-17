import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Biblioteca } from '../models/biblioteca';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class BibliotecaService {
    private url = `${base_url}/bibliotecas`;
  private listaCambio=new Subject<Biblioteca[]>()

  constructor(private http:HttpClient) { }
    list() {
    return this.http.get<Biblioteca[]>(this.url);
  }
  insert(a:Biblioteca){
    return this.http.post(this.url,a)
  }
  setList(listaNueva:Biblioteca[]){
    this.listaCambio.next(listaNueva)
  }
  getList(){
    return this.listaCambio.asObservable()
  }
  listId(id: number) {
    return this.http.get<Biblioteca>(`${this.url}/${id}`);
  }
  modificifar(a: Biblioteca) {
    return this.http.put(this.url, a);
  }
  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }
}
