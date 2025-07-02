import { Capitulos } from "./capitulos";
import { Usuario } from "./usuarios";

export class Comentario {
    idComentario: number = 0;
    comContenido: string = '';
    comFecha: Date = new Date();
    usuario: Usuario = new Usuario();
    capitulo: Capitulos = new Capitulos();
}