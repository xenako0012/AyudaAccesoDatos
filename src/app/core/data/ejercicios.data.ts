import { Ejercicio } from '../models';

/** Ejercicios de refuerzo con su solucionario oficial (PDF descargable). */
export const EJERCICIOS: Ejercicio[] = [
  // ---------- UT1 · Bloque 1: Texto y NIO.2 ----------
  {
    id: 'u1-b1-e1', unidad: 'ut1', bloque: 'B1 · Texto y NIO.2',
    titulo: 'Validador y normalizador de CSV', clase: 'ValidadorCSV.java',
    descripcion:
      'Lee un CSV de empleados en ISO-8859-1, valida cada línea (nº de campos, DNI no vacío, salario positivo), descarta las corruptas en un log de errores y escribe el fichero limpio en UTF-8.',
    tecnicas: ['Files.newBufferedReader/Writer', 'ISO-8859-1 → UTF-8', 'split(";", -1)', 'Log de errores'],
    pdfSolucion: 'pdf/AD-UT1-B1-Soluciones-Texto-NIO2.pdf',
  },
  {
    id: 'u1-b1-e2', unidad: 'ut1', bloque: 'B1 · Texto y NIO.2',
    titulo: 'Generador de informes de ventas', clase: 'GeneradorInforme.java',
    descripcion:
      'Genera un informe de ventas con columnas alineadas, totales e IVA usando las máscaras de printf.',
    tecnicas: ['PrintWriter', 'printf: %-22s %9.2f', 'checkError()'],
    pdfSolucion: 'pdf/AD-UT1-B1-Soluciones-Texto-NIO2.pdf',
  },
  {
    id: 'u1-b1-e3', unidad: 'ut1', bloque: 'B1 · Texto y NIO.2',
    titulo: 'Analizador forense de logs', clase: 'AnalizadorForense.java',
    descripcion:
      'Filtra errores de un log gigante y cuenta líneas por nivel usando streams funcionales con memoria constante.',
    tecnicas: ['Files.lines()', 'filter / map', 'Collectors.groupingBy', 'try-with-resources en Streams'],
    pdfSolucion: 'pdf/AD-UT1-B1-Soluciones-Texto-NIO2.pdf',
  },
  {
    id: 'u1-b1-e4', unidad: 'ut1', bloque: 'B1 · Texto y NIO.2',
    titulo: 'Organizador de la carpeta de descargas', clase: 'OrganizadorDescargas.java',
    descripcion:
      'Crea subcarpetas por tipo de fichero, mueve cada archivo a su carpeta y limpia lo que sobre: gestión de directorios pura.',
    tecnicas: ['Path / Files', 'createDirectories', 'Files.move', 'listFiles'],
    pdfSolucion: 'pdf/AD-UT1-B1-Soluciones-Texto-NIO2.pdf',
  },
  {
    id: 'u1-b1-e5', unidad: 'ut1', bloque: 'B1 · Texto y NIO.2',
    titulo: 'Boletín de notas', clase: 'BoletinNotas.java',
    descripcion:
      'Lee las notas de alumnos por campos y genera un boletín con formato de tabla y estadísticas del grupo.',
    tecnicas: ['Scanner con useDelimiter', 'useLocale(Locale.US)', 'PrintWriter + printf'],
    pdfSolucion: 'pdf/AD-UT1-B1-Soluciones-Texto-NIO2.pdf',
  },
  {
    id: 'u1-b1-e6', unidad: 'ut1', bloque: 'B1 · Texto y NIO.2',
    titulo: 'Migración y fusión ordenada de padrones', clase: 'FusionPadrones.java',
    descripcion:
      'Migra padrones municipales de codificación antigua a UTF-8 y los fusiona de forma ordenada sin duplicados.',
    tecnicas: ['Conversión de charsets', 'TreeSet / ordenación', 'BufferedReader/Writer'],
    pdfSolucion: 'pdf/AD-UT1-B1-Soluciones-Texto-NIO2.pdf',
  },

  // ---------- UT1 · Bloque 2: Binarios, RAF y serialización ----------
  {
    id: 'u1-b2-e1', unidad: 'ut1', bloque: 'B2 · Binarios y RAF',
    titulo: 'Caja negra de flota de vehículos', clase: 'CajaNegraFlota.java',
    descripcion:
      'Registra telemetría GPS en binario (append) y genera una auditoría de excesos de velocidad leyendo hasta EOFException.',
    tecnicas: ['DataOutputStream append', 'DataInputStream + EOFException', 'writeInt/writeUTF/writeDouble'],
    pdfSolucion: 'pdf/AD-UT1-B2-Soluciones-Binarios-RAF.pdf',
  },
  {
    id: 'u1-b2-e2', unidad: 'ut1', bloque: 'B2 · Binarios y RAF',
    titulo: 'Gestor de almacén directo en disco', clase: 'AlmacenRAF.java',
    descripcion:
      'Almacén de registros de longitud fija: modifica el stock in situ calculando el offset con seek(), sin leer el resto del fichero.',
    tecnicas: ['RandomAccessFile', 'seek() con registros fijos', 'writeChars rellenado'],
    pdfSolucion: 'pdf/AD-UT1-B2-Soluciones-Binarios-RAF.pdf',
  },
  {
    id: 'u1-b2-e3', unidad: 'ut1', bloque: 'B2 · Binarios y RAF',
    titulo: 'Auditoría bancaria con append seguro', clase: 'AuditoriaBancaria.java',
    descripcion:
      'Añade movimientos serializados a un fichero existente en cada ejecución sin corromperlo: la trampa de la doble cabecera resuelta.',
    tecnicas: ['MiObjectOutputStream', 'writeStreamHeader() vacío', 'FileOutputStream(f, true)'],
    pdfSolucion: 'pdf/AD-UT1-B2-Soluciones-Binarios-RAF.pdf',
  },
  {
    id: 'u1-b2-e4', unidad: 'ut1', bloque: 'B2 · Binarios y RAF',
    titulo: 'Ranking binario de un torneo', clase: 'PuntuacionesTorneo.java',
    descripcion:
      'Guarda y actualiza puntuaciones de jugadores en un fichero binario de acceso directo para consultas rápidas.',
    tecnicas: ['RAF lectura/escritura "rw"', 'Registros fijos', 'Búsqueda posicional'],
    pdfSolucion: 'pdf/AD-UT1-B2-Soluciones-Binarios-RAF.pdf',
  },
  {
    id: 'u1-b2-e5', unidad: 'ut1', bloque: 'B2 · Binarios y RAF',
    titulo: 'Inventario serializado de un taller', clase: 'InventarioTaller.java',
    descripcion:
      'Persiste el inventario completo como objetos serializados, con campos sensibles marcados transient y serialVersionUID.',
    tecnicas: ['Serializable', 'serialVersionUID', 'transient', 'ObjectOutputStream/ObjectInputStream'],
    pdfSolucion: 'pdf/AD-UT1-B2-Soluciones-Binarios-RAF.pdf',
  },
  {
    id: 'u1-b2-e6', unidad: 'ut1', bloque: 'B2 · Binarios y RAF',
    titulo: 'Socios con borrado lógico y compactación', clase: 'SociosRAF.java',
    descripcion:
      'Gestión de socios con bajas lógicas (marca de borrado) y compactación periódica del fichero de acceso aleatorio.',
    tecnicas: ['Borrado lógico', 'Compactación de fichero', 'RandomAccessFile'],
    pdfSolucion: 'pdf/AD-UT1-B2-Soluciones-Binarios-RAF.pdf',
  },

  // ---------- UT1 · Bloque 3: XML ----------
  {
    id: 'u1-b3-e1', unidad: 'ut1', bloque: 'B3 · XML',
    titulo: 'Generador de facturas con DOM', clase: 'FacturaDOM.java',
    descripcion:
      'Construye una factura XML desde cero con DOM (createElement/appendChild) y la vuelca a disco con Transformer y sangría.',
    tecnicas: ['DocumentBuilderFactory', 'createElement / appendChild', 'Transformer + INDENT'],
    pdfSolucion: 'pdf/AD-UT1-B3-Soluciones-XML.pdf',
  },
  {
    id: 'u1-b3-e2', unidad: 'ut1', bloque: 'B3 · XML',
    titulo: 'Modificador de tarifas DOM in-situ', clase: 'GestorTarifasDOM.java',
    descripcion:
      'Carga una tarifa XML en memoria, incrementa los precios recorriendo los nodos (filtrando #text) y guarda el resultado.',
    tecnicas: ['DOM en RAM', 'ELEMENT_NODE', 'setTextContent'],
    pdfSolucion: 'pdf/AD-UT1-B3-Soluciones-XML.pdf',
  },
  {
    id: 'u1-b3-e3', unidad: 'ut1', bloque: 'B3 · XML',
    titulo: 'Analizador dual SAX y StAX', clase: 'AnalizadorDualXML.java',
    descripcion:
      'El mismo análisis resuelto dos veces: recorrido completo por eventos con SAX y búsqueda con salida anticipada con StAX.',
    tecnicas: ['DefaultHandler', 'StringBuilder en characters()', 'XMLStreamReader', 'Salida anticipada'],
    pdfSolucion: 'pdf/AD-UT1-B3-Soluciones-XML.pdf',
  },
  {
    id: 'u1-b3-e4', unidad: 'ut1', bloque: 'B3 · XML',
    titulo: 'Mapeo declarativo objeto-XML', clase: 'BibliotecaJAXB.java',
    descripcion:
      'Convierte una biblioteca de libros a XML y la recupera como objetos usando solo anotaciones JAXB, sin tocar un nodo.',
    tecnicas: ['@XmlRootElement / @XmlElement / @XmlAttribute', 'Marshaller / Unmarshaller', 'Constructor vacío'],
    pdfSolucion: 'pdf/AD-UT1-B3-Soluciones-XML.pdf',
  },
  {
    id: 'u1-b3-e5', unidad: 'ut1', bloque: 'B3 · XML',
    titulo: 'Lector del horario del grupo', clase: 'HorarioDOM.java',
    descripcion:
      'Lee el horario semanal del grupo desde XML y lo presenta ordenado por día y hora recorriendo el árbol DOM.',
    tecnicas: ['getElementsByTagName', 'TreeMap para ordenar', 'Navegación DOM'],
    pdfSolucion: 'pdf/AD-UT1-B3-Soluciones-XML.pdf',
  },
  {
    id: 'u1-b3-e6', unidad: 'ut1', bloque: 'B3 · XML',
    titulo: 'Conversor de catálogo de cursos CSV → XML', clase: 'CursosCsvAXml.java',
    descripcion:
      'Conversión entre formatos (CE1.e): lee un catálogo CSV de cursos y genera el XML equivalente con DOM + Transformer.',
    tecnicas: ['Lectura CSV', 'Generación DOM', 'Conversión entre formatos'],
    pdfSolucion: 'pdf/AD-UT1-B3-Soluciones-XML.pdf',
  },
  {
    id: 'u1-b3-e7', unidad: 'ut1', bloque: 'B3 · XML',
    titulo: 'Revisión de caducidades del botiquín', clase: 'BotiquinXML.java',
    descripcion:
      'Detecta medicamentos caducados o a punto de caducar combinando lectura DOM y análisis SAX sobre el inventario XML.',
    tecnicas: ['DOM + SAX combinados', 'Comparación de fechas', 'Filtros por atributo'],
    pdfSolucion: 'pdf/AD-UT1-B3-Soluciones-XML.pdf',
  },

  // ---------- UT2 · Bloque 1: JDBC ----------
  {
    id: 'u2-b1-e1', unidad: 'ut2', bloque: 'B1 · JDBC', duracion: '45 min',
    titulo: 'CLI interactivo de inventario', clase: 'InventarioCLI.java',
    descripcion:
      'Aplicación de consola contra MySQL 8: añadir artículos devolviendo el ID autogenerado, listar en tabla ASCII y actualizar stock por ID.',
    tecnicas: ['PreparedStatement', 'RETURN_GENERATED_KEYS', 'executeUpdate vs executeQuery', 'BigDecimal'],
    pdfSolucion: 'pdf/AD-UT2-B1-Soluciones-JDBC.pdf',
  },
  {
    id: 'u2-b1-e2', unidad: 'ut2', bloque: 'B1 · JDBC', duracion: '55 min',
    titulo: 'Transacción bancaria con savepoints y auditoría', clase: 'TransaccionSavepoint.java',
    descripcion:
      'Transferencia que, si el saldo no alcanza, hace rollback a un Savepoint para no mover dinero pero registra el intento fallido en una tabla de auditoría InnoDB.',
    tecnicas: ['setAutoCommit(false)', 'Savepoint + rollback parcial', 'Auditoría de fallos', 'commit/rollback'],
    pdfSolucion: 'pdf/AD-UT2-B1-Soluciones-JDBC.pdf',
  },

  // ---------- UT2 · Bloque 2: Patrones y pool ----------
  {
    id: 'u2-b2-e1', unidad: 'ut2', bloque: 'B2 · Patrones y pool', duracion: '40 min',
    titulo: 'Pool HikariCP con detección de fugas', clase: 'DeteccionFugas.java',
    descripcion:
      'Configura maximumPoolSize=5, connectionTimeout=10000 y leakDetectionThreshold=5000, olvida un conn.close() a propósito y observa cómo HikariCP señala la línea exacta de la fuga.',
    tecnicas: ['HikariConfig / HikariDataSource', 'leakDetectionThreshold', 'Connection leaks'],
    pdfSolucion: 'pdf/AD-UT2-B2-Soluciones-Patrones-Pool.pdf',
  },
  {
    id: 'u2-b2-e2', unidad: 'ut2', bloque: 'B2 · Patrones y pool', duracion: '60 min',
    titulo: 'Capa de persistencia DAO/DTO con transacciones inyectadas', clase: 'PersistenciaDAO.java',
    descripcion:
      'Capa DAO completa para Cliente y Factura: el servicio emitirFactura() crea el cliente si no existe y registra su primera factura en una sola transacción sobre InnoDB.',
    tecnicas: ['Interfaz DAO + implementación JDBC', 'Records DTO', 'DataSource inyectado', 'Transacción compartida pasando la Connection'],
    pdfSolucion: 'pdf/AD-UT2-B2-Soluciones-Patrones-Pool.pdf',
  },
];
