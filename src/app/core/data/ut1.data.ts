import { Unidad } from '../models';

export const UT1: Unidad = {
  id: 'ut1',
  numero: 'UT1',
  titulo: 'Manejo de Ficheros',
  subtitulo: 'Texto, binarios y XML en Java: leer, escribir y convertir información persistente',
  ra: 'RA1',
  raTexto:
    'Desarrolla aplicaciones que gestionan información almacenada en ficheros identificando el campo de aplicación de los mismos y utilizando clases específicas.',
  acento: 'cyan',
  pdfApuntes: 'pdf/AD-UT1-Apuntes-Manejo-Ficheros.pdf',
  ces: [
    { codigo: 'CE1.a', texto: 'Usar clases para la gestión de ficheros y directorios.' },
    { codigo: 'CE1.b', texto: 'Valorar ventajas e inconvenientes de las distintas formas de acceso.' },
    { codigo: 'CE1.c', texto: 'Usar clases para recuperar información almacenada en ficheros.' },
    { codigo: 'CE1.d', texto: 'Usar clases para almacenar información en ficheros.' },
    { codigo: 'CE1.e', texto: 'Realizar conversiones entre diferentes formatos de ficheros.' },
    { codigo: 'CE1.f', texto: 'Prever y gestionar las excepciones.' },
    { codigo: 'CE1.g', texto: 'Probar y documentar las aplicaciones desarrolladas.' },
  ],
  ideasClave: [
    'Un fichero es una secuencia de bytes: lo que cambia es cómo los interpretamos (texto/binario) y en qué orden los recorremos (secuencial/aleatorio).',
    'Todo pasa por flujos con búfer y se cierra con try-with-resources.',
    'Texto: charset siempre UTF-8; BufferedReader/Writer, Scanner, PrintWriter y NIO.2 (Files).',
    'Binario: compacto; Data*Stream secuencial, RandomAccessFile aleatorio, serialización para objetos.',
    'XML: DOM (editar), SAX (leer enorme), StAX (buscar y parar), JAXB (objeto ↔ XML).',
    'Una aplicación se termina con excepciones controladas, pruebas JUnit y documentación.',
  ],
  bloques: [
    {
      id: 'ut1-fundamentos',
      titulo: 'Fundamentos comunes',
      descripcion:
        'Cinco ideas que valen para todos los ficheros: qué es un fichero, rutas, flujos, búfer y cierre seguro de recursos.',
      temas: [
        {
          id: 'u1-ficheros-y-acceso',
          titulo: 'Qué es un fichero y formas de acceso',
          puntos: [
            'Un fichero es una secuencia de bytes guardada en un dispositivo con un nombre; para el SO no es más que una tira de bytes.',
            'Ficheros de texto: los bytes representan caracteres legibles según una codificación (.txt, .csv, .xml, .json, .log).',
            'Ficheros binarios: los bytes son la representación de máquina de los datos (un int → 4 bytes, un double → 8). Ocupan menos y se leen más rápido, pero no son legibles.',
            'Acceso secuencial: se lee/escribe del principio al final; para llegar al registro 500 hay que pasar por los 499 anteriores.',
            'Acceso aleatorio: se trata el fichero como un array de bytes y se salta a cualquier posición con un puntero (RandomAccessFile).',
            'La pregunta de diseño: ¿los datos son para una persona o solo para el programa? ¿necesito acceso directo a un registro? (CE1.b).',
          ],
        },
        {
          id: 'u1-path-files',
          titulo: 'Rutas, ficheros y directorios: File, Path y Files',
          puntos: [
            'Nunca escribas rutas a mano con barras de Windows: no serán portables. Constrúyelas con las clases de Java.',
            'Generación clásica: java.io.File. Generación moderna (NIO.2, Java 7): java.nio.file.Path + java.nio.file.Files.',
            'NIO.2 es preferible: cuando algo falla, lanza una excepción que explica el motivo en vez del false silencioso de File.',
            'Path.of(...) solo arma el nombre; nada toca el disco hasta llamar a un método de Files.',
          ],
          tabla: {
            cabecera: ['Instrucción', 'Devuelve', 'Qué hace'],
            filas: [
              ['Path.of("datos", "a.txt")', 'Path', 'Construye la ruta uniendo nombres con el separador del sistema.'],
              ['ruta.resolve("sub")', 'Path', 'Añade un tramo a la ruta.'],
              ['ruta.getFileName() / getParent()', 'Path', 'Nombre del fichero / carpeta que lo contiene.'],
              ['Files.exists(ruta) / isDirectory(ruta)', 'boolean', 'Comprueba si existe / si es una carpeta.'],
              ['Files.createDirectories(ruta)', 'Path', 'Crea toda la cadena de carpetas que falte. No falla si ya existen.'],
              ['Files.createFile(ruta)', 'Path', 'Crea un fichero vacío (falla si ya existe).'],
              ['Files.move(o, d, REPLACE_EXISTING)', 'Path', 'Mueve o renombra un fichero.'],
              ['Files.deleteIfExists(ruta)', 'boolean', 'Borra si existe; devuelve true si lo borró.'],
              ['Files.size(ruta)', 'long', 'Tamaño en bytes.'],
            ],
          },
          fragmentos: [
            {
              fichero: 'GestionDirectorios.java',
              codigo: `Path mes = Path.of("datos", "exportaciones", "2026", "09");

// createDirectories crea TODA la cadena que falte y no protesta si ya existe
Files.createDirectories(mes);

// Crear un fichero dentro, solo si no existe
Path informe = mes.resolve("informe.txt");
if (!Files.exists(informe)) {
    Files.createFile(informe);
}`,
            },
          ],
          trampas: [
            'Confundir Files.createDirectory (singular: solo crea el último nivel y falla si falta un intermedio) con Files.createDirectories (plural: crea toda la cadena). Casi siempre quieres el plural.',
          ],
        },
        {
          id: 'u1-flujos',
          titulo: 'Flujos (streams) de bytes y de caracteres',
          puntos: [
            'Java trata el fichero como un flujo de datos que va del disco al programa (lectura) o del programa al disco (escritura).',
            'Flujos de bytes: InputStream / OutputStream. Para binario: imágenes, .dat, objetos serializados.',
            'Flujos de caracteres: Reader / Writer. Traducen caracteres según una codificación. Para texto.',
            'Las cuatro son clases abstractas: se usan sus hijas (FileReader, FileWriter, FileInputStream, FileOutputStream).',
            'Recuperar datos de un fichero es CE1.c; almacenarlos, CE1.d.',
          ],
        },
        {
          id: 'u1-buffer-decorador',
          titulo: 'Búfer y patrón decorador',
          puntos: [
            'Acceder al disco por cada carácter es carísimo: cada operación pide permiso al sistema operativo.',
            'Búfer: zona de RAM (por defecto 8 KB) que acumula datos y los vuelca al disco en bloques grandes.',
            'Patrón decorador: envolver un flujo básico dentro de otro que le añade funcionalidad (el búfer).',
            'Construcción «en sándwich»: new BufferedReader(new FileReader(...)). El FileReader conecta; el BufferedReader pone el búfer y el método readLine().',
            'Envolver siempre los flujos en su versión Buffered multiplica la velocidad en ficheros grandes.',
          ],
        },
        {
          id: 'u1-try-resources',
          titulo: 'Excepciones de E/S y try-with-resources',
          puntos: [
            'Trabajar con ficheros siempre puede fallar: casi todos los métodos declaran IOException (o hijas como FileNotFoundException, NoSuchFileException). Preverla es CE1.f.',
            'Todo flujo abierto ocupa un descriptor del SO que hay que cerrar sí o sí: si no, pierdes datos del búfer y en Windows el fichero queda bloqueado.',
            'try-with-resources: el recurso se declara entre paréntesis tras el try y Java lo cierra solo al terminar, pase lo que pase.',
            'Señal canónica de fin de fichero en texto: readLine() devuelve null.',
          ],
          fragmentos: [
            {
              fichero: 'PatronSeguro.java',
              codigo: `try (BufferedReader br = new BufferedReader(
        new FileReader("datos/config.txt", StandardCharsets.UTF_8))) {
    String linea;
    while ((linea = br.readLine()) != null) {  // null = fin del fichero
        System.out.println(linea);
    }
} catch (IOException e) {                      // prevemos el fallo de E/S
    System.err.println("No se pudo leer: " + e.getMessage());
}
// Al salir del try, el BufferedReader ya está cerrado`,
              nota: 'Este patrón try (recurso) { ... } catch (IOException e) { ... } es el esqueleto de casi toda la unidad.',
            },
          ],
          trampas: [
            'Cerrar el flujo a mano en un finally, o no cerrarlo: si el fichero de salida queda a 0 KB o incompleto, casi siempre faltó el cierre (y con él, el vaciado del búfer).',
          ],
        },
      ],
    },
    {
      id: 'ut1-b1',
      titulo: 'Bloque 1 · Ficheros de texto (java.io y NIO.2)',
      descripcion:
        'Leer y escribir línea a línea, no romper las tildes con el charset, leer por campos con Scanner, escribir con printf y la API moderna NIO.2.',
      temas: [
        {
          id: 'u1-linea-a-linea',
          titulo: 'Leer y escribir texto línea a línea',
          puntos: [
            'Herramienta básica: BufferedReader (lectura) y BufferedWriter (escritura) sobre FileReader / FileWriter.',
            'Se lee con readLine() hasta que devuelve null; se escribe con write(String) seguido de newLine().',
            'Los dos flujos se pueden abrir en el mismo try-with-resources separados por ; y se cierran solos.',
          ],
          fragmentos: [
            {
              fichero: 'CopiaMayusculas.java',
              codigo: `try (BufferedReader br = new BufferedReader(
         new FileReader("datos/origen.txt", StandardCharsets.UTF_8));
     BufferedWriter bw = new BufferedWriter(
         new FileWriter("datos/destino.txt", StandardCharsets.UTF_8))) {
    String linea;
    while ((linea = br.readLine()) != null) {
        bw.write(linea.toUpperCase());
        bw.newLine();   // salto de línea portable
    }
} catch (IOException e) {
    System.err.println("Error de E/S: " + e.getMessage());
}`,
            },
          ],
          trampas: ['Olvidar bw.newLine(): el fichero de salida queda con todas las líneas concatenadas. Es el fallo nº 1 al escribir texto.'],
        },
        {
          id: 'u1-charsets',
          titulo: 'Codificación de caracteres (charsets)',
          puntos: [
            'En memoria Java guarda los caracteres en UTF-16; en disco son bytes. La tabla que traduce entre ambos es el charset.',
            'ASCII: 7 bits, 128 caracteres, sin tildes ni ñ. ISO-8859-1 / Windows-1252: 8 bits, históricos en Windows europeo.',
            'UTF-8: longitud variable (1-4 bytes), estándar de la industria, compatible con ASCII.',
            'Escribir con un charset y leer con otro produce Mojibake: año → aÃ±o. Convertir entre codificaciones es CE1.e.',
            'Puentes InputStreamReader / OutputStreamWriter: traducen entre bytes y caracteres indicando la tabla.',
            'Regla de oro: indica siempre el charset explícito (StandardCharsets.UTF_8). new FileReader("a.txt") sin charset usa la codificación por defecto de la máquina, distinta en Windows y Linux.',
          ],
          fragmentos: [
            {
              fichero: 'ConversorCharset.java',
              codigo: `// Leemos en ISO-8859-1 (fichero antiguo) y escribimos en UTF-8
try (BufferedReader br = new BufferedReader(new InputStreamReader(
         new FileInputStream("datos/legado.txt"), StandardCharsets.ISO_8859_1));
     BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(
         new FileOutputStream("datos/moderno.txt"), StandardCharsets.UTF_8))) {
    String linea;
    while ((linea = br.readLine()) != null) {
        bw.write(linea);
        bw.newLine();
    }
}`,
            },
          ],
        },
        {
          id: 'u1-scanner',
          titulo: 'Lectura por tokens con Scanner',
          puntos: [
            'Scanner lee tokens separados por un delimitador y los devuelve ya convertidos: next(), nextInt(), nextDouble()...',
            'Muy cómodo para CSV: un Scanner recorre las líneas y, por cada una, un segundo Scanner la trocea por «;».',
            'useDelimiter(";") fija el separador de campos.',
            'useLocale(Locale.US) es clave: sin él, con configuración española nextDouble() espera 7,50 con coma y falla con 750.50.',
          ],
          fragmentos: [
            {
              fichero: 'LeerCSVScanner.java',
              codigo: `try (Scanner lector = new Scanner(new File("datos/productos.csv"),
                                  StandardCharsets.UTF_8)) {
    lector.nextLine();                       // saltamos la cabecera
    while (lector.hasNextLine()) {
        String linea = lector.nextLine();
        try (Scanner campos = new Scanner(linea)) {
            campos.useDelimiter(";");
            campos.useLocale(Locale.US);     // precios con punto decimal
            String ref   = campos.next();
            String desc  = campos.next();
            double precio = campos.nextDouble();
            int uds       = campos.nextInt();
        }
    }
}`,
            },
          ],
          trampas: [
            'Usar un solo Scanner con useDelimiter(";") para todo el fichero: el salto de línea no es «;», así que el último campo de una fila se pegaría al primero de la siguiente.',
          ],
        },
        {
          id: 'u1-printwriter',
          titulo: 'Escritura con formato: PrintWriter',
          puntos: [
            'Para texto bien presentado (facturas, informes con columnas): PrintWriter añade print(), println() y printf().',
            'Máscaras: %-22s (cadena a la izquierda en 22 huecos), %9.2f (decimal con 2 decimales a la derecha), %5d (entero), %n (salto portable).',
            'Peculiaridad: PrintWriter NO lanza IOException al escribir; se la traga. Hay que preguntar con checkError().',
          ],
          fragmentos: [
            {
              fichero: 'Factura.java',
              codigo: `try (PrintWriter pw = new PrintWriter(new BufferedWriter(
        new FileWriter("datos/factura.txt", StandardCharsets.UTF_8)))) {
    pw.printf("%-9s %-22s %9s %5s%n", "REF", "DESCRIPCIÓN", "PRECIO", "UDS");
    pw.printf("%-9s %-22s %8.2f€ %5d%n", "PORT-01", "Portátil 15\\"", 750.50, 2);
    if (pw.checkError()) {   // PrintWriter no lanza IOException
        System.err.println("Hubo un error al escribir.");
    }
}`,
            },
          ],
        },
        {
          id: 'u1-nio2-files',
          titulo: 'Texto con NIO.2: Files y StandardOpenOption',
          puntos: [
            'Para ficheros pequeños o medianos, NIO.2 lo resuelve en una línea con la clase Files.',
            'Files.writeString(ruta, texto): escribe todo (crea o sobrescribe), UTF-8 por defecto.',
            'Files.writeString(ruta, t, StandardOpenOption.APPEND): añade al final en vez de sobrescribir.',
            'Files.readString(ruta) lee todo a un String; Files.readAllLines(ruta) a una List<String>.',
            'Files.newBufferedReader(ruta, cs): abre un BufferedReader ya montado, con charset.',
          ],
          trampas: [
            'Files.readString() carga el fichero entero en memoria: con un fichero de varios GB provoca OutOfMemoryError. Para eso está Files.lines().',
          ],
        },
        {
          id: 'u1-files-lines',
          titulo: 'Ficheros grandes con Files.lines() y streams',
          puntos: [
            'Files.lines() devuelve un Stream<String> perezoso: lee las líneas una a una a medida que hacen falta, sin cargarlas todas.',
            'Sobre el stream se encadenan filter, map, count, collect... Memoria constante para ficheros de cualquier tamaño.',
            'Files.lines() mantiene el canal abierto mientras el stream viva: hay que cerrarlo con try-with-resources.',
          ],
          fragmentos: [
            {
              fichero: 'AnalisisLog.java',
              codigo: `try (Stream<String> lineas = Files.lines(log)) {   // ¡cerrar el stream!
    List<String> errores = lineas
            .filter(l -> l.contains("[ERROR]"))
            .toList();
    Files.write(Path.of("datos", "alertas.txt"), errores);
}

// Contar líneas por nivel con map + groupingBy
try (Stream<String> lineas = Files.lines(log)) {
    Map<String, Long> porNivel = lineas
            .map(l -> l.substring(l.indexOf('[') + 1, l.indexOf(']')))
            .collect(Collectors.groupingBy(n -> n, TreeMap::new,
                                           Collectors.counting()));
}`,
            },
          ],
          trampas: [
            'No cerrar el Stream de Files.lines(): como implementa AutoCloseable, si no va en el try(...) el fichero queda bloqueado en Windows y no se puede borrar ni renombrar.',
            'Los 4 fallos del bloque: no indicar charset (tildes rotas), olvidar newLine() (todo pegado), readString() en ficheros enormes (OutOfMemoryError) y no cerrar Files.lines().',
          ],
        },
        {
          id: 'u1-comparativa-texto',
          titulo: 'Comparativa: cuándo usar cada herramienta de texto',
          puntos: [],
          tabla: {
            cabecera: ['Herramienta', 'Úsala para', 'Cuidado'],
            filas: [
              ['BufferedReader / BufferedWriter', 'Leer/escribir línea a línea, control fino.', 'Verboso; recuerda el charset y newLine().'],
              ['Scanner', 'Leer campos de un CSV ya convertidos a su tipo.', 'Configura useLocale para los decimales.'],
              ['PrintWriter', 'Escribir informes con formato (printf).', 'No lanza IOException: usa checkError().'],
              ['Files.readString / writeString', 'Ficheros pequeños/medianos de una vez.', 'No apto para ficheros enormes.'],
              ['Files.lines()', 'Ficheros enormes en streaming.', 'Ciérralo con try-with-resources.'],
            ],
          },
        },
      ],
    },
    {
      id: 'ut1-b2',
      titulo: 'Bloque 2 · Ficheros binarios y serialización',
      descripcion:
        'Datos tipados con Data*Stream, fin de fichero con EOFException, acceso aleatorio con RandomAccessFile y objetos completos con serialización.',
      temas: [
        {
          id: 'u1-dataoutput',
          titulo: 'Escribir datos tipados: DataOutputStream',
          puntos: [
            'El texto es ineficiente para datos numéricos: 2147483647 en texto ocupa 10 caracteres; en binario, 4 bytes exactos y sin parsear.',
            'DataOutputStream decora un flujo de bytes y escribe tipos primitivos en formato de máquina, siempre con el mismo tamaño.',
            'Cada registro se escribe siempre en el mismo orden de tipos.',
          ],
          tabla: {
            cabecera: ['Método', 'Bytes', 'Qué escribe'],
            filas: [
              ['writeInt(int)', '4', 'Un entero de 32 bits.'],
              ['writeDouble(double)', '8', 'Un decimal de 64 bits (IEEE 754).'],
              ['writeBoolean(boolean)', '1', '0x01 si true, 0x00 si false.'],
              ['writeUTF(String)', '2 + N', '2 bytes con la longitud + los N bytes del texto en UTF-8.'],
            ],
          },
          fragmentos: [
            {
              fichero: 'GuardarSensores.java',
              codigo: `File f = new File("datos/telemetria.dat");
try (DataOutputStream dos = new DataOutputStream(
        new BufferedOutputStream(new FileOutputStream(f)))) {
    // Cada sensor: id + nombre + temperatura + alarma
    dos.writeInt(101); dos.writeUTF("Caldera Central");
    dos.writeDouble(84.5); dos.writeBoolean(false);
} catch (IOException e) {
    System.err.println("Error: " + e.getMessage());
}
// El tamaño se consulta DESPUÉS de cerrar: antes, parte sigue en el búfer
System.out.println("Tamaño: " + f.length() + " bytes");`,
            },
          ],
          trampas: [
            'Consultar f.length() dentro del try, antes de cerrar: con búfer, el fichero aún no tiene todos los bytes y el tamaño sale mal (o 0).',
          ],
        },
        {
          id: 'u1-datainput',
          titulo: 'Leer datos tipados: DataInputStream y EOFException',
          puntos: [
            'DataInputStream lee en el mismo orden en que se escribió: readInt(), readUTF(), readDouble(), readBoolean().',
            '¿Cómo saber que llegamos al final? readLine() devolvía null, pero readInt() devuelve un entero y -1 podría ser un dato válido.',
            'Al leer más allá del final, estos métodos lanzan EOFException: el patrón canónico es un bucle infinito que se corta al capturarla.',
            'La EOFException no es un error: es la señal de fin. Se captura fuera del bucle (CE1.f aplicado a binario).',
          ],
          fragmentos: [
            {
              fichero: 'LeerSensores.java',
              codigo: `try (DataInputStream dis = new DataInputStream(
        new BufferedInputStream(new FileInputStream(f)))) {
    while (true) {                 // bucle infinito controlado por EOF
        int id = dis.readInt();
        String nombre = dis.readUTF();
        double temp = dis.readDouble();
        boolean alarma = dis.readBoolean();
        total++;
    }
} catch (EOFException e) {
    System.out.println("Fin del fichero: " + total + " sensores.");
} catch (IOException e) {
    System.err.println("Error: " + e.getMessage());
}`,
            },
          ],
          trampas: [
            'Leer en distinto orden del que se escribió (readDouble() antes que readInt()): el puntero lee bytes desfasados y salen números sin sentido o una UTFDataFormatException. El orden de lectura debe ser idéntico al de escritura.',
          ],
        },
        {
          id: 'u1-raf',
          titulo: 'Acceso aleatorio: RandomAccessFile',
          puntos: [
            'RandomAccessFile (RAF) trata el fichero como un array de bytes y permite mover un puntero a cualquier posición con seek().',
            'Permite modificar el registro 500 sin tocar los otros 499: es el acceso aleatorio del criterio CE1.b.',
            'Registros de longitud fija: si todos miden lo mismo, la posición de cualquiera se calcula multiplicando: inicio del registro i = i * TAMAÑO.',
            'Modo "r" = solo lectura; "rw" = lectura/escritura. getFilePointer() da la posición actual; length() / setLength(n) el tamaño.',
          ],
          fragmentos: [
            {
              fichero: 'AlmacenRAF.java',
              codigo: `static final int TAM = 36;          // tamaño fijo de cada registro
static final int OFF_SALARIO = 28;  // desplazamiento del salario en el registro

try (RandomAccessFile raf = new RandomAccessFile(f, "rw")) {
    long offset = (1L * TAM) + OFF_SALARIO;
    raf.seek(offset);            // saltamos directo al salario del registro 1
    raf.writeDouble(2350.0);     // pisamos solo esos 8 bytes
}`,
              nota: 'Con seek() saltamos a los 8 bytes del salario y los sobrescribimos sin tocar el resto: imposible con flujos secuenciales.',
            },
          ],
          trampas: [
            'Guardar texto con writeUTF() (tamaño variable) en registros fijos: en cuanto un texto mide distinto, los registros se desalinean y todas las fórmulas de seek() fallan. Para registros fijos se usa writeChars() rellenando a longitud constante.',
          ],
        },
        {
          id: 'u1-serializacion',
          titulo: 'Serialización de objetos',
          puntos: [
            'Serializar = convertir un objeto vivo de la RAM en una secuencia de bytes; deserializar = reconstruirlo.',
            'Tres requisitos: la clase implementa Serializable (interfaz marcadora, sin métodos), declara private static final long serialVersionUID = 1L, y los campos sensibles se marcan transient.',
            'Un campo transient no se guarda: al leer, vuelve a su valor por defecto (null, 0). Ideal para contraseñas y tokens (RGPD).',
            'readObject() devuelve un Object genérico: hay que hacer cast.',
            'Sin serialVersionUID, al cambiar la clase no podrás leer los ficheros antiguos (InvalidClassException).',
          ],
          fragmentos: [
            {
              fichero: 'Usuario.java',
              codigo: `public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    private int id;
    private String nombre;
    private transient String token;   // NO se guarda en disco
}`,
            },
            {
              fichero: 'Serializacion.java',
              codigo: `try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(f))) {
    oos.writeObject(new Usuario(1, "Elena", "SECRETO-123"));
}
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(f))) {
    Usuario u = (Usuario) ois.readObject();   // hace falta el cast
    // u.token sale null: era transient
} catch (IOException | ClassNotFoundException e) { /* ... */ }`,
            },
          ],
        },
        {
          id: 'u1-append-objetos',
          titulo: 'Añadir objetos a un fichero existente',
          puntos: [
            'Al crear un ObjectOutputStream, su constructor escribe una cabecera mágica de 4 bytes (0xACED0005).',
            'Si abres en modo append y creas otro ObjectOutputStream, escribe una segunda cabecera en mitad del fichero.',
            'Al leer, tras el primer objeto el lector encuentra esa cabecera donde esperaba un objeto: StreamCorruptedException: invalid type code: AC.',
            'Solución de la industria: subclase que sobrescribe writeStreamHeader() con cuerpo vacío. Se usa la normal la primera vez y la subclase cuando el fichero ya tiene datos.',
          ],
          fragmentos: [
            {
              fichero: 'MiObjectOutputStream.java',
              codigo: `public class MiObjectOutputStream extends ObjectOutputStream {
    public MiObjectOutputStream(OutputStream out) throws IOException { super(out); }
    @Override
    protected void writeStreamHeader() {
        // Vacío: la cabecera 0xACED0005 ya está al principio del fichero
    }
}`,
            },
            {
              fichero: 'AnadirUsuario.java',
              codigo: `boolean existe = f.exists() && f.length() > 0;
try (FileOutputStream fos = new FileOutputStream(f, true);   // true = append
     ObjectOutputStream oos = existe
             ? new MiObjectOutputStream(fos)   // ya hay cabecera: no repetir
             : new ObjectOutputStream(fos)) {  // fichero nuevo: cabecera normal
    oos.writeObject(u);
}`,
            },
          ],
        },
        {
          id: 'u1-comparativa-binario',
          titulo: 'Comparativa: las tres formas de binario',
          puntos: [],
          tabla: {
            cabecera: ['Herramienta', 'Acceso', 'Úsala para'],
            filas: [
              ['DataOutputStream / DataInputStream', 'Secuencial', 'Guardar muchos registros de tipos primitivos, compactos.'],
              ['RandomAccessFile', 'Aleatorio', 'Modificar o consultar un registro concreto sin recorrer el resto.'],
              ['ObjectOutputStream / ObjectInputStream', 'Secuencial', 'Guardar objetos completos con todos sus atributos.'],
            ],
          },
          trampas: [
            'Lo que más falla: leer en distinto orden del que se escribió; medir el fichero antes de cerrar; texto variable en registros fijos de RAF; append de objetos con ObjectOutputStream normal; omitir serialVersionUID.',
          ],
        },
      ],
    },
    {
      id: 'ut1-b3',
      titulo: 'Bloque 3 · Ficheros XML (DOM, SAX, StAX y JAXB)',
      descripcion:
        'El formato estándar para intercambiar datos entre empresas: cuatro tecnologías Java, cada una para una necesidad distinta.',
      temas: [
        {
          id: 'u1-xml-fundamentos',
          titulo: 'Fundamentos de XML y modelos de procesamiento',
          puntos: [
            'XML organiza la información en etiquetas anidadas con atributos y texto; todo cuelga de una única etiqueta raíz.',
            'La primera línea es el prólogo (versión y codificación). Un XML bien formado cierra todas sus etiquetas y las anida correctamente.',
            'Estándar de intercambio: Facturae (facturación electrónica), SEPA (banca), servicios web, configuraciones.',
            'La primera decisión (qué modelo usar) es el criterio CE1.b aplicado a XML.',
          ],
          fragmentos: [
            {
              fichero: 'catalogo.xml',
              lenguaje: 'xml',
              codigo: `<?xml version="1.0" encoding="UTF-8"?>
<catalogo>
    <producto id="P101">
        <nombre>Disco SSD 1TB</nombre>
        <precio>79.99</precio>
    </producto>
</catalogo>`,
            },
          ],
          tabla: {
            cabecera: ['Modelo', 'Cómo trabaja', 'Cuándo usarlo'],
            filas: [
              ['DOM', 'Carga el árbol entero en RAM; se navega y modifica.', 'XML pequeños/medianos que hay que consultar o cambiar.'],
              ['SAX', 'Lee por eventos, hacia adelante, sin cargar en memoria (push).', 'XML gigantes, solo lectura.'],
              ['StAX', 'Lee por cursor que tú controlas y puedes parar (pull).', 'XML grandes donde buscas algo concreto.'],
              ['JAXB', 'Mapea etiquetas a objetos con anotaciones, sin tocar nodos.', 'Convertir objetos ↔ XML automáticamente.'],
            ],
          },
        },
        {
          id: 'u1-dom',
          titulo: 'Leer y modificar XML con DOM',
          puntos: [
            'DOM carga todo el XML en memoria como un árbol de nodos: Document, Element (etiquetas), texto y atributos.',
            'Permite navegar en cualquier dirección y modificar valores: subir precios un 10% en memoria y volcarlo después.',
            'doc.getElementsByTagName("producto") devuelve la NodeList de esas etiquetas.',
            'elem.getAttribute("id") lee un atributo; getTextContent() / setTextContent() el texto.',
            'El filtro nodo.getNodeType() == Node.ELEMENT_NODE es OBLIGATORIO al recorrer hijos.',
          ],
          fragmentos: [
            {
              fichero: 'SubirPrecios.java',
              codigo: `Document doc = DocumentBuilderFactory.newInstance()
        .newDocumentBuilder().parse(new File("datos/catalogo.xml"));
doc.getDocumentElement().normalize();

NodeList productos = doc.getElementsByTagName("producto");
for (int i = 0; i < productos.getLength(); i++) {
    Node nodo = productos.item(i);
    if (nodo.getNodeType() == Node.ELEMENT_NODE) {   // ignora los #text
        Element prod = (Element) nodo;
        Element precio = (Element) prod.getElementsByTagName("precio").item(0);
        double nuevo = Double.parseDouble(precio.getTextContent()) * 1.10;
        precio.setTextContent(String.format(Locale.US, "%.2f", nuevo));
    }
}`,
            },
          ],
          trampas: [
            'Los nodos #text: los saltos de línea y sangrías entre etiquetas se leen como nodos de texto. Si haces el cast a (Element) sin comprobar ELEMENT_NODE antes, salta ClassCastException. Es la trampa nº 1 de DOM.',
          ],
        },
        {
          id: 'u1-dom-crear',
          titulo: 'Crear XML con DOM y guardarlo con Transformer',
          puntos: [
            'Se construye un documento vacío, se crean elementos con doc.createElement() y se enganchan con appendChild().',
            'Los elementos no se crean con new Element(): los fabrica el documento.',
            'Para volcar a disco con sangría legible se usa un Transformer con OutputKeys.INDENT = "yes" e indent-amount.',
            'Generar XML es almacenar información (CE1.d) y, si el origen era otro formato, una conversión (CE1.e).',
          ],
          fragmentos: [
            {
              fichero: 'CrearXML.java',
              codigo: `Document doc = DocumentBuilderFactory.newInstance()
        .newDocumentBuilder().newDocument();
Element raiz = doc.createElement("alumnos");
doc.appendChild(raiz);

Element alumno = doc.createElement("alumno");
alumno.setAttribute("expediente", "EXP-01");
Element nombre = doc.createElement("nombre");
nombre.setTextContent("Lucía Álvarez");
alumno.appendChild(nombre);
raiz.appendChild(alumno);

// Volcado a disco con sangría de 4 espacios
Transformer tf = TransformerFactory.newInstance().newTransformer();
tf.setOutputProperty(OutputKeys.INDENT, "yes");
tf.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
tf.transform(new DOMSource(doc), new StreamResult(new File("datos/alumnos.xml")));`,
            },
          ],
          trampas: ['Si olvidas las propiedades de sangría del Transformer, el XML sale correcto pero en una sola línea ilegible.'],
        },
        {
          id: 'u1-sax',
          titulo: 'Leer XML por eventos con SAX',
          puntos: [
            'SAX lee el documento como una cinta transportadora, de principio a fin, disparando eventos que atiende un DefaultHandler.',
            'Consumo de memoria mínimo y constante, sea el fichero de 1 KB o de 5 GB.',
            'Contrapartida: solo lee hacia adelante, no puede modificar ni volver atrás (push).',
            'startElement(): se limpia el acumulador; characters(): se acumula en un StringBuilder; endElement(): se procesa el texto acumulado.',
          ],
          fragmentos: [
            {
              fichero: 'SumaPreciosSAX.java',
              codigo: `static class Handler extends DefaultHandler {
    StringBuilder buffer = new StringBuilder();
    double suma = 0;
    public void startElement(String u, String l, String q, Attributes a) {
        buffer.setLength(0);           // nuevo texto: vaciamos el acumulador
    }
    public void characters(char[] ch, int start, int len) {
        buffer.append(ch, start, len); // puede llegar en varios trozos
    }
    public void endElement(String u, String l, String q) {
        if (q.equalsIgnoreCase("precio")) {
            suma += Double.parseDouble(buffer.toString().trim());
        }
    }
}`,
            },
          ],
          trampas: [
            'Hacer parseDouble() directamente dentro de characters(): el parser puede trocear el texto de una etiqueta en varias llamadas; hay que acumular en un StringBuilder y procesar en endElement().',
          ],
        },
        {
          id: 'u1-stax',
          titulo: 'Leer XML en streaming con StAX',
          puntos: [
            'En SAX es el parser quien te empuja los eventos (no puedes pararlo); StAX te da el control: tú pides el siguiente evento con next() en un bucle y puedes parar cuando quieras (pull).',
            'Ideal para buscar un dato concreto en un XML grande sin leerlo entero: salida anticipada.',
            'Métodos: hasNext()/next(), getLocalName(), getAttributeValue(null, "id"), getText(), isWhiteSpace().',
            'Comparar SAX (push) frente a StAX (pull) y elegir es criterio CE1.b.',
            'XMLStreamReader NO es AutoCloseable: hay que cerrarlo a mano con r.close().',
          ],
          fragmentos: [
            {
              fichero: 'BuscarStAX.java',
              codigo: `XMLStreamReader r = XMLInputFactory.newInstance().createXMLStreamReader(in);
while (r.hasNext() && !encontrado) {       // paramos en cuanto lo hallamos
    int evento = r.next();
    if (evento == XMLStreamConstants.START_ELEMENT) {
        etiqueta = r.getLocalName();
        if (etiqueta.equals("producto"))
            dentro = idBuscado.equals(r.getAttributeValue(null, "id"));
    } else if (evento == XMLStreamConstants.CHARACTERS && dentro && !r.isWhiteSpace()) {
        if (etiqueta.equals("nombre"))
            System.out.println("Encontrado: " + r.getText());
    } else if (evento == XMLStreamConstants.END_ELEMENT
               && r.getLocalName().equals("producto") && dentro) {
        encontrado = true;                 // salida anticipada
    }
}
r.close();   // XMLStreamReader NO es AutoCloseable`,
            },
          ],
          trampas: [
            'Guardar el texto de todos los eventos CHARACTERS sin comprobar isWhiteSpace(), y olvidar r.close(): XMLStreamReader no es AutoCloseable, hay que cerrarlo a mano.',
          ],
        },
        {
          id: 'u1-jaxb',
          titulo: 'Mapeo objeto-XML con JAXB',
          puntos: [
            'JAXB (Jakarta XML Binding) automatiza la conversión: anotas una clase POJO y convierte objeto ↔ XML por ti.',
            'Marshalling = objeto → XML; unmarshalling = XML → objeto.',
            'Anotaciones: @XmlRootElement(name=...) marca la raíz; @XmlAttribute guarda el campo como atributo; @XmlElement como etiqueta hija.',
            'La clase necesita un constructor vacío (JAXB instancia por reflexión) y las dependencias de JAXB en el pom.xml.',
          ],
          fragmentos: [
            {
              fichero: 'Curso.java',
              codigo: `@XmlRootElement(name = "curso")
@XmlAccessorType(XmlAccessType.FIELD)
public class Curso {
    @XmlAttribute private String codigo;
    @XmlElement   private String nombre;
    @XmlElement   private int horas;
    public Curso() {}   // constructor vacío OBLIGATORIO para JAXB
}`,
            },
            {
              fichero: 'MapeoJAXB.java',
              codigo: `JAXBContext ctx = JAXBContext.newInstance(Curso.class);
Marshaller m = ctx.createMarshaller();              // objeto -> XML
m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
m.marshal(new Curso("Acceso a Datos", 140, "0486"), f);

Unmarshaller um = ctx.createUnmarshaller();         // XML -> objeto
Curso c = (Curso) um.unmarshal(f);`,
            },
          ],
          trampas: ['Olvidar el constructor vacío public Curso() {}: JAXB no puede instanciar el objeto al leer y falla en ejecución.'],
        },
        {
          id: 'u1-comparativa-xml',
          titulo: 'Comparativa: las cuatro tecnologías XML',
          puntos: [],
          tabla: {
            cabecera: ['Tecnología', 'Memoria', 'Dirección', 'Modifica', 'Ideal para'],
            filas: [
              ['DOM', 'Todo en RAM', 'Libre', 'Sí', 'XML pequeños que hay que editar.'],
              ['SAX', 'Mínima', 'Solo adelante (push)', 'No', 'XML gigantes, leer todo.'],
              ['StAX', 'Mínima', 'Adelante, controlado (pull)', 'No', 'Buscar un dato en un XML grande.'],
              ['JAXB', 'Objeto en RAM', '—', 'Sí (vía objeto)', 'Convertir objetos ↔ XML.'],
            ],
          },
          trampas: [
            'Lo que más falla: cast a (Element) sin filtrar #text; Transformer sin sangría; parseDouble() dentro de characters(); no cerrar XMLStreamReader; falta el constructor vacío en JAXB.',
          ],
        },
      ],
    },
    {
      id: 'ut1-integracion',
      titulo: 'Integración · Aplicación multi-formato',
      descripcion:
        'Un caso real que combina los tres formatos — CSV → binario → XML — y las dos patas del criterio CE1.g: pruebas y documentación.',
      temas: [
        {
          id: 'u1-multiformato',
          titulo: 'Convertir un catálogo entre CSV, binario y XML',
          puntos: [
            'En una aplicación real se combinan formatos: se lee un CSV, se guarda en binario para el día a día y se exporta a XML para intercambiar.',
            'Buena arquitectura: separar el modelo (clase Producto) de los servicios de persistencia (uno por formato).',
            'Cada método del servicio reutiliza una técnica de su bloque: BufferedReader para el CSV, serialización para el binario, DOM + Transformer para el XML.',
          ],
        },
        {
          id: 'u1-pruebas-doc',
          titulo: 'Probar y documentar la aplicación (CE1.g)',
          puntos: [
            'Una aplicación no está terminada cuando «funciona»: lo está cuando se puede comprobar que funciona y otra persona la entiende.',
            'JUnit 5: pruebas que comprueban el resultado automáticamente. Con @TempDir cada prueba crea su propia carpeta temporal para no depender de ficheros reales.',
            'Javadoc: comentarios /** ... */ con @param, @return, @throws que generan documentación navegable.',
            'README.md: qué hace la aplicación, cómo se ejecuta y cómo se prueba.',
          ],
          fragmentos: [
            {
              fichero: 'CatalogoServiceTest.java',
              codigo: `@TempDir Path carpeta;   // JUnit la crea y la borra en cada prueba

@Test
void importaSoloLineasValidas() throws Exception {
    Path csv = carpeta.resolve("p.csv");
    Files.writeString(csv, "REF;NOMBRE;PRECIO\\nA-1;Uno;10.0\\nB-2;Malo;xxx\\n");
    List<Producto> r = new CatalogoService().importarCsv(csv);
    assertEquals(1, r.size());   // la línea con precio "xxx" se descarta
    assertEquals("A-1", r.get(0).getRef());
}`,
            },
          ],
        },
        {
          id: 'u1-que-formato',
          titulo: '¿Qué formato elijo? Guía de decisión',
          puntos: [
            'Ante un problema nuevo pregúntate: ¿quién lee los datos (persona o programa)?, ¿necesito acceso directo a un registro?, ¿voy a intercambiarlos con otro sistema?',
          ],
          tabla: {
            cabecera: ['Necesito…', 'Formato y herramienta'],
            filas: [
              ['Que lo lea una persona o un Excel', 'Texto / CSV con BufferedReader o Scanner.'],
              ['Máxima compactación y velocidad para el programa', 'Binario con DataOutputStream.'],
              ['Modificar un registro concreto sin recorrer el resto', 'Binario con RandomAccessFile.'],
              ['Guardar objetos completos tal cual', 'Serialización con ObjectOutputStream.'],
              ['Intercambiar datos con otra empresa o sistema', 'XML (DOM/JAXB para crear; SAX/StAX para leer grandes).'],
            ],
          },
          trampas: [
            'Obligatorio para que funcione: cerrar recursos con try-with-resources; en binario, leer en el orden que se escribió; en DOM, filtrar los nodos #text.',
            'Muy recomendable: charset UTF-8 explícito; serialVersionUID; flujos Buffered; rutas con Path, nunca con barras a mano.',
          ],
        },
      ],
    },
  ],
};
