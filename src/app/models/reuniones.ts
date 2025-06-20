import { Usuario } from "./usuarios";

export class Reunion {
    idReunion: number = 0;
    reuTema: string = '';
    reuFecha: Date = new Date();
    reuLink: string = '';
    organizadorReu: Usuario = new Usuario();
    participanteReu: Usuario = new Usuario();
}