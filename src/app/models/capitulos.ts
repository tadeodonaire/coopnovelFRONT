import { Descargas } from "./descargas";
import { Novela } from "./novela";

export class Capitulos {
    idCapitulo: number=0;
    capTitulo: string="";
    capContenido: string="";
    novelas: Novela = new Novela();
    descargas: Descargas = new Descargas();
}