import express from 'express';

// Creamos servidor
const server = express();

// página a pintar
import indexRoutes from "./routes/index.js";
const port = 8001;

// para poder usar __dirname
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// definimos la ruta dondes están todos los archivos. con join no tenemos que mirar si / o \ (por el S.O.)
server.set('views', join(__dirname, 'views'));

// definimos el motor de plantillas
server.set('view engine', 'ejs');

// indicamos donde está el enrutamiento
server.use(indexRoutes);

// indicamos donde están los ficheros para poder ser usados en las páginas
server.use(express.static(join(__dirname, 'public')));

// Escuchamos por el puerto port
server.listen(port, () => {
  console.log(`Listen on port ${port}`);
});