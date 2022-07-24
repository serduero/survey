import express from 'express';
const { Router } = express;
const router = Router();

import getSurvey from '../controllers/paginicio.js';
import putSurvey from '../controllers/pagencuesta.js';
import chgPassw from '../controllers/pagpassw.js';
import insForm from '../controllers/insForm.js';

// Página principal
router.get('/', getSurvey);

// Página de la encuesta
router.get('/survey', putSurvey);

// Página de tratamiento palabra clave
router.get('/password', chgPassw);

// Insertar formulario
router.post('/insform', insForm);

export default router;