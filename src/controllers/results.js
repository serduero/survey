import mysql from 'mysql';
import { getUrlParameter, obtenerAhora } from './funciones.js';
import { database } from './database.js';

const { createConnection } = mysql;

/*
   Mostramos página de resultados de la encuesta aactual
*/

const getResults = (req, res) => {

  var idurl = getUrlParameter('idurl',req.url);

  if (idurl === false) {
    // mostramos pantalla de no encuestas
    res.render('index', {titulo: 'No trobada', navPasw: false, hay: false, visible: 'N'});
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

  `select encu.titulo as enc_titulo, preg.id as pre_id, preg.texto as pre_pregunta, resp.valor0 as val0,
        resp.valor1 as val1, resp.valor2 as val2, resp.valor3 as val3, resp.valor4 as val4, resp.valor5 as val5,
        resp.valor6 as val6, resp.valor7 as val7, resp.valor8 as val8, resp.valor9 as val9,
        resv.numresp as respuesta
   from respvecino resv, encuesta encu, pregunta preg, respuesta resp
   where encu.inicio<=${ahora} and encu.fin>=${ahora} and encu.activa="S" and encu.idurl="${idurl}" and
   resv.encuesta=encu.id and resv.pregunta=preg.id and preg.id=resp.pregunta
   order by resv.pregunta, resv.numresp`;

  // console.log(sql);

  // Lanzamos query y revisamos resultado
  connection.query(sql, (error, results) => {
    if (error) throw error;

    // console.log(results);
    //  console.log(results[0].enc_titulo);
    
    if (results.length > 0) {

        // Rellenamos vector de preguntas (id + texto)
        var codigos = [ { id_preg: results[0].pre_id,
                          txt_preg: results[0].pre_pregunta,
                          respuesta: [results[0].val0, results[0].val1],
                          num_resps: [0, 0] } ];

        if (results[0].val2 != null) {
            codigos[0].respuesta.push(results[0].val2);
            codigos[0].num_resps.push(0);
        }
        if (results[0].val3 != null) {
            codigos[0].respuesta.push(results[0].val3);
            codigos[0].num_resps.push(0);
        }
        if (results[0].val4 != null) {
            codigos[0].respuesta.push(results[0].val4);
            codigos[0].num_resps.push(0);
        }
        if (results[0].val5 != null) {
            codigos[0].respuesta.push(results[0].val5);
            codigos[0].num_resps.push(0);
        }
        if (results[0].val6 != null) {
            codigos[0].respuesta.push(results[0].val6);
            codigos[0].num_resps.push(0);
        }
        if (results[0].val7 != null) {
            codigos[0].respuesta.push(results[0].val7);
            codigos[0].num_resps.push(0);
        }
        if (results[0].val8 != null) {
            codigos[0].respuesta.push(results[0].val8);
            codigos[0].num_resps.push(0);
        }
        if (results[0].val9 != null) {
            codigos[0].respuesta.push(results[0].val9);
            codigos[0].num_resps.push(0);
        }
        codigos[0].num_resps[results[0].respuesta] ++;

        var actualIdpreg = results[0].pre_id;

        var j = 0; // indice al último elemento a rellenar de la salida "codigos"

        for (var i=1; i<results.length; i++) {
            // Si hay cambio de pregunta nuevo elemento desde 0
            if (results[i].pre_id != actualIdpreg) {
                codigos.push({ id: results[i].pre_id,
                                 txt_preg: results[i].pre_pregunta,
                                 respuesta: [results[i].val0, results[i].val1],
                                 num_resps: [0, 0]});
                
                j++; // un elemento más en la salida

                if (results[i].val2 != null) {
                    codigos[j].respuesta.push(results[i].val2);
                    codigos[j].num_resps.push(0);
                }
                if (results[i].val3 != null) {
                    codigos[j].respuesta.push(results[i].val3);
                    codigos[j].num_resps.push(0);
                }
                if (results[i].val4 != null) {
                    codigos[j].respuesta.push(results[i].val4);
                    codigos[j].num_resps.push(0);
                }
                if (results[i].val5 != null) {
                    codigos[j].respuesta.push(results[i].val5);
                    codigos[j].num_resps.push(0);
                }
                if (results[i].val6 != null) {
                    codigos[j].respuesta.push(results[i].val6);
                    codigos[j].num_resps.push(0);
                }
                if (results[i].val7 != null) {
                    codigos[j].respuesta.push(results[i].val7);
                    codigos[j].num_resps.push(0);
                }
                if (results[i].val8 != null) {
                    codigos[j].respuesta.push(results[i].val8);
                    codigos[j].num_resps.push(0);
                }
                if (results[i].val9 != null) {
                    codigos[j].respuesta.push(results[i].val9);
                    codigos[j].num_resps.push(0);
                }
                codigos[j].num_resps[results[i].respuesta] ++;
                actualIdpreg = results[i].pre_id;
            } else {
                // Si no hay cambio de pregunta incrementamos contador de respuestas
                codigos[j].num_resps[results[i].respuesta] ++;
            }
        }
        // console.log(codigos);

        // mostramos los resultados
        res.render('results', {titulo: 'Resultats', hay: true, results: codigos});
    } else {
        res.render('results', {titulo: 'Sense resultats', hay: false});
    }
  });
  connection.end();
}

export default getResults;
