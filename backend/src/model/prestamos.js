const db = require("../config/config_database");

const Prestamo = {
  //Crear un nuevo prestamo
  findAll: async () => {
    try {
      const query =
        "SELECT p.id_prestamo, u.nombre AS nombre_usuario, u.apellido AS apellido_usuario, l.titulo AS titulo_libro, DATE_FORMAT(p.fecha_prestamo, '%d-%m-%Y') AS fecha_prestamo, DATE_FORMAT(p.fecha_devolucion, '%d-%m-%Y') AS fecha_devolucion FROM Prestamo p JOIN Usuario u ON p.id_usuario = u.id_usuario JOIN      Libro l ON p.id_libro = l.id_libro";
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
  update: async (id_usuario, id_libro, fecha_prestamo, fecha_devolucion) => {
    const query =
      "UPDATE Prestamo SET id_usuario = ?, id_libro = ?, fecha_prestamo = ?, fecha_devolucion = ?";
    try {
      const result = await db.execute(query, [
        id_usuario,
        id_libro,
        fecha_prestamo,
        fecha_devolucion,
      ]);
      if (result.affectedRows === 0) {
        const error = new Error(`No se encontro un préstamo con la ID: ${dni}`);
        error.statusCode = 404;
        throw error;
      }
      return { message: "Prestamo actualizado con exito", detail: result };
    } catch (error) {
      throw new Error("Error al actualizar el prestamo: " + error.message);
    }
  },
};

module.exports = Prestamo;
