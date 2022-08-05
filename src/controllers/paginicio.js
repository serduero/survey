import mysql from 'mysql';
const { createConnection } = mysql;

/*
   Mostramos página de inicio en función de si hay o no encuestas activas
*/

const getSurvey = (req, res) => {

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

  // Miramos si hay encuestas activas hoy
  var sql = `select * from encuesta where inicio<=${ahora} and fin>=${ahora} and activa="S"`;
  // console.log(sql);

  // Lanzamos query y revisamos resultado
  connection.query(sql, (error, results) => {
    if (error) throw error;

    // console.log(results);
    // console.log(results[0].titulo);
    
    if (results.length > 0) {
      // mostramos acceso a la encuesta (hay datos)
      res.render('index', {titulo: 'Principal', navPasw: false, hay: true});
    } else {
      // mostramos pantalla de no encuestas
      res.render('index', {titulo: 'Sense enquestes actives', navPasw: false, hay: false});
    }
  });
  connection.end();
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

export default getSurvey;
