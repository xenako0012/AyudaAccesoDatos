# Repaso AD · Acceso a Datos (DAM 2º)

Web de repaso de la asignatura **Acceso a Datos (0486)** construida con **Angular 22**
(standalone, zoneless, signals). Pensada para preparar el examen con:

- **Temario** resumido por unidades y bloques: puntos clave, tablas de decisión,
  fragmentos de código copiables y los errores habituales que más caen en examen.
- **Test** de opción múltiple con corrección y explicación al instante, filtrable por
  unidad, con seguimiento de la mejor nota.
- **Flashcards** pregunta → respuesta con modo *solo pendientes* y marcado de dominadas.
- **Ejercicios** de cada bloque con las técnicas necesarias y el solucionario oficial en PDF.
- **Glosario** técnico con buscador tolerante a acentos.

## Unidades cubiertas

| Unidad | Título | RA |
| ------ | ------ | -- |
| UT1 | Manejo de Ficheros (texto, binarios, RAF, serialización, XML) | RA1 · CE1.a–CE1.g |
| UT2 | Manejo de Conectores (JDBC, MySQL, ACID, HikariCP, Singleton/DTO/DAO) | RA2 · CE2.a–CE2.k |

## Desarrollo

```bash
npm install
npm start          # ng serve → http://localhost:4200
npm run build      # build de producción en dist/
```

## Estructura

```
src/app/
├── core/
│   ├── models.ts            # Interfaces del dominio (Unidad, Pregunta, Flashcard…)
│   ├── progress.service.ts  # Progreso en localStorage (tests + flashcards)
│   └── data/                # Contenido didáctico como datos TypeScript
│       ├── unidades.data.ts # Índice de unidades
│       ├── ut1.data.ts      # Temario UT1
│       ├── ut2.data.ts      # Temario UT2
│       ├── quiz.data.ts     # Banco de preguntas
│       ├── flashcards.data.ts
│       ├── ejercicios.data.ts
│       └── glosario.data.ts
├── pages/                   # home, temario, unidad, quiz, flashcards, ejercicios, glosario
└── shared/code-block.ts     # Bloque de código con botón de copiar
```

El contenido vive en los ficheros de `core/data/`: para añadir una unidad nueva
basta con crear su fichero de datos y registrarla en `unidades.data.ts`.

Los PDFs originales (apuntes y solucionarios) se sirven desde `public/pdf/`.
