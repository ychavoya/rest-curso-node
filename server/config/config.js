// PUERTO
process.env.PORT = process.env.PORT || 8080;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos
let urlDB;

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:iamroot123@ds215822.mlab.com:15822/woomber-cafe'
}

process.env.URLDB = urlDB;