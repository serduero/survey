import mysql from 'mysql';
import { getUrlParameter, obtenerAhora } from './funciones.js';
import { database } from './database.js';

const { createConnection } = mysql;

/*
   Validamos e insertamos las respuestas al formulario
*/

const insForm = (req, res) => {

  var actualizar = true;
  var missatge = '';

  let idurl = getUrlParameter('idurl',req.url);
  var idioma = getUrlParameter('id',req.url);

  if (idurl === false || (idioma != 1 && idioma != 0)) {
     // mostramos pantalla de no encuestas
     res.render('index', {titulo: 'No trobada', navPasw: false, hay: false, visible: 'N',
                          idioma: 0, imagen: ''});
     return;
  }

  // Incompatibles entre sí
  var errortxt1 = idioma == 0 ? 'Error: inesperat' : 'Error inesperado';

  // Validamos que vengan los datos del encuestado
  if (req.body[1] == '') {
    missatge = errortxt1;
    actualizar = false;
  }

  if (!actualizar) {
    res.send(missatge);
    return missatge;
  }

  // en datos recogemos los datos de la entrada
  const datos = req.body[0];

  // Conectamos con la base de datos
  const connection = createConnection({
    host: database.host,user: database.user,password: database.password,
    database: database.database,charset: 'utf8mb4'
  });

  const ahora = obtenerAhora();

  /*
    validaciones antes de salvar los datos
  */

  // Miramos si la encuesta recibida es la activa
  var sql =
  `select * from encuesta where inicio<=${ahora} and fin>=${ahora} and activa="S" and idurl="${idurl}"`;

  // Lanzamos query y revisamos resultado
  connection.query(sql, (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      if (results[0].id != datos.id) {
        actualizar = false;
        missatge = idioma == 0 ? 'Enquesta rebuda inesperada' : 'Encuesta recibida inesperada';  
      }
    } else {
      actualizar = false;
      missatge = idioma == 0 ? 'Cap enquesta activa' : 'Ninguna encuesta activa';
    }

    // Miramos si coincide o no el id de la últ pregunta con la recibida
    // una fila por cada pregunta de la encuesta (no se mira las respuestas)
    sql =  `select enc.id as      enc_num,
            enc.titulo as         enc_tit,
            enc.observaciones as  enc_obs,
            enc.comunidad as      enc_com,

            preg.id as            pre_num,
            preg.texto as         pre_txt,
            preg.num_opciones as  pre_nop,
            preg.observaciones as pre_obs

            from encuesta enc, pregunta preg
    where enc.inicio<=${ahora} and enc.fin>=${ahora}
      and enc.activa = 'S'
      and enc.idurl = "${idurl}"
      and enc.id = preg.encuesta
    
    order by preg.id
    `;
    
    var tipo_encuesta = '';

    connection.query(sql, (error, results) => {
      if (error) throw error;
  
      if (results.length > 0) {
        var ult_leida = results.length - 1;
        var ult_entra = datos.pregunta.length - 1;
        
        // validación simple para ver que la primera y última preguntas coinciden con lo que nos llega
        if ((results[0].pre_num != datos.pregunta[0]) ||
            (results[ult_leida].pre_num != datos.pregunta[ult_entra])) {
           actualizar = false;
           missatge = idioma == 0 ? 'No coincideixen les preguntes' : 'No coinciden las preguntas';  
        } 
      } else {
         actualizar = false;
         missatge = idioma == 0 ? 'Sense preguntes actives' : 'Sin preguntas activas';
      }

      // Si todo ha ido bien, actualizamos la BBDDs
      if (actualizar) {
        var i = 0;
        var objeto_ins = new Object();
        const dato_origen = req.body[1];
        const dato_encuesta = parseInt(datos.id);

        // borramos los posibles valores previos si los hubiera
        sql = `delete from respvecino where encuesta=${dato_encuesta} and 
              origen="${dato_origen}"`;

        connection.query(sql, (error) => {
          if (error) throw error;

          sql = 'insert into respvecino set ?';

          for (i=0; i<datos.pregunta.length; i++) {
  
            if (datos.respondido[i]) {
              // sólo guardamos los "respondido == true"
  
              objeto_ins = {
                origen: dato_origen,
                encuesta: dato_encuesta,
                pregunta: parseInt(datos.pregunta[i]),
                numresp: parseInt(datos.respuestas[i]),
                adicional: datos.txt_adic[i]
              };
              
              connection.query(sql, objeto_ins, (error) => {
                if (error) throw error;
                  // Grabado ok
              });
            }
          }
          connection.end();

          res.send('');
        });
      } else {
        // Si no actualizar
        connection.end();

        res.send(missatge);
        return missatge;
      }
    });
  });
}

export default insForm;
