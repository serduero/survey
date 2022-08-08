import mysql from 'mysql';
import { getUrlParameter, obtenerAhora } from './funciones.js';
import { database } from './database.js';
 
const { createConnection } = mysql;

/*
   Mostramos las preguntas a responder
*/

const putSurvey = (req, res) => {

  // const database = {
  //   host: "b5s1p7ubh0ujcnb6jdxc-mysql.services.clever-cloud.com",
  //   user:  "u2svqk5ihhqfkfab",
  //   password: "QmEr4Kh7yrgGcH0nKFcw",
  //   database: "b5s1p7ubh0ujcnb6jdxc",
  // };

  /*
  const database =
  {
    host: process.env.DATABASE_HOST,user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,database: process.env.DATABASE_NAME,
  };*/
  var idurl = getUrlParameter('idurl',req.url);

  if (idurl === false) {
     // mostramos pantalla de no encuestas
     res.render('index', {titulo: 'No trobada', navPasw: false, hay: false});
     return;
  }

  // Conectamos con la base de datos
  const connection = createConnection({
    host: database.host,user: database.user,password: database.password,
    database: database.database,charset: 'utf8mb4'
  });

  const ahora = obtenerAhora();

  // Obtenemos las preguntas
  var sql =
    `select enc.id as             enc_num,
            enc.titulo as         enc_tit,
            enc.observaciones as  enc_obs,
            enc.comunidad as      enc_com,

            preg.id as            pre_num,
            preg.texto as         pre_txt,
            preg.num_opciones as  pre_nop,
            preg.observaciones as pre_obs,

            resp.valor0 as        res_va0,
            resp.valor1 as        res_va1,
            resp.valor2 as        res_va2,
            resp.valor3 as        res_va3,
            resp.valor4 as        res_va4,
            resp.valor5 as        res_va5,
            resp.valor6 as        res_va6,
            resp.valor7 as        res_va7,
            resp.valor8 as        res_va8,
            resp.valor9 as        res_va9

            from encuesta enc, pregunta preg, respuesta resp
    where enc.inicio<=${ahora} and enc.fin>=${ahora}
      and enc.activa = "S"
      and enc.id = preg.encuesta
      and preg.id = resp.pregunta
      and enc.idurl = "${idurl}"
    `;
  // console.log(sql);

  // Lanzamos query y revisamos resultado
  connection.query(sql, (error, results) => {
    if (error) throw error;

    // console.log(results);
    // console.log(results[0].titulo);
    
    if (results.length > 0) {
      // mostramos acceso a la encuesta (hay datos)
      res.render('survey', {titulo: 'Enquesta', valores: results});
    } else {
      // mostramos pantalla de no encuestas
      res.render('index', {titulo: 'Sense enquestes actives', navPasw: false, hay: false});
    }
  });
  connection.end();
}

export default putSurvey;