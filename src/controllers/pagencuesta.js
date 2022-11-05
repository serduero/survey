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
  
  var preguntas = [];
  var cajetines = [];
  var exclusiones = [];
   
  var modelo = -1;
  var nueva_fila = false;
  var indice = 0;

  // Obtenemos las preguntas
  var sql =
    `select enc.id as             enc_num,
            enc.titulo as         enc_tit,
            enc.observaciones as  enc_obs,
            enc.comunidad as      enc_com,
            enc.defModelo as      enc_mod,
            enc.usuario as        enc_usu,

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

  // Lanzamos query y revisamos resultado
  connection.query(sql, (error, results) => {
    if (error)
      throw error;

    if (results.length > 0) {
      // cargamos los datos de pregunta y respuestas para pasarlos al render: una fila por pregunta
      preguntas = [];
      nueva_fila = false;
      indice = 0;

      for (var i = 0; i < results.length; i++) {
        if (i == 0) {
          nueva_fila = true;
        }
        else {
          if (preguntas[indice - 1].pre_num == results[i].pre_num) {
            // id y valor de la respuesta
            preguntas[indice - 1].res_id.push(results[i].res_id);
            preguntas[indice - 1].res_val.push(results[i].res_val);
            preguntas[indice - 1].res_tip.push(results[i].res_tip);

            nueva_fila = false;
          }
          else {
            nueva_fila = true;
          }
        }

        // si cambio de pregunta insertamos fila nueva
        if (nueva_fila) {
          let operador = results[i].pre_ope == '=' ? 'igual' : results[i].pre_ope == '>' ? 'mayor' : 'menor';

          preguntas.push(
            {
              enc_num: results[i].enc_num,
              enc_tit: results[i].enc_tit,
              enc_obs: results[i].enc_obs,
              enc_com: results[i].enc_com,

              pre_num: results[i].pre_num,
              pre_txt: results[i].pre_txt,
              pre_nop: results[i].pre_nop,
              pre_ope: operador,
              pre_obs: results[i].pre_obs,

              res_id: [results[i].res_id],
              res_val: [results[i].res_val],
              res_tip: [results[i].res_tip]
            }
          );
          indice++;
        }
      }
      // indicamos el título
      let titulo = idioma == 0 ? 'Enquesta' : 'Encuesta';
      let usuario = results[0].enc_usu;

      // Obtenemos datos del encuestado: cajetines
      modelo = results[0].enc_mod; //  id del modelo

      sql =
        `select caj.cajetin as    caj_num,
                def.descrWeb as   caj_lit,
                def.tipoDato as   caj_tipo,
                def.min as        caj_min,
                def.max as        caj_max,
                def.texto as      caj_txt,
                val.idDato as     val_idDato,
                val.dato as       val_txt

        from cajetinesModelo caj, defCajetines def
             left join defValoresEnc val
             on def.idDato=val.defCajetin
               and val.usuario=def.usuario

        where caj.modelo=${modelo} and
              caj.cajetin=def.idDato and
              def.usuario=${usuario}
        
        order by caj.cajetin asc, val.idDato asc
        `;

      connection.query(sql, (error, results) => {
        if (error)
          throw error;

        // guardamos los datos de los cajetines
        cajetines = [];
        nueva_fila = false;
        indice = 0;
  
        for (var i = 0; i < results.length; i++) {
          if (i == 0) {
            nueva_fila = true;
          }
          else {
            if (cajetines[indice - 1].caj_num == results[i].caj_num) {
              // desplegable: id y su valor
              cajetines[indice - 1].val_idDato.push(results[i].val_idDato);
              cajetines[indice - 1].val_txt.push(results[i].val_txt);
  
              nueva_fila = false;
            }
            else {
              nueva_fila = true;
            }
          }
  
          // si cambio de pregunta insertamos fila nueva
          if (nueva_fila) {

            cajetines.push(
              {
                caj_num: results[i].caj_num,
                caj_lit: results[i].caj_lit,

                caj_tipo: results[i].caj_tipo,

                caj_min: results[i].caj_min,
                caj_max: results[i].caj_max,
                caj_txt: results[i].caj_txt,

                val_idDato: results[i].val_idDato == null ?
                  null : [ results[i].val_idDato ],
                val_txt: results[i].val_txt == null ?
                  null : [ results[i].val_txt ],
              }
            );
            indice++;
          }
        }

        if (results.length > 0) {

          // Obtenemos datos del encuestado: las posibles exclusiones

          sql =
            `select id1 as exc_id1,
                    id2 as exc_id2
            from defExcepciones
            where modelo=${modelo}
            order by id1 asc, id2 asc
            `;

          connection.query(sql, (error, results) => {
            if (error)
              throw error;

            // guardar datos de las exclusiones
            exclusiones = [];
            nueva_fila = false;
            indice = 0;
      
            for (var i = 0; i < results.length; i++) {
              if (i == 0) {
                nueva_fila = true;
              }
              else {
                // desplegable: id y su valor
                exclusiones[indice - 1].exc_id1.push(results[i].exc_id1);
                exclusiones[indice - 1].exc_id2.push(results[i].exc_id2);
      
                nueva_fila = false;
              }
      
              // si cambio de pregunta insertamos fila nueva
              if (nueva_fila) {

                exclusiones.push(
                  {
                    exc_id1: [ results[i].exc_id1 ],
                    exc_id2: [ results[i].exc_id2 ]
                  }
                );
                indice++;
              }
            }

            // Finalmente montamos la pantalla con todo
            res.render('survey', { titulo: titulo,
              valores: preguntas,
              cajetines: cajetines, exclusiones: exclusiones,
              idioma: idioma });
          });
          connection.end();
        }
      });
    } else {
      // mostramos pantalla de no encuestas
      res.render('index', {
        titulo: 'Sense enquestes actives', navPasw: false, hay: false,
        visible: 'N', idioma: 0, imagen: ''
      });
      connection.end();
    }
  });
}

export default putSurvey;