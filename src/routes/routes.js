import express from 'express';
const { Router } = express;
const router = Router();

import getSurvey from '../controllers/paginicio.js';
import putSurvey from '../controllers/pagencuesta.js';
import chgPassw from '../controllers/pagpassw.js';
import insForm from '../controllers/insForm.js';
import inicio from '../controllers/inicio.js';

// Página principal
router.get('/:parms', getSurvey);

// Página de la encuesta
router.get('/survey/:parms', putSurvey);

// Página de tratamiento palabra clave
router.get('/password', chgPassw);

// Insertar formulario
router.post('/insform/:parms', insForm);

// Página tras contestar
router.get('/', inicio);

export default router;