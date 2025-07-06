export interface ComentarioDTO {
  idComentario: number;
  comContenido: string;
  comFecha: Date;
  usuario: {
    idUsuario: number;
    usNombre: string;
    usApellido: string;
    username: string;
  };
  capitulo: {
    idCapitulo: number;
    capTitulo: string;
  };
}
