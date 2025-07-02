import { Usuario } from "./usuarios";

export class Suscripciones {
    idSuscripcion: number = 0;
    susFechaInicio: Date = new Date();
    suscriptor:Usuario = new Usuario();
    suscrito:Usuario = new Usuario();
}