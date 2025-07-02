import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerLibrosService {
 private apiKey = 'AIzaSyCPhX65ki-sjACSvlNGRf71M-AHNgnjcKw'; // reemplaza con tu key
  private apiURL = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  obtenerLibroPorTema(tema: string, startIndex: number = 0): Observable<any> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    tema
  )}&maxResults=10&startIndex=${startIndex}`;
  return this.http.get<any>(url);
}
}
