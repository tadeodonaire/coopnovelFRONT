import { Roles } from "./roles";

export class Usuario {
    idUsuario: number=0;
    usNombre: string="";
    usApellido: string="";
    usFecNacimiento:Date=new Date();
    usCorreo: string="";
    username: string="";
    password: string="";
    usEnable: boolean=true;
    role:Roles = new Roles();
}