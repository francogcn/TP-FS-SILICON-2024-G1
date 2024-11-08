create database integrador;
use integrador;

-- Forma tradicional de relacionar usuarios y roles mediante tablas separadas
-- util en el caso de querer aquegar mas campos o detalles a la tabla rol

CREATE TABLE Rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);
CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    mail VARCHAR(50) UNIQUE NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

-- forma resumida utilizando el tipo de dato ENUM, útil cuando los posibles valores son limitados y poco cambiantes
-- INSERT INTO Usuarios (nombre, apellido, mail, contraseña, rol) VALUES ('Juan', 'Pérez', 'juan.perez@mail.com', '12345', 'moderador'); ERROR

/*
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    mail VARCHAR(150) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('alumno', 'bibliotecario') NOT NULL
);
*/

CREATE TABLE Libro (
    id_libro INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    editorial VARCHAR(100),
    anio_publicacion YEAR,
    genero VARCHAR(100),
    estado ENUM('disponible', 'prestado', 'retrasado', 'extraviado') DEFAULT 'disponible'
);
/*
YEAR: es un tipo de 1 byte que se utiliza para representar años, sus valores se muestran en formato YYYY y su rango es de 1901 a 2155. 
INSERT INTO Libros (titulo, autor, anio_publicacion) VALUES ('El Señor de los Anillos', 'J.R.R. Tolkien', 1954);
INSERT INTO Libros (titulo, autor, anio_publicacion) VALUES ('Cien Años de Soledad', 'Gabriel García Márquez', '1967');
INSERT INTO Libros (titulo, autor, anio_publicacion) VALUES ('El Señor de los Anillos', 'J.R.R. Tolkien', YEAR('1954-04-01'));
tambien permite definir un año por default y no estar obligado a pasar el dato en el insert, por ejemplo: 
anio_publicacion YEAR DEFAULT YEAR(CURDATE()) -- Toma el año actual por defecto pero es override
*/

CREATE TABLE Prestamo (
    id_prestamo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_libro INT,
    fecha_prestamo DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_devolucion DATE DEFAULT (DATE_ADD(CURRENT_DATE, INTERVAL 14 DAY)),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_libro) REFERENCES Libro(id_libro)
);

CREATE TABLE Resenia (
    id_resenia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_libro INT,
    texto_resenia TEXT,
    clasificacion INT CHECK (clasificacion BETWEEN 1 AND 5),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_libro) REFERENCES Libro(id_libro)
);
/*
CHECK es útil cuando se necesita garantizar que solo se ingresen datos válidos en una columna, 
cualquier valor que esté fuera de este rango será rechazado.
ALTER TABLE table_name ADD CHECK (table_column BETWEEN 1 AND 5);
*/

CREATE TABLE Amigos (
    id_amistad INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_amigo_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_amigo_usuario) REFERENCES Usuario(id_usuario)
);

-- -------------------------------------------------------------------------------
/*
Usuarios
	GET /usuarios: Obtener todos los usuarios.
	GET /usuarios/:id: Obtener un usuario por su id_usuario.
	POST /usuarios: Crear un nuevo usuario.
	PUT /usuarios/:id: Actualizar los datos de un usuario.
	DELETE /usuarios/:id: Eliminar un usuario.
-- ----------------------------------------------
Libros
	GET /libros: Obtener todos los libros.
	GET /libros/:id: Obtener un libro por su id_libro. (o cualquiera de sus campos)
	POST /libros: Crear un nuevo libro.
	PUT /libros/:id: Actualizar los datos de un libro.
	PUT /libros/:id/existencia: Actualizar la existencia de un libro (cantidad disponible), podria no ser un endpoint sino un disparador.
	DELETE /libros/:id: Eliminar un libro.
-- ----------------------------------------------
Prestamos
	GET /prestamos: Obtener todos los préstamos.
	GET /prestamos/:id: Obtener un préstamo por su id_prestamos.
	POST /prestamos: Crear un nuevo préstamo (reserva de un libro).
	PUT /prestamos/:id: Actualizar los datos de un préstamo (por ejemplo, fechas de devolución).
	DELETE /prestamos/:id: Eliminar un préstamo.
-- ----------------------------------------------
Resenias
	GET /resenias: Obtener todas las reseñas.
	GET /resenias/:id: Obtener una reseña por su id_resenia.
	GET /resenias/libro/:id_libro: Obtener reseñas de un libro específico.
	POST /resenias: Crear una nueva reseña.
	PUT /resenias/:id: Actualizar una reseña existente.
	DELETE /resenias/:id: Eliminar una reseña.
-- ----------------------------------------------
Amigos
	GET /amigos: Obtener todas las relaciones de amistad.
	GET /amigos/:id_usuario: Obtener los amigos de un usuario.
	POST /amigos: Crear una nueva relación de amistad entre dos usuarios.
	DELETE /amigos/:id: Eliminar una relación de amistad.
-- ----------------------------------------------
lógicas específicas
	GET /libros/disponibles: Obtener todos los libros con existencia disponible para préstamos.
	GET /prestamos/usuario/:id_usuario: Obtener todos los préstamos de un usuario específico.
	GET /prestamos/libro/:id_libro: Obtener todos los préstamos realizados para un libro específico.
	GET /amigos/:id_usuario/resenias: Obtener todas las reseñas realizadas por los amigos de un usuario específico.
*/

