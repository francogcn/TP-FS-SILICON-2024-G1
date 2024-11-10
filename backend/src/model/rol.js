const db = require('../config/config_database');

module.exports = {
    getAll: async () => {
        const query = 'SELECT * FROM rol';  // Traemos todos los datos de la tabla 'rol'
        try {
          const [rows] = await db.execute(query);  // Ejecutamos la consulta
          // Filtramos solo los campos necesarios ('id_rol' y 'nombre')
          const roles = rows.map(row => ({
            id_rol: row.id_rol,
            nombre: row.nombre_rol
          }));
          return roles;  // Devolvemos solo los datos relevantes
        } catch (error) {
          throw new Error('Error al obtener los roles: ' + error.message);
        }
      },
};