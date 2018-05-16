
const jwt = require('jsonwebtoken');

// ===============
// Verificar token
// ===============

let verificaToken = ( req, res, next) => {

    let token = req.get('token'); 

    jwt.verify(token, process.env.SEED, (err, decoded) => { //Decoded tiene la info del usuario (payload) ya lista

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token incorrecto'
                }
            });
        }

        req.usuario = decoded.usuario;
        
        next();
    });
};

// ======================
// Verificar Rol de Admin
// =====================

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

module.exports =  {
    verificaToken,
    verificaAdminRole
};