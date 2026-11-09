import { Unidad } from '../models';

export const UT2: Unidad = {
  id: 'ut2',
  numero: 'UT2',
  titulo: 'Manejo de Conectores (JDBC y MySQL)',
  subtitulo:
    'Arquitectura JDBC, transacciones ACID, connection pools (HikariCP) y patrones de diseño (Singleton, DTO y DAO)',
  ra: 'RA2',
  raTexto:
    'Desarrolla aplicaciones que gestionan información almacenada en bases de datos relacionales identificando y utilizando mecanismos de conexión.',
  acento: 'violet',
  pdfApuntes: 'pdf/AD-UT2-Apuntes-Manejo-Conectores-JDBC.pdf',
  ces: [
    { codigo: 'CE2.a', texto: 'Ventajas e inconvenientes de los conectores.' },
    { codigo: 'CE2.b', texto: 'Bases embebidas vs. cliente-servidor.' },
    { codigo: 'CE2.c', texto: 'Uso del driver idóneo.' },
    { codigo: 'CE2.d', texto: 'Establecer conexiones.' },
    { codigo: 'CE2.e', texto: 'Definición DDL.' },
    { codigo: 'CE2.f', texto: 'Manipulación DML.' },
    { codigo: 'CE2.g', texto: 'Mapeo de resultados en objetos.' },
    { codigo: 'CE2.h', texto: 'Realizar consultas.' },
    { codigo: 'CE2.i', texto: 'Liberación de recursos.' },
    { codigo: 'CE2.j', texto: 'Transacciones ACID.' },
    { codigo: 'CE2.k', texto: 'Procedimientos almacenados.' },
  ],
  ideasClave: [
    'JDBC es la API estándar (java.sql / javax.sql); el driver del fabricante traduce las llamadas al protocolo nativo del motor.',
    'PreparedStatement siempre: sentencia y valores viajan por separado → adiós inyección SQL.',
    'SELECT → executeQuery() devuelve ResultSet; INSERT/UPDATE/DELETE → executeUpdate() devuelve filas afectadas.',
    'Transacción: setAutoCommit(false) → operaciones → commit(); en el catch, rollback().',
    'HikariCP mantiene conexiones abiertas: conn.close() las devuelve al pool, no cierra el socket.',
    'Tres patrones: Singleton (un solo pool), DTO (records que transportan datos) y DAO (una clase por tabla con todo su SQL).',
  ],
  bloques: [
    {
      id: 'ut2-fundamentos',
      titulo: 'Fundamentos comunes',
      descripcion:
        'La arquitectura conceptual sobre la que descansa JDBC: el desfase objeto-relacional, tipos de motores y el ciclo de vida de una conexión.',
      temas: [
        {
          id: 'u2-desfase',
          titulo: 'Arquitectura JDBC y el desfase objeto-relacional',
          puntos: [
            'Conviven dos paradigmas incompatibles: el orientado a objetos (grafos de objetos en RAM con identidad y herencia) y el relacional (tablas bidimensionales vinculadas por claves).',
            'Esa fricción es el Desfase Objeto-Relacional (Object-Relational Impedance Mismatch): los tipos no coinciden (DATE, DECIMAL vs BigDecimal, el valor NULL...).',
            'JDBC es una API estándar (paquetes java.sql y javax.sql) de interfaces universales; el driver es la implementación del fabricante que traduce al protocolo binario nativo del servidor.',
            'JDBC vs ORM (Hibernate/JPA): JDBC da máximo rendimiento y control total del SQL; el ORM da productividad y portabilidad.',
          ],
          tabla: {
            cabecera: ['Aspecto', 'JDBC directo', 'ORM / JPA'],
            filas: [
              ['Rendimiento', 'Máximo y predecible, sin sobrecargas ocultas.', 'Ligera sobrecarga por serialización y ciclo de vida de entidades.'],
              ['Control del SQL', 'Total: el desarrollador escribe y optimiza cada sentencia.', 'Automático, a veces genera consultas subóptimas (problema N+1).'],
              ['Productividad', 'Menor para CRUDs triviales (mapeo manual).', 'Muy alta para operaciones sencillas de dominio.'],
              ['Portabilidad', 'Depende de ceñirse a SQL estándar.', 'Alta: el dialecto ORM traduce a múltiples motores.'],
            ],
          },
        },
        {
          id: 'u2-motores',
          titulo: 'Gestores embebidos vs. independientes',
          puntos: [
            'Embebidos (in-process): H2, SQLite, Apache Derby. El motor corre dentro de la propia JVM; sin servicio ni puertos TCP.',
            'Ideales para pruebas unitarias (base en memoria: jdbc:h2:mem:testdb), herramientas CLI monousuario o móviles. No toleran concurrencia masiva.',
            'Independientes (client-server): MySQL, PostgreSQL, Oracle. Servicio autónomo que escucha en un socket TCP/IP (MySQL: puerto 3306).',
            'Ofrecen concurrencia masiva, control de acceso por usuario, cachés compartidas (buffer pool de InnoDB) y logs transaccionales (redo log) con transacciones ACID.',
          ],
        },
        {
          id: 'u2-ciclo-conexion',
          titulo: 'Arquitectura JDBC y liberación de recursos',
          puntos: [
            'Cuatro capas: aplicación Java → DriverManager (localiza el driver por la URL) → driver del fabricante (traduce a tramas de red) → servidor de base de datos.',
            'Una conexión no es solo memoria Java: es un socket TCP activo y una sesión con memoria y hilo dedicados en el servidor.',
            'No cerrar conexiones provoca una fuga (connection leak) que agota el max_connections del servidor → error 1040: Too many connections.',
            'Obligatorio: try-with-resources para Connection, Statement/PreparedStatement y ResultSet: las tres implementan AutoCloseable.',
          ],
          trampas: [
            'Confiar en el recolector de basura para cerrar conexiones: la fuga satura MySQL y deniega el servicio completo.',
          ],
        },
      ],
    },
    {
      id: 'ut2-b1',
      titulo: 'Bloque 1 · Conexión y uso de la BD con JDBC',
      descripcion:
        'DriverManager, CRUD con PreparedStatement, ResultSet y la trampa del NULL, CallableStatement, transacciones ACID y metadatos.',
      temas: [
        {
          id: 'u2-drivermanager',
          titulo: 'Driver MySQL y conexión con DriverManager',
          puntos: [
            'El driver oficial es MySQL Connector/J (mysql-connector-j): driver de Tipo 4, 100% Java puro, sin software cliente nativo.',
            'Se incorpora con la dependencia Maven com.mysql : mysql-connector-j.',
            'Estructura de la URL: jdbc:mysql://<host>:<puerto>/<base_de_datos>?<opciones>.',
            'Ejemplo del aula: jdbc:mysql://localhost:3306/dam2_db?useSSL=false&allowPublicKeyRetrieval=true.',
          ],
          fragmentos: [
            {
              fichero: 'pom.xml',
              lenguaje: 'xml',
              codigo: `<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.4.0</version>
</dependency>`,
            },
          ],
        },
        {
          id: 'u2-preparedstatement',
          titulo: 'Operaciones CRUD con PreparedStatement',
          puntos: [
            'CRUD: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). Las cuatro se programan igual: SQL con marcadores ?, conn.prepareStatement(sql), setXxx por cada ?, y ejecutar.',
            'Siempre PreparedStatement y nunca concatenar: con Statement el valor del usuario pasa a formar parte del texto SQL → "1 OR 1=1" puede borrar la tabla entera (inyección SQL).',
            'Con PreparedStatement la sentencia y los valores viajan por separado: cada valor se trata como dato, nunca como código SQL.',
            'Los ? se numeran desde 1, en el orden de la sentencia. Para importes: BigDecimal desde texto (new BigDecimal("74.50")), nunca double.',
            'Clave AUTO_INCREMENT: prepara con Statement.RETURN_GENERATED_KEYS y léela con ps.getGeneratedKeys().',
          ],
          tabla: {
            cabecera: ['Operación', 'Sentencia SQL', 'Método', 'Devuelve'],
            filas: [
              ['C · Alta', 'INSERT INTO productos VALUES (?, ?, ?)', 'executeUpdate()', 'int: filas insertadas; clave con getGeneratedKeys().'],
              ['R · Consulta', 'SELECT ... WHERE id_producto = ?', 'executeQuery()', 'ResultSet con las filas (rs.next() → false = no hay).'],
              ['U · Modificación', 'UPDATE productos SET precio = ? WHERE id = ?', 'executeUpdate()', 'int: 1 si existía, 0 si el WHERE no encontró nada.'],
              ['D · Baja', 'DELETE FROM productos WHERE id = ?', 'executeUpdate()', 'int: 1 si existía, 0 si no.'],
            ],
          },
          fragmentos: [
            {
              fichero: 'CRUD.java',
              codigo: `// C · Alta con recuperación de la clave generada
String sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, nombre);
    ps.setBigDecimal(2, precio);
    ps.setInt(3, stock);
    int filas = ps.executeUpdate();          // 1 fila insertada
    try (ResultSet claves = ps.getGeneratedKeys()) {
        claves.next();
        return claves.getLong(1);            // ID asignado por MySQL
    }
}

// R · Buscar por clave primaria: 0 o 1 fila -> if (listar todo sería while)
try (PreparedStatement ps = conn.prepareStatement(
        "SELECT nombre, precio FROM productos WHERE id_producto = ?")) {
    ps.setLong(1, id);
    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            System.out.println(rs.getString("nombre"));
        }
    }
}`,
            },
          ],
          trampas: [
            'Usar executeQuery() con INSERT/UPDATE/DELETE, o executeUpdate() con SELECT: ambos lanzan SQLException.',
            'Numerar los parámetros desde 0 (setString(0, ...)) o en orden distinto al de los ?.',
            'Leer columnas sin haber llamado antes a rs.next(): el cursor aún no está sobre ninguna fila.',
            'Escribir un UPDATE o DELETE sin WHERE: afecta a todas las filas de la tabla.',
          ],
        },
        {
          id: 'u2-resultset-null',
          titulo: 'ResultSet y la trampa del valor NULL',
          puntos: [
            'El ResultSet es un cursor tabular posicionado antes de la primera fila; next() avanza y devuelve false cuando no quedan.',
            'Las columnas se leen por nombre: getLong(), getString(), getBigDecimal(), getInt()...',
            'TRAMPA: una columna SQL NULL leída con rs.getInt("descuento") devuelve silenciosamente 0. No es lo mismo 0% de descuento que ausencia de descuento.',
            'Solución 1 — patrón wasNull(): justo después del getter, if (rs.wasNull()) { valor = null; }.',
            'Solución 2 — JDBC 4.2: Double desc = rs.getObject("descuento", Double.class) devuelve la referencia null legítima.',
          ],
        },
        {
          id: 'u2-callable',
          titulo: 'CallableStatement y procedimientos almacenados',
          puntos: [
            'En banca y alto rendimiento, parte de la lógica crítica reside compilada dentro del motor (procedimientos con BEGIN ... END): reduce el tráfico de red.',
            'Se invocan con CallableStatement: sintaxis { call sp_resumen_producto(?, ?, ?) }.',
            'Pasos: configurar los parámetros IN con setXxx, registrar los OUT con registerOutParameter(pos, java.sql.Types.X), ejecutar con execute() y leer los OUT con getXxx.',
          ],
          fragmentos: [
            {
              fichero: 'LlamadaSP.java',
              codigo: `String llamada = "{ call sp_resumen_producto(?, ?, ?) }";
try (CallableStatement cs = conn.prepareCall(llamada)) {
    cs.setLong(1, 101L);                          // IN
    cs.registerOutParameter(2, java.sql.Types.DECIMAL);  // OUT
    cs.registerOutParameter(3, java.sql.Types.VARCHAR);  // OUT
    cs.execute();
    BigDecimal precio = cs.getBigDecimal(2);
    String estado = cs.getString(3);
}`,
            },
          ],
        },
        {
          id: 'u2-transacciones',
          titulo: 'Transacciones ACID y Savepoints',
          puntos: [
            'Por defecto autoCommit = true: cada executeUpdate() se confirma de forma automática e irrevocable.',
            'Operaciones compuestas (transferir de la cuenta A a la B) exigen atomicidad: ambas triunfan juntas o fracasan por completo.',
            'Ciclo canónico: conn.setAutoCommit(false) → operaciones → conn.commit(). En el catch: conn.rollback(). En el finally: restaurar setAutoCommit(true).',
            'Savepoint: punto de restauración intermedio (conn.setSavepoint("NOMBRE")) que permite rollback parcial con conn.rollback(sp).',
          ],
          fragmentos: [
            {
              fichero: 'Transferencia.java',
              codigo: `try (Connection conn = dataSource.getConnection()) {
    conn.setAutoCommit(false);        // inicia la frontera transaccional
    try {
        debitarCuenta(conn, ibanOrigen, cantidad);
        Savepoint sp = conn.setSavepoint("SP_AUDITORIA");
        acreditarCuenta(conn, ibanDestino, cantidad);
        conn.commit();                // confirmación definitiva
    } catch (Exception ex) {
        conn.rollback();              // deshacer TODO ante cualquier fallo
        throw ex;
    } finally {
        conn.setAutoCommit(true);
    }
}`,
            },
          ],
        },
        {
          id: 'u2-metadatos',
          titulo: 'DDL e introspección de metadatos',
          puntos: [
            'DatabaseMetaData (conn.getMetaData()): capacidades del gestor y exploración del catálogo: getTables(), getColumns(), getPrimaryKeys().',
            'ResultSetMetaData (rs.getMetaData()): estructura de una consulta concreta en ejecución: getColumnCount(), getColumnLabel(), getColumnTypeName(), isNullable().',
            'En MySQL «esquema» y «base de datos» son sinónimos y JDBC los expone como catálogo: dmd.getTables(conn.getCatalog(), null, "%", new String[]{"TABLE"}).',
          ],
        },
      ],
    },
    {
      id: 'ut2-b2',
      titulo: 'Bloque 2 · Patrones de diseño y connection pools',
      descripcion:
        'El código SQL jamás se dispersa: pools con HikariCP, un único DataSource con Singleton, datos viajando en DTOs (records) y todo el SQL en el DAO.',
      temas: [
        {
          id: 'u2-pool',
          titulo: 'Pools de conexiones con HikariCP',
          puntos: [
            'Abrir una conexión física con DriverManager cuesta entre 10 y 100 ms: handshake TCP, autenticación, memoria de sesión e hilo en el servidor.',
            'Un Connection Pool (interfaz javax.sql.DataSource) mantiene conexiones físicas permanentemente abiertas y las presta.',
            'HikariCP: el pool más rápido del ecosistema Java (por defecto en Spring Boot). getConnection() tarda menos de 0,05 ms.',
            'conn.close() en una conexión del pool NO destruye el socket: el proxy lo intercepta y devuelve la conexión a la piscina.',
            'Ajuste profesional: maximumPoolSize, minimumIdle, connectionTimeout, idleTimeout y leakDetectionThreshold (alerta si un hilo retiene una conexión sin cerrarla).',
          ],
          fragmentos: [
            {
              fichero: 'ConfigHikari.java',
              codigo: `HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:mysql://localhost:3306/dam2_db");
config.setUsername("dam2_user");
config.setPassword("dam2_pass");
config.setMaximumPoolSize(10);          // máximo 10 conexiones físicas
config.setMinimumIdle(5);               // mantiene 5 conexiones calientes
config.setConnectionTimeout(30000);     // espera máxima de 30 s
config.setIdleTimeout(600000);          // cierra inactivas tras 10 min
config.setLeakDetectionThreshold(5000); // avisa si retienes una conexión > 5 s
HikariDataSource dataSource = new HikariDataSource(config);`,
            },
          ],
        },
        {
          id: 'u2-singleton',
          titulo: 'Patrón Singleton: un único pool para toda la aplicación',
          puntos: [
            'Un Singleton es una clase de la que solo puede existir un objeto, y todo el programa usa ese mismo objeto.',
            'Problema que resuelve: si cada DAO creara su propio pool, las conexiones se multiplicarían hasta el error 1040.',
            'Tres ingredientes: ① constructor private, ② atributo static final con la única instancia, ③ método static público de acceso.',
            'Singleton de Bill Pugh (Holder): la instancia vive en una clase interna; Java la crea perezosamente la primera vez y garantiza una única creación entre hilos, sin if ni synchronized.',
            'La versión clásica con getInstance() e if (instancia == null) necesita synchronized para ser segura entre hilos.',
          ],
          fragmentos: [
            {
              fichero: 'DataSourceProvider.java',
              codigo: `public final class DataSourceProvider {
    private DataSourceProvider() { }            // ① nadie puede hacer new

    private static class Holder {               // Singleton de Bill Pugh
        private static final DataSource INSTANCE = crearPool();  // ②
    }

    public static DataSource get() {            // ③ única puerta de entrada
        return Holder.INSTANCE;
    }
}`,
              nota: 'DataSourceProvider.get() siempre devuelve el mismo pool: ds1 == ds2 → true.',
            },
          ],
          trampas: [
            'Escribir new HikariDataSource(config) dentro de un DAO o de cada método: crea un pool nuevo en cada llamada.',
            'Dejar el constructor public: cualquiera puede crear otro objeto y ya no es Singleton.',
            'Singleton clásico con if (instancia == null) sin synchronized: con varios hilos pueden crearse dos pools.',
          ],
        },
        {
          id: 'u2-dto',
          titulo: 'Patrón DTO con Java records',
          puntos: [
            'Un DTO (Data Transfer Object) es un objeto que solo lleva datos de un sitio a otro: sin lógica, sin SQL, sin saber de la base de datos.',
            'Problema que resuelve: un método solo devuelve una cosa; el ResultSet se cierra al salir del try. Hay que meter la fila en un objeto y devolverlo (CE2.g).',
            'POJO tradicional: ~50 líneas (atributos, constructor, getters, setters, equals, hashCode, toString).',
            'Record (Java 16+): una línea. Java genera atributos private final, constructor, accesores sin get (p.nombre()), equals(), hashCode() y toString().',
            'El record es INMUTABLE: sin setters. Para cambiar un dato se crea un DTO nuevo con los valores nuevos.',
            'Se usan wrappers (Long, Integer) y no primitivos porque pueden valer null: un producto nuevo aún no tiene id (AUTO_INCREMENT) y una columna puede ser NULL.',
          ],
          fragmentos: [
            {
              fichero: 'ProductoDTO.java',
              codigo: `public record ProductoDTO(
        Long id,
        String nombre,
        BigDecimal precio,
        Integer stock) {

    // Constructor extra para productos NUEVOS: el id lo pone MySQL al insertar
    public ProductoDTO(String nombre, BigDecimal precio, Integer stock) {
        this(null, nombre, precio, stock);
    }
}

// «Cambiar» el precio: crear un record nuevo (no hay setters)
ProductoDTO rebajado = new ProductoDTO(p.id(), p.nombre(),
                                       new BigDecimal("29.99"), p.stock());
dao.update(rebajado);`,
            },
          ],
          trampas: [
            'Escribir p.getNombre(): en un record el método se llama igual que el dato: p.nombre().',
            'Meter código que abre conexiones o ejecuta SQL dentro del DTO: el DTO solo transporta; el SQL va en el DAO.',
            'Usar int para el id y no poder representar «todavía no tiene id».',
          ],
        },
        {
          id: 'u2-dao',
          titulo: 'Patrón DAO desacoplado con inyección de DataSource',
          puntos: [
            'Un DAO (Data Access Object) es la clase que contiene TODO el SQL de una tabla; el resto del programa pide cosas sin saber cómo se hacen.',
            'Regla práctica: una tabla, un DAO. Cada DAO son dos piezas: la interfaz (el contrato, QUÉ) y la implementación JDBC (CÓMO).',
            'En la interfaz no aparece nada de java.sql: ni Connection, ni ResultSet, ni SQLException → quien la usa no depende de JDBC.',
            'Inyectar el DataSource = dárselo por el constructor en lugar de que el DAO lo cree: comparte el pool del Singleton y permite cambiar de BD en pruebas.',
            'mapearFila(ResultSet) convierte la fila actual en DTO: un único sitio para la conversión.',
            'La SQLException no sale del DAO: se envuelve en RuntimeException (o DaoException) con mensaje claro.',
            'findById devuelve Optional<ProductoDTO>, nunca null: obliga a decidir qué hacer si no existe.',
            'GenericDAO<T, ID> define el CRUD una sola vez con genéricos: los DAO concretos solo declaran sus tipos.',
          ],
          fragmentos: [
            {
              fichero: 'ProductoDAO.java',
              codigo: `public interface ProductoDAO {
    ProductoDTO create(ProductoDTO prod);        // INSERT (devuelve con id generado)
    Optional<ProductoDTO> findById(Long id);      // SELECT por clave
    List<ProductoDTO> findAll();                  // SELECT de todos (nunca null)
    boolean update(ProductoDTO prod);            // UPDATE
    boolean delete(Long id);                     // DELETE
}`,
            },
            {
              fichero: 'ProductoDAOJdbc.java',
              codigo: `public class ProductoDAOJdbc implements ProductoDAO {
    private final DataSource dataSource;              // ① inyectado por constructor
    public ProductoDAOJdbc(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Optional<ProductoDTO> findById(Long id) {
        String sql = "SELECT id_producto, nombre, precio, stock " +
                     "FROM productos WHERE id_producto = ?";
        try (Connection conn = dataSource.getConnection();   // ② pide y devuelve al pool
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mapearFila(rs));  // ③
                return Optional.empty();
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error al buscar el producto " + id, e);   // ④
        }
    }

    // ③ Convierte la fila ACTUAL del ResultSet en un DTO: un único sitio
    private ProductoDTO mapearFila(ResultSet rs) throws SQLException {
        return new ProductoDTO(rs.getLong("id_producto"), rs.getString("nombre"),
                               rs.getBigDecimal("precio"), rs.getInt("stock"));
    }
}`,
            },
          ],
          trampas: [
            'La prueba del algodón: si tu main tiene un import java.sql.*, una cadena con SELECT o un ResultSet, algo se ha escapado del DAO.',
            'Si la BD pasara de MySQL a PostgreSQL solo cambiaría la implementación Jdbc: la interfaz, el main y los DTO no se tocan (desacoplar).',
          ],
        },
      ],
    },
    {
      id: 'ut2-integracion',
      titulo: 'Integración · Backend bancario transaccional',
      descripcion:
        'Todos los conceptos coordinados en un caso de misión crítica: transferencias atómicas con cuatro capas, bloqueos y códigos de error de MySQL.',
      temas: [
        {
          id: 'u2-banco',
          titulo: 'Backend bancario: transferencias atómicas en 4 capas',
          puntos: [
            'Capa de infraestructura: DataSourceProvider (Singleton) con el HikariDataSource.',
            'Capa de modelo: records inmutables CuentaDTO y MovimientoDTO.',
            'Capa de persistencia: interfaces CuentaDAO / MovimientoDAO con implementaciones que reciben la Connection.',
            'Capa de servicio (TransferenciaService): abre la transacción, verifica las reglas de negocio (importe positivo, cuentas distintas y activas, saldo suficiente) y hace commit() o rollback(). Los DAO nunca abren ni cierran la transacción.',
            'SELECT ... FOR UPDATE bloquea las filas leídas hasta el commit/rollback: sin él, dos transferencias simultáneas leerían el mismo saldo y una pisaría a la otra (lost update).',
            'Las cuentas se bloquean siempre en el mismo orden (IBAN menor primero): si cada transferencia bloquea en orden distinto, dos cruzadas (A→B y B→A) provocan un deadlock (error 1213).',
          ],
          fragmentos: [
            {
              fichero: 'TransferenciaService.java',
              codigo: `public void transferir(String ibanOrigen, String ibanDestino, BigDecimal importe)
        throws SQLException {
    // 0. Reglas que no necesitan la BD: fallar pronto, sin abrir conexión
    if (importe == null || importe.signum() <= 0)
        throw new IllegalArgumentException("El importe debe ser positivo");

    try (Connection conn = dataSource.getConnection()) {
        conn.setAutoCommit(false);                       // inicio transacción ACID
        try {
            // 1. Bloquear AMBAS cuentas SIEMPRE en el mismo orden
            boolean origenPrimero = ibanOrigen.compareTo(ibanDestino) < 0;
            CuentaDTO primera = cuentaDAO.findByIdForUpdate(conn,
                    origenPrimero ? ibanOrigen : ibanDestino)
                .orElseThrow(() -> new IllegalArgumentException("Cuenta inexistente"));
            // ... segunda cuenta, reglas de negocio (activa, saldo suficiente) ...

            // 3. Dos actualizaciones atómicas + 4. auditoría
            cuentaDAO.actualizarSaldo(conn, ibanOrigen, origen.saldo().subtract(importe));
            cuentaDAO.actualizarSaldo(conn, ibanDestino, destino.saldo().add(importe));
            movimientoDAO.registrar(conn, new MovimientoDTO(null, ibanOrigen,
                    ibanDestino, importe, "TRANSFERENCIA", LocalDateTime.now()));

            conn.commit();                               // 5. confirmación
        } catch (SQLException | RuntimeException e) {
            conn.rollback();                             // deshacer todo
            throw e;
        } finally {
            conn.setAutoCommit(true);
        }
    }
}`,
            },
          ],
        },
        {
          id: 'u2-buenas-practicas',
          titulo: 'Buenas prácticas: de junior a senior',
          puntos: [],
          tabla: {
            cabecera: ['Área', 'Práctica inaceptable (junior)', 'Estándar profesional (senior)'],
            filas: [
              ['Construcción SQL', 'Concatenar cadenas con + en Statement.', 'PreparedStatement con parámetros tipados ?.'],
              ['Ciclo de conexión', 'DriverManager.getConnection() en cada petición.', 'Pool HikariCP inyectado como DataSource.'],
              ['Liberación de recursos', 'Confiar en el GC o cerrar a mano sin protección.', 'try-with-resources para conexión, sentencia y cursor.'],
              ['Transacciones', 'autoCommit=true con operaciones dependientes sueltas.', 'setAutoCommit(false), commit()/rollback() en catch, InnoDB y SELECT ... FOR UPDATE.'],
              ['Mapeo de datos', 'Columnas dispersas por la interfaz o Maps genéricos.', 'Java Records inmutables y capas DAO desacopladas.'],
              ['Credenciales', 'URL, usuario y contraseña en el código (y en el repo).', 'Fichero de configuración o variables de entorno fuera del VCS.'],
              ['Gestión de errores', 'printStackTrace() o tragarse la excepción.', 'getErrorCode()/getSQLState(), rollback() y traducir a excepción de negocio.'],
            ],
          },
        },
        {
          id: 'u2-errores-mysql',
          titulo: 'Códigos de error críticos de MySQL',
          puntos: [
            'Se consultan con SQLException.getErrorCode(); el SQLState da la categoría estándar.',
          ],
          tabla: {
            cabecera: ['Código', 'Significado', 'Causa típica'],
            filas: [
              ['1040', 'Too many connections', 'Fuga de conexiones: Connection sin cerrar agota el máximo del servidor.'],
              ['1045', 'Access denied for user', 'Credenciales incorrectas o usuario sin permisos (SQLState 28000).'],
              ['1048', 'Column cannot be null', 'Insertar NULL en columna NOT NULL (SQLState 23000).'],
              ['1062', 'Duplicate entry for key', 'Clave primaria o UNIQUE duplicada (SQLState 23000).'],
              ['1213', 'Deadlock found when trying to get lock', 'Transacciones cruzadas; se previene bloqueando filas siempre en el mismo orden (SQLState 40001).'],
              ['1452', 'Cannot add or update a child row (FK)', 'Insertar una fila que referencia una clave ajena inexistente (SQLState 23000).'],
            ],
          },
        },
      ],
    },
  ],
};
