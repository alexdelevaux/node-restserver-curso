
// Archivo para subidas de archivos usando express-fileupload

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// Importaciones de modelos
const Usuario = require('../models/usuario');

const Producto = require('../models/producto');

// fs y path

const fs = require('fs'); // Para manejar subidas de archivo locales

const path = require('path'); // Para poder crear los path
 
// default options
app.use(fileUpload()); // Transforma lo que esté subiendo en un objeto llamado "files"


app.put('/upload/:tipo/:id', (req, res) => { // En el ejemplo de la página, es un post, pero es lo mismo

    let tipo = req.params.tipo;

    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) <0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos
            }
        });
    }

    let archivo = req.files.archivo; // Ese nombre "archivo" del req.files.archivo lo pondré en el Postman luego en el body

    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length - 1];

    //Extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf( extension ) <0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // Cambiar nombre al archivo

    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err)
        {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aquí la imagen ya está cargada

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }
        else {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario( id, res, nombreArchivo ) {
    
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(usuarioDB.img, 'usuarios'); // Borrar en caso de un error para no sobrecargar la DB
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(usuarioDB.img, 'usuarios'); // Por si el usuario no existe, tengo que borrar la foto que subió
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });
}

function imagenProducto( id, res, nombreArchivo ) {
    
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(productoDB.img, 'productos'); // Borrar en caso de un error para no sobrecargar la DB
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(productoDB.img, 'productos'); // Por si el producto no existe, tengo que borrar la foto que subió
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });

    });
}

function borraArchivo( nombreImagen, tipo ) { 
    // Crear el path (uso path.resolve)
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`);

    // Si la imagen existe, le hará un "unlink" y la borrará a la vieja.
    if ( fs.existsSync(pathImagen) ) {
        fs.unlinkSync(pathImagen);
    }

    // Si no existe, nunca entra a ese if y sigue (la crea)
}

module.exports = app;