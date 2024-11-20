create database integrador;
use integrador;

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

CREATE TABLE Libro (
    id_libro INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    editorial VARCHAR(100),
    anio_publicacion YEAR,
    genero VARCHAR(100),
    estado ENUM('disponible', 'prestado', 'retrasado', 'extraviado') DEFAULT 'disponible'
);

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

CREATE TABLE Amigos (
    id_amistad INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_amigo_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_amigo_usuario) REFERENCES Usuario(id_usuario)
);

-- DML
INSERT INTO rol (nombre_rol, descripcion) VALUES 
(
"admin",
"El admin tiene acceso total a la web, siendo el usuario base del sistema."
),
(
"bibliotecario",
"El bibliotecario/a tiene acceso total a la web, pudiendo (además de disfrutar los servicios de la misma) manejar la cración de usuarios."
),
(
"alumno",
"El alumno tiene acceso parcial a la web, pudiendo disfrutar de los préstamos y reviews."
);

INSERT INTO usuario (nombre, apellido, mail, contrasenia, id_rol)
VALUES 
(
    "dev", 
    "account", 
    "admin@admin.com", 
    "$2a$12$b.gxiY4VQNcwZ/zQJHiSzed2eiZkqHAwaIZcAIvPG3Zr.auP.9rEO",  /*Holamundo123*/
    COALESCE((SELECT id_rol FROM rol WHERE nombre_rol = 'admin' LIMIT 1), 1)
);

