import mysql from 'mysql';
import { getUrlParameter, obtenerAhora } from './funciones.js';
import { database } from './database.js';

const { createConnection } = mysql;

/*
   Validamos e insertamos las respuestas al formulario
*/

const insForm = (req, res) => {

  // console.log('en insForm');

  var actualizar = true;
  const bloques = ['2A', '2B', '12C', '14B', '16A'];
  const pisos = ['B', '1', '2', '3', '4', '5'];
  const puertas = ['1', '2', '3'];
  var plaza_parking = '';
  var missatge = '';

  let idurl = getUrlParameter('idurl',req.url);
  var idioma = getUrlParameter('id',req.url);

  if (idurl === false || (idioma != 1 && idioma != 0)) {
     // mostramos pantalla de no encuestas
     res.render('index', {titulo: 'No trobada', navPasw: false, hay: false, visible: 'N', idioma: 0});
     return;
  }

  // console.log(req.body[0]);
  // console.log(req.body[1]);
  // console.log(req.body[2]);
  // console.log(req.body[3]);
  // console.log(req.body[4]);

  // Validamos el bloque, piso, puerta y plaza parking

  // Incompatibles entre sí
  var errortxt1 = idioma == 0 ? 'Error: inesperat' : 'Error inesperado';
  var errortxt2 = idioma == 0 ? 'Plaça de parking incorrecta' : 'Plaza de parking incorrecta';
  var errortxt3 = idioma == 0 ? 'Número de plaça de parking incorrecte' : 'Número de plaza de parking incorrecto';
  var errortxt4 = idioma == 0 ? 'Plaça de parking inexistent' : 'Plaza de parking inexistente';

  if (req.body[4] != '') {
    // Si número de parking informado es de parking. Validamos todos los campos de comunidad parking
    if (req.body[1] != '' || req.body[2] != '' || req.body[3] != '') {
      missatge = errortxt1 + ' ' + req.body[4] + ' ' + req.body[1] + ' ' + req.body[2] + ' ' + req.body[3];
      actualizar = false;
    } else {
      // Validamos el número del parking
      if (isNaN(parseFloat(req.body[4])) || !isFinite(req.body[4])) {
          missatge = errortxt2;
          actualizar = false;
      } else {
          // Validamos posibles decimanles
          const num_dec = parseFloat(req.body[4]);
          const num_int = parseInt(req.body[4]);
          if (num_dec != num_int) {
              missatge = errortxt3;
              actualizar = false;
          } else {
              // Y que sea un número OK
              if (num_int < 1 || num_int > 77) {
                  missatge = errortxt4;
                  actualizar = false;
              } else {
                plaza_parking = req.body[4] + '';
              }
          }
      }
    }
  } else {
    // Si número de parking no informado es que no es de parking. Validamos todos los campos de comunidad no parking
    errortxt1 = idioma == 0 ? 'Error: No està el bloc' : 'Error: No está el bloque';
    errortxt2 = idioma == 0 ? 'Error: No està el pis' : 'Error: No está el piso';
    errortxt3 = idioma == 0 ? 'Error: No està la porta' : 'Error: No está la puerta';
     
    // Si no hay parking miramos los valores ok's de bloque, piso y puerta
    if (!bloques.includes(req.body[1])) {
      missatge = errortxt1 + ' ' + req.body[1];
      actualizar = false;
    }
    if (!pisos.includes(req.body[2])) {
      missatge = errortxt2 + ' ' + req.body[2];
      actualizar = false;
    }
    if (!puertas.includes(req.body[3])) {
      missatge = errortxt3 + ' ' + req.body[3];
      actualizar = false;
    }

    errortxt1 = idioma == 0 ? 'Error: No hi ha baixos en aquest Bloc' : 'Error: No hay bajos en este Bloque';
    errortxt2 = idioma == 0 ? 'Error: Solament hi ha 3 pisos en aquest Bloc' : 'Error: Solamente hay 3 pisos en este Bloque';

    // Y la coherencia entre bloque y piso
    if (req.body[1] == '2A' || req.body[1] == '2B') {
      if (req.body[2] == 'B') {
          missatge = errortxt1 + ' ' + req.body[1] + ' ' + req.body[2];
          actualizar = false;
      }
    } else {
        if (req.body[2] == '4' || req.body[2] == '5') {
            missatge = errortxt2 + ' ' + req.body[1] + ' ' + req.body[2];
            actualizar = false;
        }
    }
  }
 
  if (!actualizar) {
    res.send(missatge);
    return missatge;
  }

  // en datos recogemos los datos de la entrada
  const datos = req.body[0];

  // console.log('quien      : ' + req.body[1] + req.body[2] + req.body[3] + plaza_parking);
  // console.log('id encuesta: ' + datos.id);
  // console.log('id preguntas : ' + datos.pregunta);
  // console.log('num opciones : ' + datos.numopciones);
  // console.log('id respuestas: ' + datos.respuestas);
  // console.log('respuestas   : ' + datos.respondido);

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
  // console.log(sql);

  // Lanzamos query y revisamos resultado
  connection.query(sql, (error, results) => {
    if (error) throw error;

    // console.log(results);
    // console.log(results[0].id);
    
    if (results.length > 0) {
      if (results[0].id != datos.id) {
        actualizar = false;
        missatge = idioma == 0 ? 'Enquesta rebuda inesperada' : 'Encuesta recibida inesperada';  
      }
    } else {
      actualizar = false;
      missatge = idioma == 0 ? 'Cap enquesta activa' : 'Ninguna encuesta activa';
    }
    // console.log('2 ? ' + actualizar + ' ' + missatge);

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
    // console.log(sql);
    
    var tipo_encuesta = '';

    connection.query(sql, (error, results) => {
      if (error) throw error;
  
      // console.log('query validacion:');
      // console.log(results);
       
      if (results.length > 0) {
        var ult_leida = results.length - 1;
        var ult_entra = datos.pregunta.length - 1;
        
        // Nos guardamos el tipo de la encuesta (qué comunidad)
        tipo_encuesta = results[0].enc_com;

        // validación simple para ver que la primera y última preguntas coinciden con lo que nos llega
        if ((results[0].pre_num != datos.pregunta[0]) ||
            (results[ult_leida].pre_num != datos.pregunta[ult_entra])) {
           actualizar = false;
           missatge = idioma == 0 ? 'No coincideixen les preguntes' : 'No coinciden las preguntas';  
        } else {
          // Si es de parking no debe venir más que la plaza
          if (tipo_encuesta == 'P' && (req.body[1] != '' || req.body[2] != '' || req.body[3] != '' || plaza_parking == '')) {
            actualizar = false;
            errortxt1 = idioma == 0 ? 'Enquesta rebuda no és correcta' : 'Encuesta recibida no es correcta';
            missatge = errortxt1 + ' ' + req.body[1] + ' ' + req.body[2] + ' ' + req.body[3];  
          }
        }
      } else {
         actualizar = false;
         missatge = idioma == 0 ? 'Sense preguntes actives' : 'Sin preguntas activas';
      }

      // Si todo ha ido bien, actualizamos la BBDDs
      if (actualizar) {
        var i = 0;
        var objeto_ins = new Object();
        const dato_elpiso = tipo_encuesta == 'P' ? plaza_parking : req.body[1].substr(0,2) + req.body[2] + req.body[3];
        const dato_encuesta = parseInt(datos.id);

        // console.log('quien      : ' + req.body[1] + req.body[2] + req.body[3] + ' P:' + plaza_parking);
        // console.log('id encuesta: ' + datos.id);
        // console.log('id preguntas : ' + datos.pregunta);
        // console.log('num opciones : ' + datos.numopciones);
        // console.log('id respuestas: ' + datos.respuestas);
        // console.log('respuestas   : ' + datos.respondido);

        // borramos los posibles valores previos si los hubiera
        sql = `delete from respvecino where encuesta=${dato_encuesta} and piso="${dato_elpiso}"`;

        // console.log(sql);
        connection.query(sql, (error, results) => {
          if (error) throw error;

          sql = 'insert into respvecino set ?';

          for (i=0; i<datos.pregunta.length; i++) {
  
            if (datos.respondido[i]) {
              // sólo guardamos los "respondido == true"
  
              objeto_ins = {
                piso: dato_elpiso,
                encuesta: dato_encuesta,
                pregunta: parseInt(datos.pregunta[i]),
                numresp: parseInt(datos.respuestas[i])
              };
              
              // console.log(objeto_ins);
  
              connection.query(sql, objeto_ins, (error) => {
                if (error) throw error;
                  // console.log("grabado ok");
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
