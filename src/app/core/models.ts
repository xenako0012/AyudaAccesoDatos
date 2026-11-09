/** Modelos de datos de la aplicación de repaso. */

export interface FragmentoCodigo {
  fichero: string;
  lenguaje?: 'java' | 'xml' | 'sql' | 'texto';
  codigo: string;
  nota?: string;
}

export interface TablaInfo {
  cabecera: string[];
  filas: string[][];
}

export interface Tema {
  id: string;
  titulo: string;
  /** Puntos clave del tema, en lenguaje de repaso. */
  puntos: string[];
  fragmentos?: FragmentoCodigo[];
  tabla?: TablaInfo;
  /** Errores habituales / trampas de examen. */
  trampas?: string[];
}

export interface Bloque {
  id: string;
  titulo: string;
  descripcion: string;
  temas: Tema[];
}

export interface Unidad {
  id: 'ut1' | 'ut2' | string;
  numero: string;
  titulo: string;
  subtitulo: string;
  ra: string;
  raTexto: string;
  ces: { codigo: string; texto: string }[];
  acento: 'cyan' | 'violet';
  pdfApuntes: string;
  bloques: Bloque[];
  ideasClave: string[];
}

export interface Pregunta {
  id: string;
  unidad: 'ut1' | 'ut2' | string;
  tema: string;
  enunciado: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
  dificultad: 1 | 2 | 3;
}

export interface Flashcard {
  id: string;
  unidad: 'ut1' | 'ut2' | string;
  bloque: string;
  pregunta: string;
  respuesta: string;
}

export interface Ejercicio {
  id: string;
  unidad: 'ut1' | 'ut2' | string;
  bloque: string;
  titulo: string;
  clase: string;
  descripcion: string;
  tecnicas: string[];
  duracion?: string;
  pdfSolucion: string;
}

export interface Termino {
  termino: string;
  definicion: string;
  unidad: 'ut1' | 'ut2' | 'general' | string;
}

export interface DocumentoPdf {
  nombre: string;
  ruta: string;
  unidad: 'ut1' | 'ut2';
  tipo: 'apuntes' | 'soluciones';
  descripcion: string;
}

export interface ResultadoQuiz {
  fecha: string;
  ambito: string;
  total: number;
  aciertos: number;
  falladas: string[];
}
