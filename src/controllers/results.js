import mysql from 'mysql';
import { getUrlParameter, obtenerAhora } from './funciones.js';
import { database } from './database.js';

const { createConnection } = mysql;

/*
   Mostramos página de resultados de la encuesta aactual
*/

const getResults = (req, res) => {

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

  // Miramos los resultados de la encuesta actual activa
  var sql =
  `select   encu.titulo as  enc_titulo,
            preg.id as      pre_id,
            preg.texto as   pre_pregunta,
            resp.valor as   valor,
            resp.tipo as    tipo,
            (
                select count(*)
                from respvecino resv
                where resv.encuesta=encu.id and resv.pregunta=preg.id and resv.numresp=resp.id
            ) as contador
   
   from encuesta encu, pregunta preg, respuestas resp

   where    encu.inicio<=${ahora} and encu.fin>=${ahora} and encu.activa="S" and
            encu.idurl="${idurl}" and encu.visible="S" and
            preg.encuesta=encu.id and
            preg.id=resp.pregunta

   order by preg.id, resp.id`;

   // Lanzamos query y revisamos resultado
   connection.query(sql, (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
        var preg_resul = [];
        var nueva_fila = false;
        var indice = 0;
         
        for (var i = 0; i<results.length; i++ ){
          if (i == 0) {
            nueva_fila = true;
          }
          else {
            if (preg_resul[indice-1].preg_id == results[i].pre_id) {
              // id y valor de la respuesta
              preg_resul[indice-1].resp_tit.push( results[i].valor );
              preg_resul[indice-1].resp_num.push( results[i].contador );
              preg_resul[indice-1].tipo.push( results[i].tipo );
               
              nueva_fila = false;
            }
            else {
              nueva_fila = true;
            }
          }
  
          // si cambio de pregunta insertamos fila nueva
          if (nueva_fila) {
            preg_resul.push(
              {
                preg_id : results[i].pre_id,
                preg_tit: results[i].pre_pregunta,
                resp_tit: [ results[i].valor ],
                resp_num: [ results[i].contador ],
                tipo: [  results[i].tipo ]
              }
            );
            indice++;
          }
        }

        // mostramos los resultados
        var tit = idioma == 0 ? 'Resultats' : 'Resultados';
         
        res.render('results', {titulo: tit, hay: true, results: preg_resul, idioma: idioma});
    } else {
        var tit = idioma == 0 ? 'Sense resultats' : 'Sin resultados';
         
        res.render('results', {titulo: tit, hay: false, idioma: idioma});
    }
  });
  connection.end();
}

export default getResults;
