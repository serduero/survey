import express from 'express';
const { Router } = express;
const router = Router();

import getSurvey from '../controllers/paginicio.js';
import putSurvey from '../controllers/pagencuesta.js';
import chgPassw from '../controllers/pagpassw.js';
import insForm from '../controllers/insForm.js';
import inicio from '../controllers/inicio.js';
import getResults from '../controllers/results.js';
import isrtImag from '../controllers/isrtImag.js';
import delImag from '../controllers/delImag.js';
import mImage from '../controllers/multer.js';

// import multer from 'multer';

// // Obtenemos la imagen via multer
// var storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         // directorio donde se guardará la imagen
//         callBack(null, './src/public/images/');
//     },
//     filename: (req, file, callBack) => {
//         // nombre que contendrá la imagen
//         callBack(null, file.originalname);
//     }
// });

// var upload = multer({
//     storage: storage
// });

// Página principal
router.get('/:parms', getSurvey);

// Página de la encuesta
router.get('/survey/:parms', putSurvey);

// Página de tratamiento palabra clave
router.get('/password', chgPassw);

// Insertar formulario
router.post('/insform/:parms', insForm);

// Resultados actuales
router.get('/results/:parms', getResults);

// Página tras contestar
router.get('/fi/:parms', inicio);

// Insertar imagen
router.post('/isrtImag', mImage.single('picture'), isrtImag);

// Borrar imagen
router.delete('/delImag', delImag);

export default router;