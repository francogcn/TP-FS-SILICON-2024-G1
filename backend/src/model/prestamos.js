const db = require("../config/config_database");

const Prestamo = {
   // Buscar los libros devueltos por un usuario
   findAllDevueltosByUser: async (id_usuario) => {
    const query = `
      SELECT 
      p.id_prestamo, 
      l.id_libro,
      l.titulo AS titulo_libro,
      DATE_FORMAT(p.fecha_prestamo, '%d-%m-%Y') AS fecha_prestamo, 
      DATE_FORMAT(p.fecha_devolucion, '%d-%m-%Y') AS fecha_devolucion 
    FROM Prestamo p
    JOIN Libro l ON p.id_libro = l.id_libro
    WHERE p.id_usuario = ? 
    AND p.fecha_devolucion IS NOT NULL 
    AND p.fecha_devolucion >= CURDATE()
    GROUP BY l.id_libro;
    `; // Agregar GROUP BY para evitar duplicados por libro
    try {
      const [rows] = await db.execute(query, [id_usuario]);
      return rows;  // Retorna los libros devueltos con fecha de vencimiento >= hoy
    } catch (error) {
      throw new Error("Error al obtener los libros devueltos: " + error.message);
    }
  },

  //Crear un nuevo prestamo
  findAll: async () => {
    try {
      const query =
        `SELECT 
          p.id_prestamo, 
          u.id_usuario,          -- Agregado para devolver el id_usuario
          u.nombre AS nombre_usuario, 
          u.apellido AS apellido_usuario, 
          l.titulo AS titulo_libro, 
          DATE_FORMAT(p.fecha_prestamo, '%d-%m-%Y') AS fecha_prestamo, 
          DATE_FORMAT(p.fecha_devolucion, '%d-%m-%Y') AS fecha_devolucion 
        FROM 
          Prestamo p 
        JOIN 
          Usuario u ON p.id_usuario = u.id_usuario 
        JOIN 
          Libro l ON p.id_libro = l.id_libro;`
        const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los prestamos: " + error.message);
    }
  },

  findById: async (id) => {
    const query = "SELECT * FROM Prestamo WHERE id_prestamo = ?";
    try {
      const [rows] = await db.execute(query, [id]);
      return rows;
    } catch (error) {
      throw new Error("Error al buscar el prestamo por ID: " + error.message);
    }
  },

  create: async (id_usuario, id_libro, fecha_prestamo, fecha_devolucion) => {
    const query =
      "INSERT INTO Prestamo (id_usuario, id_libro, fecha_prestamo, fecha_devolucion) VALUES (?, ?, ?, ?)";
    try {
      await db.execute(query, [
        id_usuario,
        id_libro,
        fecha_prestamo,
        fecha_devolucion,
      ]);
      await db.execute("UPDATE Libro set estado = ? where id_libro = ?", ["prestado", id_libro]);
    } catch (error) {
      throw new Error("Error al crear el prestamo: " + error.message);
    }
  },

  // Eliminar un préstamo por ID
  deleteById: async (id) => {
    const query = "DELETE FROM Prestamo WHERE id_prestamo = ?";
    try {
      const [result] = await db.execute(query, [id]);
      return result.affectedRows > 0; // Retorna true si se eliminó al menos un registro
    } catch (error) {
      throw new Error("Error al eliminar el préstamo: " + error.message);
    }
  },

  update: async (id_prestamo, id_usuario, id_libro, fecha_prestamo, fecha_devolucion) => {
    const query =
      "UPDATE Prestamo SET id_usuario = ?, id_libro = ?, fecha_prestamo = ?, fecha_devolucion = ? where id_prestamo = ?";
    try {
      const result = await db.execute(query, [
        id_usuario,
        id_libro,
        fecha_prestamo,
        fecha_devolucion,
        id_prestamo
      ]);
      if (result.affectedRows === 0) {
        const error = new Error(`No se encontro un préstamo con la ID: ${id_prestamo}`);
        error.statusCode = 404;
        throw error;
      }
      return { message: "Prestamo actualizado con exito", detail: result };
    } catch (error) {
      throw new Error("Error al actualizar el prestamo: " + error.message);
    }
  },

  findAllByUser: async (id_usuario) => {
    const query = `SELECT p.id_prestamo, u.nombre AS nombre_usuario, u.apellido AS apellido_usuario, 
                  l.titulo AS titulo_libro, 
                  DATE_FORMAT(p.fecha_prestamo, '%d-%m-%Y') AS fecha_prestamo, 
                  DATE_FORMAT(p.fecha_devolucion, '%d-%m-%Y') AS fecha_devolucion 
                  FROM Prestamo p 
                  JOIN Usuario u ON p.id_usuario = u.id_usuario 
                  JOIN Libro l ON p.id_libro = l.id_libro 
                  WHERE u.id_usuario = ? 
                  AND p.fecha_devolucion >= CURDATE()` /* Solo préstamos activos */
    try {
      const [rows] = await db.execute(query, [id_usuario]);
      return rows;
    } catch (error) {
      throw new Error(
        "Error al buscar el prestamo por usuario: " + error.message
      );
    }
  },

  findAllByBook: async (id_libro) => {
    const query = "SELECT p.id_prestamo, u.nombre AS nombre_usuario, u.apellido AS apellido_usuario, l.titulo AS titulo_libro, DATE_FORMAT(p.fecha_prestamo, '%d-%m-%Y') AS fecha_prestamo, DATE_FORMAT(p.fecha_devolucion, '%d-%m-%Y') AS fecha_devolucion FROM Prestamo p JOIN Usuario u ON p.id_usuario = u.id_usuario JOIN Libro l ON p.id_libro = l.id_libro WHERE l.id_libro =?";
    try {
      const [rows] = await db.execute(query, [id_libro]);
      return rows;
    } catch (error) {
      throw new Error(
        "Error al buscar el prestamo por libro: " + error.message
      );
    }
  },
};

module.exports = Prestamo;
