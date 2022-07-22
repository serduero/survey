import express from 'express';
const { Router } = express;
const router = Router();

router.get('/', (req,resp) => resp.render('index', {titulo: 'Principal', navPasw: true}));
router.get('/survey', (req,resp) => resp.render('survey', {titulo: 'Enquesta', navPasw: false}));
router.get('/password', (req,resp) => resp.render('password', {titulo: 'Canvi paraula clau', navPasw: false}));

// TODO: cualquier otra ruta retorne 404

export default router;