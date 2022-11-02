import mysql from 'mysql';
import { getUrlParameter, obtenerAhora } from './funciones.js';
import { database } from './database.js';

const { createConnection } = mysql;

/*
   Mostramos página de inicio en función de si está o no esa encuesta activa
*/

const getSurvey = (req, res) => {

  var idurl = getUrlParameter('idurl',req.url);

  if (idurl === false) {
    // mostramos pantalla de no encuestas
    res.render('index', {titulo: 'No trobada', navPasw: false, hay: false, visible: 'N',
                         idioma: 0, imagen: ''});
    return;
  }

  // Conectamos con la base de datos
  const connection = createConnection({
    host: database.host,user: database.user,password: database.password,
    database: database.database,charset: 'utf8mb4'
  });

  const ahora = obtenerAhora();

  // Miramos si hay encuestas activas hoy
  var sql =
  `select * from encuesta where inicio<=${ahora} and fin>=${ahora} and activa="S" and idurl="${idurl}"`;

  // Lanzamos query y revisamos resultado
  connection.query(sql, (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      // mostramos acceso a la encuesta (hay datos)
      res.render('index', {titulo: 'Principal', idurl: idurl, navPasw: false,
                          tit: results[0].titulo, adic: results[0].msjadic,
                          hay: true, visible: results[0].visible, idioma: results[0].idioma,
                          imagen: results[0].img});
    } else {
      // mostramos pantalla de no encuestas
      res.render('index', {titulo: 'Sense enquestes', navPasw: false, hay: false, visible: 'N',
                           idioma: 0, imagen: ''});
    }
  });
  connection.end();
}

export default getSurvey;
