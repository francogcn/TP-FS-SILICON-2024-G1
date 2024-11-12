const db = require('../config/config_database');

const libros = {
    crearLibro: async function (datos) {
        try {
            const params = [datos.titulo, datos.autor, datos.editorial, datos.anio_publicacion, datos.genero];
            const query = "INSERT INTO Libro (titulo, autor, editorial, anio_publicacion, genero) VALUES (?,?,?,?,?)";
            const result = await db.execute(query, params);
            return { message: `El libro ${datos.titulo} se ha creado con exito`, detail: result };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El libro ya fue registrado anteriormente: ' + error.message);
            } else if (error.code === 'ER_BAD_NULL_ERROR') {
                throw new Error('La columna no puede ser nula: ' + error.message);
            } else if (error.code === 'ER_NO_REFERENCED_ROW') {
                throw new Error(' Falla en la restricción de clave externa.: ' + error.message);
            } else {
                throw new Error('No se pudo realizar la insersion debido a: ' + error.message);
            }
        }
    },

    actualizarLibro: async function (datos, titulo) {

        try {
            const query = `UPDATE Libro SET 
            titulo = ?,
            autor = ?,
            editorial = ?,
            anio_publicacion = ?,
            genero = ?, 
            estado = ?
            WHERE titulo = ?`;
            const params = [
                datos.titulo,
                datos.autor,
                datos.editorial,
                datos.anio_publicacion,
                datos.genero,
                datos.estado,
                titulo];

            const result = await db.execute(query, params);

            if (result.affectedRows == 0) { 
                throw new Error("No existe un libro que coincida con el criterio de busqueda");
            } else {
                return {
                    message: `Se modificó con exito el libro  ${datos.titulo}`,
                    detail: result
                }
            }
        } catch (error) {
            if (error.code == "ER_DUP_ENTRY") {
                throw new Error("Los datos a insertar generan un titulo duplicado");
            } else { 
                throw new Error(`Error diferente, analizar código de error: ${error.code}`);
            }
        }
    },

    listarLibros: async function() {
        try {
            query = "select * from Libro"; 
            const [libros] = await db.execute(query);
            return libros;
        } catch (error) {
            throw new Error('Error al listar libros' + error.message);
        }

    },

    eliminarLibro: async function(id_libro) {
        try {
            const query = "DELETE FROM Libro WHERE id_libro=?;";
            const result = await db.execute(query, [id_libro]);

            if (result.affectedRows === 0) {
                const error = new Error("No se encontró un libro con el id:", id_libro);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Libro eliminado con éxito', detail: result };

        } catch (error) {
            throw new Error('Error al eliminar el libro: ' + error.message);
        }
    },

    buscarPorTitulo: async function (titulo) {
        try {
            const [result] = await db.execute('SELECT * FROM Libro WHERE titulo = ?', [titulo]);
            if (result.length == 0) {
                throw new Error(`No se encontro un libro con el titulo: ${titulo}`);
            } else {
                return { message: `Libro hallado con exito`, detail: result };
            }
        } catch (error) {
            throw new Error('Revisar codigo de error: ' + error.message);
        }
    },

    buscarPorEstado: async function (estado) {
        try {
            const [result] = await db.execute('SELECT * FROM Libro WHERE estado =?', [estado]);
            if (result.length == 0) {
                throw new Error(`No se encontro un libro con el estado: ${estado}`);
            } else {
                return { message: `Libros hallados con exito`, detail: result };
            }
        } catch (error) {
            throw new Error('Revisar codigo de error: ' + error.message);
        }
    },

}


module.exports = libros;