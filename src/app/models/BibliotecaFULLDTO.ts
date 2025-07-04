export class BibliotecaDTO {
  idNovelaBiblioteca!: number;

  idBiblioteca!: number;
  bibNombre!: string;

  idNovela!: number;
  novTitulo!: string;
  novResumen!: string;
  novGenero!: string;

  idProyecto!: number;
  proyTitulo!: string;
  proyDescripcion!: string;

  idUsuario!: number;
  usNombre!: string;
  usApellido!: string;
  username!: string;

  idCapitulo?: number; // Puede ser null
  capTitulo?: string;
  capContenido?: string;
}