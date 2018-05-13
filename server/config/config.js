

// ================
// Puerto
// ================

process.env.PORT = process.env.PORT || 3000;




// ================
// Entorno
// ================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================
// Base de datos
// ================

//eslint-disable-next-line
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}
else {
    urlDB = 'mongodb://usuario-cafe:mlab17@ds221990.mlab.com:21990/cafe';
}

process.env.URL_DB = urlDB;


