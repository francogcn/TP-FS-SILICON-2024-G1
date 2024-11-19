//archivo encargado de conectarse con la tabla "usuario" de la database

//se importa la configuración de la database y el módulo "bcrypt" para hashear contraseñas
const db = require("../config/config_database");
const bcrypt = require("bcrypt");

const Usuario = {
  //crear usuario (post)
  create: async (nombre, apellido, mail, contrasenia, id_rol) => {
    const hashedPass = await bcrypt.hash(contrasenia, 10);
    try {
      const params = [nombre, apellido, mail, hashedPass, id_rol];
      const consulta =
        "INSERT INTO Usuario (nombre, apellido, mail, contrasenia, id_rol) VALUES (?, ?, ?, ?, ?)";
      const result = await db.execute(consulta, params);
      return { message: `Usuario ${mail} creado con éxito`, detail: result };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error(
          "Ya existe un usuario con los mismos datos: " + error.message
        );
      } else if (error.code === "ER_BAD_NULL_ERROR") {
        throw new Error("Una columna no puede ser nula: " + error.message);
      } else if (error.code === "ER_NO_REFERENCED_ROW") {
        throw new Error(
          "Error en la restricción de clave externa: " + error.message
        );
      } else {
        throw new Error(
          "No se pudo registrar al usuario debido a: " + error.message
        );
      }
    }
  },

  //listar todos los usuarios (get)
  findAll: async () => {
    const query =
      "SELECT u.id_usuario, u.nombre, u.apellido, u.mail, u.contrasenia, r.nombre_rol FROM Usuario u JOIN Rol r ON u.id_rol = r.id_rol ORDER BY u.apellido ASC;";
    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los usuarios: " + error.message);
    }
  },

  //funcion para buscar usuarios al agregar amistad
  findUsers: async (id) => {
    const query =
      "SELECT id_usuario, nombre, apellido FROM Usuario WHERE id_usuario!=?";
    try {
      const [rows] = await db.execute(query, [id]);
      return rows;
    } catch (error) {
      throw new Error("Error al buscar usuarios: " + error.message);
    }
  },

  //buscar por mail (get)
  findByMail: async (mail) => {
    try {
      const consulta = "SELECT * FROM Usuario WHERE mail = ?";
      const [result] = await db.execute(consulta, [mail]);

      if (result.length == 0) {
        throw new Error(`Usuario no encontrado con el mail: ${mail}`);
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //buscar por id (get)
  findById: async (id) => {
    const query = "SELECT * FROM Usuario WHERE id_usuario = ?";
    try {
      const [rows] = await db.execute(query, [id]);
      return rows;
    } catch (error) {
      throw new Error("Error al buscar el usuario: " + error.message);
    }
  },

  findProfile: async (id) => {
    const query = `
            SELECT 
            (SELECT COUNT(DISTINCT p.id_libro)
            FROM prestamo p
            WHERE p.id_usuario = ? 
            AND p.fecha_devolucion IS NOT NULL
            AND p.fecha_devolucion >= CURDATE()) AS libros,
    
            (SELECT COUNT(*) 
            FROM amigos 
            WHERE id_usuario = ? OR id_amigo_usuario = ?) AS amigos,
    
            (SELECT COUNT(id_resenia) 
            FROM resenia
            WHERE id_usuario = ?) AS resenias,
            
            (SELECT concat(nombre, " ", apellido) FROM usuario WHERE id_usuario = ?) AS nombre`;

    try {
      const [rows] = await db.execute(query, [id, id, id, id, id]);
      return rows;
    } catch (error) {
      throw new Error("Error al buscar el usuario: " + error.message);
    }
  },

  //actualizar usuario (put)
  update: async (id, nombre, apellido, mail, contrasenia, id_rol) => {
    let query =
      "UPDATE Usuario SET nombre = ?, apellido = ?, mail = ?, id_rol = ?";
    const params = [nombre, apellido, mail, id_rol];

    // Si se proporciona una nueva contraseña, inclúyela en la consulta
    if (contrasenia) {
      const hashedPass = await bcrypt.hash(contrasenia, 10);
      query += ", contrasenia = ?";
      params.push(hashedPass);
    }
    query += " WHERE id_usuario = ?";
    params.push(id);

    try {
      const [result] = await db.execute(query, params);
      if (result.affectedRows === 0) {
        throw new Error("No se encontró el usuario para actualizar");
      }
      return { message: "Usuario actualizado correctamente" };
    } catch (error) {
      throw new Error("Error al actualizar el usuario: " + error.message);
    }
  },

  //borrar usuario (delete)
  delete: async (id) => {
    try {
      await db.execute("START TRANSACTION");
      await db.execute(
        "DELETE FROM amigos WHERE id_usuario =? OR id_amigo_usuario =?",
        [id, id]
      );
      await db.execute("DELETE FROM prestamo WHERE id_usuario =?", [id]);
      await db.execute("DELETE FROM resenia WHERE id_usuario =?", [id]);
      const [result] = await db.execute(
        "DELETE FROM Usuario WHERE id_usuario =?",
        [id]
      );

      if (result.affectedRows === 0) {
        const error = new Error("No se encontró el usuario para eliminar");
        error.statusCode = 404;
        throw error;
      }
      await db.execute("COMMIT");
      return { message: "Usuario eliminado correctamente" };
    } catch (error) {
      await db.execute("ROLLBACK");
      throw new Error("Error al eliminar el usuario: " + error.message);
    }
  },
};

module.exports = Usuario;
