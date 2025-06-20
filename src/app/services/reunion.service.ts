import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Reunion } from '../models/reuniones';

const base_url=environment.base;

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

  private url = `${base_url}/reuniones`;

  constructor(private http:HttpClient) { }

  list() {
    return this.http.get<Reunion[]>(`${this.url}`)
  }
}
