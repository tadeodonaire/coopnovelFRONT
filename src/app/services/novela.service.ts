import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Novela } from '../models/novela';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NovelaFullDTO } from '../models/NovelaFULLDTO';
import { Capitulos } from '../models/capitulos';
import { ComentariosNovelaDTO } from '../models/ComentariosNovelaDTO';

const base_url = environment.base;
@Injectable({
  providedIn: 'root',
})
export class NovelaService {
  private url = `${base_url}/novelas`;
  private listaCambio = new Subject<Novela[]>();

  constructor(private http: HttpClient) {}

  list() {
      return this.http.get<Novela[]>(this.url);
    }
    insert(novela: Novela) {
      return this.http.post(this.url, novela);
    }
    setList(listaNueva: Novela[]) {
      this.listaCambio.next(listaNueva);
    }
    getList() {
      return this.listaCambio.asObservable();
    }
  
    listId(id: number) {
      return this.http.get<Novela>(`${this.url}/${id}`);
    }
    update(n: Novela) {
      return this.http.put(this.url, n);
    }
  
    deleteN(id: number) {
      return this.http.delete(`${this.url}/${id}`);
    }
    getNovelasFull() {
  return this.http.get<NovelaFullDTO[]>(`${this.url}/NovelasVer`);
}
  listByNovelaId(idNovela: number) {
    return this.http.get<Capitulos[]>(`${this.url}/capitulos/novela/${idNovela}`);
  }
    getComentariosPorNovela(idNovela: number): Observable<ComentariosNovelaDTO[]> {
    return this.http.get<ComentariosNovelaDTO[]>(`${this.url}/comentarios/novela/${idNovela}`);
  }
}
