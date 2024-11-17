//archivo encargado de conectarse con la tabla "resenia" de la database

//se importa la configuración de la database
const db = require('../config/config_database');

const Resenia = {
    // Función para obtener las últimas reseñas de un usuario
  obtenerUltimasReseniasPorUsuario: async (id_usuario) => {
    const query = `SELECT 
            r.id_resenia, r.id_usuario, r.id_libro, r.texto_resenia, r.clasificacion,
            l.titulo
        FROM resenia r
        JOIN libro l ON r.id_libro = l.id_libro
        WHERE r.id_usuario = ?
        ORDER BY r.id_resenia DESC;`;

    try {
      const [rows] = await db.execute(query, [id_usuario]);
      
      return rows;
    } catch (error) {
      throw new Error('Error al obtener las últimas reseñas del usuario: ' + error.message);
    }
  },

    //crear resenia (post)
    create: async (id_usuario, id_libro, texto_resenia, clasificacion) => {
        try {
            const params = [id_usuario, id_libro, texto_resenia, clasificacion];
            const query = 'INSERT INTO resenia (id_usuario, id_libro, texto_resenia, clasificacion) VALUES (?, ?, ?, ?)';

    // // inspección de la consulta y los parámetros
    // console.log('Ejecutando consulta:', query, 'con parámetros:', params);

            const result = await db.execute(query, params);

// // Ahora obtenemos la reseña completa usando el `insertId` que es el ID de la reseña recién creada
// const [reseniaCreada] = await db.execute('SELECT * FROM resenia WHERE id_resenia = ?', [result.insertId]);
        
// // Devolvemos la reseña completa
// return reseniaCreada[0];

            return { message: `Resenia del libro ${id_libro} creada con éxito`, detail: result };
        } catch (error) {
                throw new Error('Error al crear la resenia: ' + error.message);
        }
    },

    //listar todos las resenias (get)
    findAll: async () => {
        const query = 'SELECT * FROM resenia';
        try {
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener las resenias: ' + error.message);
        }
    },

    //buscar por id_libro (get)
    findByIdLibro: async (id) => {
        try {
            const consulta = 'SELECT * FROM resenia WHERE id_libro = ?';
            const [result] = await db.execute(consulta, [id]);

            if (result.length == 0) {
                throw new Error(`Resenia no encontrada con el id_libro: ${id}`);
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    //buscar por id_resenia (get)
    findByIdResenia: async (id) => {
        const query = 'SELECT * FROM resenia WHERE id_resenia = ?';
        try {
            const [rows] = await db.execute(query, [id]);
            return rows;
        } catch (error) {
            throw new Error('Error al buscar la resenia: ' + error.message);
        }
    },

    //actualizar resenia (put)
    update: async (id_resenia, id_usuario, id_libro, texto_resenia, clasificacion) => {
        const query = 'UPDATE resenia SET id_usuario = ?, id_libro = ?, texto_resenia = ?, clasificacion = ?  WHERE id_resenia = ?';
        try {
            const [result] = await db.execute(query, [id_usuario, id_libro, texto_resenia, clasificacion, id_resenia]);
            if (result.affectedRows === 0) {
                throw new Error('No se encontró la resenia para actualizar');
            }
            return { message: 'Resenia actualizada correctamente' };
        } catch (error) {
            throw new Error('Error al actualizar la resenia: ' + error.message);
        }
    },

    //borrar resenia (delete)
    delete: async (id) => {
        const query = 'DELETE FROM resenia WHERE id_resenia = ?';
        try {
            const [result] = await db.execute(query, [id]);
            if (result.affectedRows === 0) {
                throw new Error('No se encontró la resenia para eliminar');
            }
            return { message: 'Resenia eliminada correctamente' };
        } catch (error) {
            throw new Error('Error al eliminar la resenia: ' + error.message);
        }
    },
    
};

module.exports = Resenia;