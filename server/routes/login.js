// Librerías necesarias
const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();
const jwt = require('jsonwebtoken');

// Importanciones de Google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if ( !bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            }); 
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json( {
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

   

});


// Configuraciones de Google:

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    
  }

 


app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    // Crear un googleUser, verificar su token
    let googleUser = await verify (token)
    .catch( e => {
            return res.status(403).json( {
                ok: false,
                err: e
            });
        });
    
    // Buscar en mi DB, en el schema de Usuario, por un email que sea igual al que ingresó el googleUser
    Usuario.findOne( {email: googleUser.email}, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if (usuarioDB) {
            // Si existe un usuario
            if ( usuarioDB.google === false) {
                // Si ese usuario no se autenticó con su cuenta de google
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Ya se autenticó con su email. Por favor, ingrese con ese'
                    }
                });
            } else {
                // Si el usuario se autenticó con su cuenta de google, crear token y guardar los datos en la DB:
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }

        } else {
            // Si el usuario no existe en nuestra DB, hay que crearlo
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = 'XXXXXXXXXXXXXXXXXXXXXXXXX'; // Solo lo ponemos para que se valide la existencia de una contraseña

            usuario.save ( (err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }); // FIN DEL usuario.save
        }

    });

});









module.exports = app;