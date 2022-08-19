import mysql from 'mysql';
import { getUrlParameter, obtenerAhora } from './funciones.js';
import { database } from './database.js';
 
const { createConnection } = mysql;

/*
   Mostramos las preguntas a responder
*/

const putSurvey = (req, res) => {

  var idurl = getUrlParameter('idurl',req.url);
  var idioma = getUrlParameter('id',req.url);

  if (idurl === false || (idioma != 1 && idioma != 0)) {
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

  // Obtenemos las preguntas
  var sql =
    `select enc.id as             enc_num,
            enc.titulo as         enc_tit,
            enc.observaciones as  enc_obs,
            enc.comunidad as      enc_com,

            preg.id as            pre_num,
            preg.texto as         pre_txt,
            preg.num_opciones as  pre_nop,
            preg.operador as      pre_ope,
            preg.observaciones as pre_obs,

            resp.id as            res_id,
            resp.valor as         res_val,
            resp.tipo as          res_tip

    from encuesta enc, pregunta preg, respuestas resp

    where enc.inicio<=${ahora} and enc.fin>=${ahora}
      and enc.activa = "S"
      and enc.id = preg.encuesta
      and preg.id = resp.pregunta
      and enc.idurl = "${idurl}"
    
    order by preg.id, resp.id
    `;
  // console.log(sql);

  // Lanzamos query y revisamos resultado
  connection.query(sql, (error, results) => {
    if (error) throw error;

    // console.log(results);
    // console.log(results[0].titulo);
    
    if (results.length > 0) {
      // cargamos los datos de pregunta y respuestas para pasarlos al render: una fila por pregunta
      var preguntas = [];
      var nueva_fila = false;
      var indice = 0;
       
      for (var i = 0; i<results.length; i++ ){
        if (i == 0) {
          nueva_fila = true;
        }
        else {
          if (preguntas[indice-1].pre_num == results[i].pre_num) {
            // id y valor de la respuesta
            preguntas[indice-1].res_id.push(results[i].res_id);
            preguntas[indice-1].res_val.push(results[i].res_val);
            preguntas[indice-1].res_tip.push(results[i].res_tip);
             
            nueva_fila = false;
          }
          else {
            nueva_fila = true;
          }
        }

        // si cambio de pregunta insertamos fila nueva
        if (nueva_fila) {
          preguntas.push(
            {
              enc_num: results[i].enc_num,
              enc_tit: results[i].enc_tit,
              enc_obs: results[i].enc_obs,
              enc_com: results[i].enc_com,

              pre_num: results[i].pre_num,
              pre_txt: results[i].pre_txt,
              pre_nop: results[i].pre_nop,
              pre_ope: results[i].pre_ope,
              pre_obs: results[i].pre_obs,

              res_id : [ results[i].res_id ],
              res_val: [ results[i].res_val ],
              res_tip: [ results[i].res_tip ]
            }
          );
          indice++;
        }
      }

      // mostramos acceso a la encuesta (hay datos)
      let titulo = idioma == 0 ? 'Enquesta' : 'Encuesta';
      // console.log(preguntas);
       
      res.render('survey', {titulo: titulo, valores: preguntas, idioma: idioma});
    } else {
      // mostramos pantalla de no encuestas
      res.render('index', {titulo: 'Sense enquestes actives', navPasw: false, hay: false,
                           visible: 'N', idioma: 0, imagen: ''});
    }
  });
  connection.end();
}

export default putSurvey;