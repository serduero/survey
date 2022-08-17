import express from 'express';
const { Router } = express;
const router = Router();

import control from '../controllers/control.js';
import getSurvey from '../controllers/paginicio.js';
import putSurvey from '../controllers/pagencuesta.js';
import chgPassw from '../controllers/pagpassw.js';
import insForm from '../controllers/insForm.js';
import inicio from '../controllers/inicio.js';
import getResults from '../controllers/results.js';
import isrtImag from '../controllers/isrtImag.js';
import delImag from '../controllers/delImag.js';
import mImage from '../controllers/multer.js';
import sendMail from '../controllers/sendMail.js';
import reqImags from '../controllers/reqImags.js';

// Control de acceso
router.all('*', control);

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

// Listar imágenes
router.get('/reqImags/:parms', reqImags);

// Insertar imagen
router.post('/isrtImag/:parms', mImage.single('picture'), isrtImag);

// Borrar imagen
router.delete('/delImag/:parms', delImag);

// Enviar correo
router.post('/sendMail/:parms', sendMail);

export default router;