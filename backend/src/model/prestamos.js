const db = require('../config/config_database');


const Prestamo={
    //Crear un nuevo prestamo
    findAll: async () => {
        try {
            const query = 'SELECT * FROM Prestamo';
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener los prestamos: ' + error.message);
        }
    },

    findById: async (id) => {
        const query = 'SELECT * FROM Prestamo WHERE id_prestamo = ?';
        try {
            const [rows] = await db.execute(query, [id]);
            return rows;
        } catch (error) {
            throw new Error('Error al buscar el prestamo por ID: ' + error.message);
        }
    },
    
    create: async (id_usuario, id_libro, fecha_prestamo, fecha_devolucion) => {
        const query = 'INSERT INTO Prestamo (id_usuario, id_libro, fecha_prestamo, fecha_devolucion) VALUES (?, ?, ?, ?)';
        try {
            await db.execute(query, [id_usuario, id_libro, fecha_prestamo, fecha_devolucion]);
        } catch (error) {
            throw new Error('Error al crear la persona: ' + error.message);
        }
    }

}

module.exports = Prestamo;