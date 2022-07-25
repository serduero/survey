import mysql from 'mysql';
const { createConnection } = mysql;

/*
   Validamos e insertamos las respuestas al formulario
*/

const insForm = (req, res) => {

  var actualizar = true;
  const bloques = ['2A', '2B', '12C', '14B', '16A'];
  const pisos = ['B', '1', '2', '3', '4', '5'];
  const puertas = ['1', '2', '3'];
  var plaza_parking = '';
  var missatge = '';

  // console.log(req.body);

  // Validamos el bloque, piso, puerta y plaza parking

  // Incompatibles entre sí
  if (req.body[4] != '') {
    if (req.body[1] != '' || req.body[2] != '' || req.body[3] != '') {
      missatge = 'Error: inesperat ' + req.body[4] + ' ' + req.body[1] + ' ' + req.body[2] + ' ' + req.body[3];
      actualizar = false;
    } else {
      // Validamos el número del parking
      if (isNaN(parseFloat(req.body[4])) || !isFinite(req.body[4])) {
          missatge = 'Plaça de parking incorrecta';
          actualizar = false;
      } else {
          // Validamos posibles decimanles
          const num_dec = parseFloat(req.body[4]);
          const num_int = parseInt(req.body[4]);
          if (num_dec != num_int) {
              missatge = 'Número de plaça de parking incorrecte';
              actualizar = false;
          } else {
              // Y que sea un número OK
              if (num_int < 1 || num_int > 77) {
                  missatge = 'Plaça de parking inexistent';
                  actualizar = false;
              } else {
                plaza_parking = req.body[4] + '';
              }
          }
      }
    }
  } else {
    // Si no hay parking miramos los valores ok's de bloque, piso y puerta
    if (!bloques.includes(req.body[1])) {
      missatge = 'Error: No está el bloque ' + req.body[1];
      actualizar = false;
    }
    if (!pisos.includes(req.body[2])) {
      missatge = 'Error: No está el piso ' + req.body[2];
      actualizar = false;
    }
    if (!puertas.includes(req.body[3])) {
      missatge = 'Error: No está la puerta ' + req.body[3];
      actualizar = false;
    }

    // Y la coherencia entre bloque y piso
    if (req.body[1] == '2A' || req.body[1] == '2B') {
      if (req.body[2] == 'B') {
          missatge = 'Error: No hi ha baixos en aquest Bloc ' + req.body[1] + ' ' + req.body[2];
          actualizar = false;
      }
    } else {
        if (req.body[2] == '4' || req.body[2] == '5') {
            missatge = 'Error: Solament hi ha 3 pisos en aquest Bloc ' + req.body[1] + ' ' + req.body[2];
            actualizar = false;
        }
    }
  }
 
  if (!actualizar) {
    res.send(missatge);
    return missatge;
  }

  const datos = req.body[0];

  // console.log('quien      : ' + req.body[1] + req.body[2] + req.body[3] + plaza_parking);
  // console.log('id encuesta: ' + datos.id);
  // console.log('id preguntas : ' + datos.pregunta);
  // console.log('num opciones : ' + datos.numopciones);
  // console.log('id respuestas: ' + datos.respuestas);
  // console.log('respuestas   : ' + datos.respondido);

  const database = {
    host: "b5s1p7ubh0ujcnb6jdxc-mysql.services.clever-cloud.com",
    user:  "u2svqk5ihhqfkfab",
    password: "QmEr4Kh7yrgGcH0nKFcw",
    database: "b5s1p7ubh0ujcnb6jdxc",
  };

  /*
  const database =
  {
    host: process.env.DATABASE_HOST,user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,database: process.env.DATABASE_NAME,
  };*/

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
  var sql = `select * from encuesta where inicio<=${ahora} and fin>=${ahora}`;
  // console.log(sql);

  // Lanzamos query y revisamos resultado
  connection.query(sql, (error, results) => {
    if (error) throw error;

    // console.log(results);
    // console.log(results[0].id);
    
    if (results.length > 0) {
      if (results[0].id != datos.id) {
        actualizar = false;
        missatge = 'Enquesta rebuda inesperada';  
      }
    } else {
      actualizar = false;
      missatge = 'Cap enquesta activa';
    }
    // console.log('2 ? ' + actualizar + ' ' + missatge);

    // Miramos si coincide o no el id de la últ pregunta con la recibida
    sql =  `select enc.id as      enc_num,
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
      and enc.activa = 'S'
      and enc.id = preg.encuesta
      and preg.id = resp.pregunta
    `;

    var tipo_encuesta = '';

    connection.query(sql, (error, results) => {
      if (error) throw error;
  
      if (results.length > 0) {
        const numero = results.length-1;
        const objeto_res = results[numero];
        
        // Nos guardamos el tipo de la encuesta
        tipo_encuesta = objeto_res.enc_com;

        if (objeto_res.pre_num != datos.pregunta[0]) {
           actualizar = false;
           missatge = 'No coincideixen les preguntes';  
        } else {
          // Si es de parking no debe venir más que la plaza
          if (tipo_encuesta == 'P' && (req.body[1] != '' || req.body[2] != '' || req.body[3] != '' || plaza_parking == '')) {
            actualizar = false;
            missatge = 'Enquesta rebuda no correcta ' + req.body[1] + ' ' + req.body[2] + ' ' + req.body[3];  
          }
        }
      } else {
         actualizar = false;
         missatge = 'Sense preguntes actives';
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

        console.log(sql);
        connection.query(sql, (error, results) => {
          if (error) throw error;

          sql = 'insert into respvecino set ?';

          for (i=0; i<datos.pregunta.length; i++) {
  
            if (datos.respondido[i]) {
  
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
        connection.end();
         
        res.send(missatge);
        return missatge;
      }
    });
  });
}

// Obtiene la fecha del servidor en AAAAMMDD (en número)
function obtenerAhora() {
  let date_ob = new Date();

  let date = ('0' + date_ob.getDate()).slice(-2);
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let fecha = parseInt(year + month + date);
  
  return fecha;
}

export default insForm;
