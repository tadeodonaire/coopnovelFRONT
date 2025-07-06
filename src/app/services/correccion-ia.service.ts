import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { CorreccionesIA } from '../models/correccionesIA';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CapitulosSinCorreccionIAComponent } from '../components/reportes/capitulos-sin-correccion-ia/capitulos-sin-correccion-ia.component';
import { CapitulosSinCorreccionIADTO } from '../models/capitulos-sin-correccion-iadto';
import { ListarCorreccionPorIdCapDTO } from '../models/listar-correccion-por-id-cap-dto';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class CorreccionIAService {
  private url = `${base_url}/Correcciones`;
  private listaCambio = new Subject<CorreccionesIA[]>();

  // Tu API key y URL para Gemini
  private readonly API_KEY = 'AIzaSyCdslaznxwGxsNoJUO5N2fmN-OXbxK2nLE';
  private readonly API_URL =
    'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

  constructor(private http: HttpClient) {}

  // CRUD
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

  generarCorreccionIA(texto: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      contents: [
        {
          parts: [{ text: `Eres un genio literario de novelas. Mejora este texto sin exceder 254 caracteres. No expliques nada, solo responde con el texto corregido.\n\n${texto}` }],
        },
      ],
    };

    const url = `${this.API_URL}?key=${this.API_KEY}`;
    return this.http.post(url, body, { headers });
  }

  getCapSinCorrecciones(): Observable<CapitulosSinCorreccionIADTO[]> {
    return this.http.get<CapitulosSinCorreccionIADTO[]>(`${this.url}/CapituloSinCorreccion`);
  }

  getCorreccionPorIdCapitulo(idCapitulo: number): Observable<ListarCorreccionPorIdCapDTO[]> {
  return this.http.get<ListarCorreccionPorIdCapDTO[]>(`${this.url}/CorreccionPorIDCapitulo?idCapitulo=${idCapitulo}`);
}
  
}
