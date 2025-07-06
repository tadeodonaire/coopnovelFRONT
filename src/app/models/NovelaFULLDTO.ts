export interface NovelaFullDTO {
  idNovela: number;
  novTitulo: string;
  novResumen: string;
  novGenero: string;

  idProyecto: number;
  proyTitulo: string;
  proyDescripcion: string;

  idUsuario: number;
  usNombre: string;
  usApellido: string;
  username: string;

  idCapitulo?: number;
  capTitulo?: string;
  capContenido?: string;
}