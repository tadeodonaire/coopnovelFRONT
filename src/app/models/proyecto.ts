import { Usuario } from "./usuarios";

export class Proyecto{
    idProyecto: number=0;
    proyTitulo: string="";
    proyDescripcion: string="";
    usuario: Usuario = new Usuario();
}