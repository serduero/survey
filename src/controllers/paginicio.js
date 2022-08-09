import mysql from 'mysql';
import { getUrlParameter, obtenerAhora } from './funciones.js';
import { database } from './database.js';

const { createConnection } = mysql;

/*
   Mostramos página de inicio en función de si hay o no encuestas activas
*/

const getSurvey = (req, res) => {

  var idurl = getUrlParameter('idurl',req.url);

  if (idurl === false) {
    // mostramos pantalla de no encuestas
    res.render('index', {titulo: 'No trobada', navPasw: false, hay: false, visible: 'N', idioma: 0});
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
  // console.log(sql);

  // Lanzamos query y revisamos resultado
  connection.query(sql, (error, results) => {
    if (error) throw error;

    // console.log(results);
    // console.log(results[0].titulo);
    
    if (results.length > 0) {
      // mostramos acceso a la encuesta (hay datos)
      res.render('index', {titulo: 'Principal', idurl: idurl, navPasw: false,
                           hay: true, visible: results[0].visible, idioma: results[0].idioma});
    } else {
      // mostramos pantalla de no encuestas
      res.render('index', {titulo: 'Sense enquestes', navPasw: false, hay: false, visible: 'N', idioma: 0});
    }
  });
  connection.end();
}

export default getSurvey;
