export class BibliotecaDTO {
  idBiblioteca: number = 0;
  bibNombre: string = "";

  idNovela: number = 0;
  novTitulo: string = "";
  novResumen: string = "";
  novGenero: string = "";

  idCapitulo: number | null = null;
  capTitulo: string = "";
  capContenido: string = "";

  idUsuario: number = 0;
  usNombre: string = "";
  usApellido: string = "";
  username: string = "";
}