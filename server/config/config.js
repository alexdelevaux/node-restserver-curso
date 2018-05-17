

// ================
// Puerto
// ================

process.env.PORT = process.env.PORT || 3000;




// ================
// Entorno
// ================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================
// Vencimiento Token
// ================

// 60 segundos x 60 minutos x 24 horas x 30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ================
// SEED de auttenticación
// ================

process.env.SEED = process.env.SEED || 'seed-secreto-de-desarrollo';


// ================
// Base de datos
// ================

//eslint-disable-next-line
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}
else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;


// ================
// Google Client ID
// ================

process.env.CLIENT_ID = process.env.CLIENT_ID || '991163517688-cvvrj2i0htlfghct2gdj3om8t84ia95h.apps.googleusercontent.com';
