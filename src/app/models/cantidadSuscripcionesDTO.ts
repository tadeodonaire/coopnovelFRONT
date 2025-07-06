export class CantidadSuscripcionesDTO {
  idUsuario: number = 0;
  nombre: string = '';
  apellido: string = '';
  suscriptores: number = 0;
  novelas: string = '';
  suscrito?: boolean;  // <- Propiedad opcional para controlar el botón en la vista
}
