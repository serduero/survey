import mysql from 'mysql';
const { createConnection } = mysql;

/*
   Validamos e insertamos las respuestas al formulario
*/

const insForm = (req, res) => {

  var actualizar = true;
  const bloques = ['12C', '14B', '16A'];
  const pisos = ['1', '2', '3'];
  const puertas = ['1', '2', '3'];
  var missatge = '';

  // console.log(req.body);

  // Validamos el bloque, piso y puerta
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

  if (!actualizar) {
    res.send(missatge);
    return missatge;
  }

  const datos = req.body[0];

  // console.log('quien      : ' + req.body[1] + req.body[2] + req.body[3]);
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
        missatge = 'Enquesta rebusa inesperada';  
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
      and enc.id = preg.encuesta
      and preg.id = resp.pregunta
    `;

    connection.query(sql, (error, results) => {
      if (error) throw error;
  
      if (results.length > 0) {
        const numero = results.length-1;
        const objeto = results[numero];

        if (objeto.pre_num != datos.pregunta[0]) {
           actualizar = false;
           missatge = 'No coincideixen les preguntes';  
        }
      } else {
         actualizar = false;
         missatge = 'Sense preguntes actives';
      }

      // Si todo ha ido bien, actualizamos la BBDDs
      if (actualizar) {
        var i = 0;
        var objeto = new Object();
        const elpiso = req.body[1].substr(0,2) + req.body[2] + req.body[3];

        // console.log('quien      : ' + req.body[1] + req.body[2] + req.body[3]);
        // console.log('id encuesta: ' + datos.id);
        // console.log('id preguntas : ' + datos.pregunta);
        // console.log('num opciones : ' + datos.numopciones);
        // console.log('id respuestas: ' + datos.respuestas);
        // console.log('respuestas   : ' + datos.respondido);

        sql = 'insert into respvecino set ?';

        for (i=0; i<datos.pregunta.length; i++) {

          if (datos.respondido[i]) {

            objeto = {
              piso: elpiso,
              encuesta: parseInt(datos.id),
              pregunta: parseInt(datos.pregunta[i]),
              numresp: parseInt(datos.respuestas[i])
            };
            
            // console.log(objeto);

            connection.query(sql, objeto, (error) => {
              if (error) throw error;
                // console.log("grabado ok");
            });
          }
        }
        connection.end();
         
        res.send('');
         
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
